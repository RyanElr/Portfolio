export default function getLogoSrc(url?: string, variant?: string) {
  if (!url) return "";
  const v = variant ?? "=w96-h96-n"; // par défaut: parfait pour un logo

  try {
    if (url.includes("lh3.googleusercontent.com/d/")) {
      return variant ? url.replace(/=.+$/, v) : url; 
    }

    // Cas 1: https://drive.google.com/file/d/ID/view
    const m1 = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    if (m1 && m1[1]) return `https://lh3.googleusercontent.com/d/${m1[1]}${v}`;

    // Cas 2: https://drive.google.com/open?id=ID ou ...?id=ID
    const u = new URL(url, "http://localhost");
    const id = u.searchParams.get("id");
    if (id) return `https://lh3.googleusercontent.com/d/${id}${v}`;

    // Autres (S3/Cloudinary/local) => on renvoie tel quel
    return url;
  } catch {
    return url;
  }
}
