export type Theme = "light" | "dark";

/** localStorage key of a visitor's manual choice. No key means: follow the system. */
export const THEME_KEY = "theme";

export function parseTheme(v: unknown): Theme | null {
  return v === "light" || v === "dark" ? v : null;
}

/**
 * Runs in <head> before first paint: applies a stored manual choice so the page
 * never flashes the other theme. Storage may be blocked; then the system wins.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
