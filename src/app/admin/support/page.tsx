import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Support Tickets — Admin" };

export default function SupportPage() {
  return (
    <ComingSoonPage
      title="Support tickets are coming soon"
      description="There's no customer support ticketing system yet -- ask if you want one built."
    />
  );
}
