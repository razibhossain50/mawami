/**
 * Image URL resolution service
 * Handles different types of image URLs (absolute, relative, R2, etc.)
 */

export interface ImageUrlResult {
  url: string | undefined;
  unoptimized: boolean;
}

/**
 * Resolve image URL: if value is absolute (http/https or data URI), use as-is; otherwise
 * prefix with API base URL. Also indicate if Next/Image should bypass optimization.
 */
export const resolveImageUrl = (path?: string | null): ImageUrlResult => {
  if (!path) return { url: undefined, unoptimized: false };
  const trimmed = String(path).trim();
  if (!trimmed) return { url: undefined, unoptimized: false };
  
  // absolute (http/https) or data URI
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) {
    return { url: trimmed, unoptimized: true };
  }
  
  // Prefer R2 base URL if provided (frontend env)
  const r2Base = process.env.NEXT_PUBLIC_R2_BASE_URL?.replace(/\/$/, "");
  if (r2Base) {
    const key = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
    return { url: `${r2Base}/${key}`.replace(/\/+/, "/"), unoptimized: true };
  }
  
  // relative path from API as fallback
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  const rel = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (base) {
    return { url: `${base}${rel}`, unoptimized: false };
  }
  
  // fallback to relative
  return { url: rel, unoptimized: false };
};

/**
 * Get image URL only (without unoptimized flag)
 */
export const getImageUrl = (path?: string | null): string | undefined => {
  return resolveImageUrl(path).url;
};

/**
 * Check if image URL is from external source (R2, CDN, etc.)
 */
export const isExternalImage = (path?: string | null): boolean => {
  if (!path) return false;
  const trimmed = String(path).trim();
  return /^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed);
};
