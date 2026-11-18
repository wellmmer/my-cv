import { ImageResponse } from "next/og";
import { cv } from "@/content/cv";
import { BRICK_HEX, LOCALES, type Locale } from "@/content/types";
import { ui } from "@/content/ui";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wellmmer Lucas, Senior Software Engineer";

/** Rubik Black from Google Fonts, fetched at build time; null falls back to the default font. */
async function rubik900(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Rubik:wght@900")).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : "en";
  const bricks = [...cv.steps].reverse();
  const font = await rubik900();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F5F5F2", padding: 72, fontFamily: "Rubik" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#111", lineHeight: 0.95, letterSpacing: -3 }}>Wellmmer</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#111", lineHeight: 0.95, letterSpacing: -3 }}>Lucas</div>
          <div style={{ fontSize: 36, color: "#111", marginTop: 28 }}>{ui[l].metaTitle.split(", ")[1]}</div>
          <div style={{ fontSize: 26, color: "#111", marginTop: 12 }}>wellmmer.vercel.app</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          {bricks.map((s) => (
            <div
              key={s.n}
              style={{ width: 260, height: 40, background: BRICK_HEX[s.brick], border: "4px solid #111", borderRadius: 6 }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Rubik", data: font, weight: 900, style: "normal" }] : undefined },
  );
}
