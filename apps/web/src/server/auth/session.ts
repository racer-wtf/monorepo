"use server";

import { Result } from "@/types";

export const getSession = async (): Promise<
  Result<{ address: string; chainId: number }>
> => {
  console.log("Get session");

  return {
    ok: true,
    data: {
      address: "0x",
      chainId: 1,
    },
  };
};
