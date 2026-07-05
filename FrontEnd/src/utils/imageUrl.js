/** URL affichable pour avatar ou photo (local ou Cloudinary). */
export function imageUrl(path, folder = "posts") {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  if (path.startsWith("/")) return path;
  return `/images/${folder}/${path}`;
}
