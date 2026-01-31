import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AIAssistantWidget } from "@/components/ui/ai-assistant-widget";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedIn Copywriter",
  description: "AI-powered LinkedIn content generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <AIAssistantWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
