import { mainnet, sepolia } from "viem/chains";

import { getSession } from "@/server/auth/session";
import { signInWithEthereum } from "@/server/auth/sign-in";
import { signOut } from "@/server/auth/sign-out";
import type {
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@web3modal/siwe";
import { createSIWEConfig, formatMessage } from "@web3modal/siwe";

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [mainnet.id, sepolia.id],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce: async () => {
    return Math.random().toString(36).substring(2);
  },
  getSession: async () => {
    const session = await getSession();
    if (!session.ok) {
      return null;
    }

    const { address, chainId }: SIWESession = session.data;

    return { address, chainId };
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const result = await signInWithEthereum({
        message,
        signature,
      });

      return result.ok;
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut();

      return true;
    } catch (error) {
      return false;
    }
  },
});
