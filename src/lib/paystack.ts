import crypto from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY env var is required.");
  return key;
}

export type PaystackTransaction = {
  status: boolean;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number; // kobo
    currency: string;
  };
};

/** Confirms a transaction server-side after the Inline popup reports success -- never trust the client callback alone. */
export async function verifyTransaction(reference: string): Promise<PaystackTransaction["data"]> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });
  const body = (await res.json()) as PaystackTransaction | { status: false; message: string };
  if (!res.ok || !body.status) {
    throw new Error("message" in body ? body.message : "Paystack verification request failed.");
  }
  return (body as PaystackTransaction).data;
}

/** Verifies the HMAC-SHA512 signature Paystack sends on webhook requests (signed with the secret key, no separate webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
