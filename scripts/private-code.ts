// npm run private:code
// Makes a new four-word unlock code, prints it once, and prints the hash to store in
// Vercel as PRIVATE_CODE_HASH. Nothing is written to disk. A new code voids every
// existing unlock cookie as soon as the new hash is deployed.
import { randomInt } from "node:crypto";
import { hashCode } from "../lib/private/code";
import { WORDS } from "../lib/private/words";

export function newCode(rand: (n: number) => number = randomInt): string {
  return Array.from({ length: 4 }, () => WORDS[rand(WORDS.length)]).join("-");
}

if (process.argv[1]?.endsWith("private-code.ts")) {
  const code = newCode();
  console.log(`Code (give this to the people you choose; it is shown only now):\n\n  ${code}\n`);
  console.log(`Store this in Vercel (Production, sensitive):\n\n  PRIVATE_CODE_HASH=${hashCode(code)}\n`);
}
