import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CouponsManager from "@/components/admin/CouponsManager";

export const metadata: Metadata = { title: "Coupons — Admin" };

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <CouponsManager
      coupons={coupons.map((c) => ({
        code: c.code,
        type: c.type,
        value: c.value,
        active: c.active,
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
      }))}
    />
  );
}
