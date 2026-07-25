import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { updateProduct, deleteProduct } from "@/lib/products";

const schema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().trim().min(1),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).nullable(),
  image: z.string().trim().min(1),
  description: z.string(),
  benefits: z.array(z.string()),
  benefitTags: z.array(z.string()),
  rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().int().min(0),
  stock: z.number().int().min(0),
  active: z.boolean(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product data" }, { status: 400 });

  try {
    const product = await updateProduct(productId, parsed.data);
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

  try {
    await deleteProduct(productId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return NextResponse.json(
        { error: "Can't delete a product that has order history — deactivate it instead." },
        { status: 409 }
      );
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    throw err;
  }
}
