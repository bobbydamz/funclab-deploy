import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CustomersTable from "@/components/admin/CustomersTable";

export const metadata: Metadata = { title: "Customers — Admin" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <CustomersTable
      customers={customers.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        role: c.role,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
