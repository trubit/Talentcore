import type { Metadata } from "next";
import "./globals.css";
import { FormModalProvider } from "@/context/FormModalContext";

export const metadata: Metadata = {
  title: "TalentCore - Modern Talent & Recruitment Platform",
  description: "Connect top graduates and emerging talent with leading employers. White-label talent acquisition, job matching, and HR placement platform.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-body bg-brand-white text-brand-dark min-h-screen">
        <FormModalProvider>
          {children}
        </FormModalProvider>
      </body>
    </html>
  );
}