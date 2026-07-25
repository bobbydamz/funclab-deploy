import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Report & Request — Admin" };

export default function ReportRequestPage() {
  return (
    <ComingSoonPage
      title="Report & request is coming soon"
      description="A place to flag bugs or request features from inside the admin isn't built yet -- ask if you want this added."
    />
  );
}
