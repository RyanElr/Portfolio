export default function getLogoSrc(url?: string, variant?: string) {
  if (!url) return "";
  const size = variant ?? "=w96-h96-n";

  try {
    const parsed = new URL(url, "http://localhost");
    if (parsed.hostname === "lh3.googleusercontent.com" && parsed.pathname.startsWith("/d/")) {
      return variant ? `${parsed.origin}${parsed.pathname.replace(/=.+$/, "")}${size}` : url;
    }

    // Only Drive sharing links need conversion; preserve other image hosts.
    if (parsed.hostname !== "drive.google.com") return url;
    const id = parsed.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/)?.[1]
      ?? parsed.searchParams.get("id");
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) return url;
    return `https://lh3.googleusercontent.com/d/${id}${size}`;
  } catch {
    return url;
  }
}
