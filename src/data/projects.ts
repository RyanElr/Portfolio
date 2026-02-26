import rawProjects from "./projects.json";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";

export function cloudinaryUrl(
    filePath: string,
    options = "f_auto,q_auto,w_1600"
): string {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${options}/${filePath}`;
}

function isFullUrl(value: string): boolean {
    return value.startsWith("http://") || value.startsWith("https://");
}

/* ── Types ────────────────────────────────────────────────────────────── */
export interface Project {
    id: string;
    titre: string;
    sousTitre: string;
    description: string;
    image: string;
    images: string[];
    tech: string[];
}

interface RawProject {
    id: string;
    titre: string;
    sousTitre: string;
    description: string;
    image: string;
    images: string[];
    imageOptions?: string[];
    tech: string[];
}

/* ── Résolution des URLs ─────────────────────────────────────────────── */
const projects: Project[] = (rawProjects as RawProject[]).map((p) => ({
    ...p,
    image: isFullUrl(p.image) ? p.image : cloudinaryUrl(p.image),
    images: p.images.map((img, i) => {
        if (isFullUrl(img)) return img;
        const opts = p.imageOptions?.[i] ?? "f_auto,q_auto,w_1600";
        return cloudinaryUrl(img, opts);
    }),
}));

export default projects;
