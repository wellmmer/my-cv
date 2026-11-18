import { LOCALES, type Locale } from "@/content/types";

export function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

/** Picks the best supported locale from an Accept-Language header; English otherwise. */
export function pickLocale(header: string | null): Locale {
  if (!header) return "en";
  const ranked = header
    .split(",")
    .map((part, order) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], q: Number.isFinite(q) ? q : 0, order };
    })
    .filter((r) => r.q > 0 && isLocale(r.lang))
    .sort((a, b) => b.q - a.q || a.order - b.order);
  return ranked.length ? (ranked[0].lang as Locale) : "en";
}
