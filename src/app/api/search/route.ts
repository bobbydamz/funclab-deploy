import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RESULT_LIMIT = 8;

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { benefitTags: { has: q } },
      ],
    },
    take: RESULT_LIMIT,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    results: products.map((p) => ({ slug: p.slug, name: p.name, image: p.image, price: p.price })),
  });
}
