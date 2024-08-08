"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";

export const ConnectButton = () => {
  const { open } = useWeb3Modal();

  return (
    <button onClick={() => open()} className="ml-auto">
      Connect
    </button>
  );
};
