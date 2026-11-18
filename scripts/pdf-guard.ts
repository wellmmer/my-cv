import { createConnection } from "node:net";
import { findLeaks, type LeakTerms } from "./leak-patterns";

/** True when something already listens on localhost:port. */
export function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

/** Reasons a public PDF's text must not be published; empty when clean. */
export function publicPdfProblems(text: string, privateCompanies: string[], terms: LeakTerms): string[] {
  return [
    ...privateCompanies.filter((c) => text.includes(c)).map((c) => `private step: ${c}`),
    ...findLeaks(text, terms),
  ];
}
