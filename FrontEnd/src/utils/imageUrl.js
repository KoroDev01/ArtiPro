/**
 * URL affichable pour avatar ou photo (Cloudinary ou fichiers sur le serveur).
 * Les chemins locaux passent par /images (même domaine → proxy Vercel en prod).
 */
export function imageUrl(path, folder = "posts") {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  if (path.startsWith("/")) return path;
  return `/images/${folder}/${path}`;
}
