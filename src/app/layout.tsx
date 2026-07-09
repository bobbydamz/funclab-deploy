import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BioHAK Wellness — Clean Supplements",
  description:
    "BioHAK Wellness — Clean, science-backed supplements for real results. Shop whey protein, vitamins, omega-3 and more.",
};

// Kept deliberately minimal: the public site's chrome (Header/Footer/announcement bar)
// and the admin dashboard's shell are visually unrelated, so each lives in its own nested
// layout — (site)/layout.tsx and admin/layout.tsx — rather than both being forced through
// one shared wrapper here.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={assistant.variable}>
      <body>{children}</body>
    </html>
  );
}
