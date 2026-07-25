import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Extra — Admin" };

export default function ExtraPage() {
  return (
    <ComingSoonPage
      title="Nothing here yet"
      description="Let me know what you'd like this section to do."
    />
  );
}
