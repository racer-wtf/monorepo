"use client";

import { ReactNode } from "react";
import { State } from "wagmi";
import { WagmiProvider } from "wagmi";

import { siweConfig } from "@/config/siwe";
import { config } from "@/config/wagmi";
import { env } from "@/env";
import { createWeb3Modal } from "@web3modal/wagmi/react";

createWeb3Modal({
  wagmiConfig: config,
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  enableAnalytics: true,
  enableOnramp: true,
  themeVariables: {
    "--w3m-font-family": "var(--font-geist-mono)",
    "--w3m-border-radius-master": "0",
    "--w3m-accent": "#e50912",
  },
  siweConfig,
});

export const Web3ModalProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
};
