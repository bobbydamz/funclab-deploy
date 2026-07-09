import SiteChrome from "@/components/layout/SiteChrome";
import { CartProvider } from "@/context/CartContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteChrome>{children}</SiteChrome>
    </CartProvider>
  );
}
