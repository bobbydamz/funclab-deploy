import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Manage Category — Admin" };

export default function CategoryPage() {
  return (
    <ComingSoonPage
      title="Category management is coming soon"
      description="Products aren't grouped into categories yet -- ask if you want a category system added to the catalog."
    />
  );
}
