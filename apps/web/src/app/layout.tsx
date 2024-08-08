import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { ReactQueryProvider } from "@/components/providers/react-query";
import { Web3ModalProvider } from "@/components/providers/wallet-connect";
import { config as wagmiConfig } from "@/config/wagmi";

import "./globals.css";

export const metadata: Metadata = {
  title: "Racer",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get("cookie"),
  );

  return (
    <html suppressHydrationWarning lang="en" className={GeistMono.variable}>
      <body className="font-mono">
        <ReactQueryProvider>
          <ThemeProvider attribute="class">
            <Web3ModalProvider initialState={initialState}>
              {children}
            </Web3ModalProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}