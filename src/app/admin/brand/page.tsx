import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Manage Brand — Admin" };

export default function BrandPage() {
  return (
    <ComingSoonPage
      title="Brand management is coming soon"
      description="BioHAK Wellness currently sells under a single brand, so this isn't built yet -- ask if you want multi-brand support added."
    />
  );
}
