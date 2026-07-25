import type { Metadata } from "next";
import ComingSoonPage from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "System Settings — Admin" };

export default function SettingsPage() {
  return (
    <ComingSoonPage
      title="System settings are coming soon"
      description="Store-wide settings (shipping rates, free-shipping threshold, etc.) aren't editable from the admin yet -- ask if you want a settings page built."
    />
  );
}
