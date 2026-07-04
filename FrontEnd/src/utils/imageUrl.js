import { API_BASE } from "../api";

/** URL affichable pour avatar ou photo (local ou Cloudinary). */
export function imageUrl(path, folder = "posts") {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/images/${folder}/${path}`;
}
