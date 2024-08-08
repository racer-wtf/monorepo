import { ThemeProvider } from "next-themes";

import { CSPostHogProvider } from "@/providers/posthog";

import "./globals.css";

export const metadata = {
  title: "Racer",
  description: "I have followed setup instructions carefully",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <CSPostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
