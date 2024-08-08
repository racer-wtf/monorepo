import { customAlphabet } from "nanoid";

const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const nanoid = (length: number = 10) =>
  customAlphabet(alphanumeric, length);
