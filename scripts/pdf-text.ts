import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

/** Extracts the text and page count of a PDF file. */
export async function pdfText(path: string): Promise<{ text: string; pages: number }> {
  const data = new Uint8Array(await readFile(path));
  const task = getDocument({ data, useSystemFonts: true, verbosity: 0 });
  const doc = await task.promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
  }
  const pages = doc.numPages;
  await task.destroy();
  return { text: parts.join("\n"), pages };
}
