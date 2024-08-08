"use server";

import { Result } from "@/types";

export const signInWithEthereum = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}): Promise<Result<null>> => {
  console.log("Sign in with Ethereum");

  return { ok: true, data: null };
};
