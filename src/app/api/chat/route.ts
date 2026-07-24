import Anthropic from "@anthropic-ai/sdk";
import { getAllProducts } from "@/lib/products";

// Talks to a live LLM per request -- can't be statically generated.
export const dynamic = "force-dynamic";

const anthropic = new Anthropic();

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(catalog: string) {
  return `You are the BioHAK Wellness shopping assistant, embedded as a chat widget on the BioHAK Wellness website (clean, science-backed supplements).

Help visitors find the right product, answer questions about ingredients/benefits/pricing, and point them to the right page. Keep replies short and conversational (2-4 sentences, plain text, no markdown headers) -- this is a chat bubble, not an essay.

You are not a doctor. For medical questions (dosing for a condition, drug interactions, pregnancy/nursing safety) give general info only and tell the user to check with a healthcare provider before starting a supplement.

Only recommend products from the catalog below -- never invent products, prices, or claims not listed here.

Catalog:
${catalog}`;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response("Expected a trailing user message", { status: 400 });
  }

  const products = await getAllProducts();
  const catalog = products
    .map(
      (p) =>
        `- ${p.name} (₹${p.price}${p.compareAtPrice ? `, was ₹${p.compareAtPrice}` : ""}): ${p.description} Benefits: ${p.benefits.join(", ") || "n/a"}. Tags: ${p.benefitTags.join(", ") || "n/a"}. Page: /${p.slug}`
    )
    .join("\n");

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 500,
    system: buildSystemPrompt(catalog),
    output_config: { effort: "low" },
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      // "error" and "end" can both fire on the same stream (e.g. the SDK emits "end" as
      // part of tearing down after an error) -- guard so we never call close()/error() on
      // an already-settled controller.
      let settled = false;
      stream.on("text", (delta) => {
        if (!settled) controller.enqueue(encoder.encode(delta));
      });
      stream.on("end", () => {
        if (!settled) {
          settled = true;
          controller.close();
        }
      });
      stream.on("error", (err) => {
        if (!settled) {
          settled = true;
          controller.error(err);
        }
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
