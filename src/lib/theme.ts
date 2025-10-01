export type Theme = { accent: string; rain: string; fg: string; bg: string };

export const THEMES: Record<string, Theme> = {
  default:   { accent: "#E50914", rain: "rgba(229,9,20,0.9)", fg: "#EAEAEA", bg: "#0B0B0B" },
  "/experiences":{ accent: "#1E40AF", rain: "rgba(2, 35, 88, 0.9)", fg: "#EAEAEA", bg: "#0B0B0B" }, // bleu
  "/contact": { accent: "#15803D", rain: "rgba(21,128,61,0.85)", fg: "#EAEAEA", bg: "#0B0B0B" }, // vert plus profond   
  "/projects":  { accent: "#A855F7", rain: "rgba(168,85,247,0.9)", fg: "#EAEAEA", bg: "#0B0B0B" }, // violet
};

export function themeFor(pathname: string) {
  return THEMES[pathname] ?? THEMES.default;
}
