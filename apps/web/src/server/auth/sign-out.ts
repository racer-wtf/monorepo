"use server";

import { Result } from "@/types";

export const signOut = async (): Promise<Result<null>> => {
  console.log("Signed out");

  return { ok: true, data: null };
};
