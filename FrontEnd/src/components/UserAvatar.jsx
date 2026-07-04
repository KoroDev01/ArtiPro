import { imageUrl } from "../utils/imageUrl";

const SIZES = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

/** Avatar utilisateur : photo si disponible, sinon initiale. */
export default function UserAvatar({ user, size = "md", className = "" }) {
  const cls = SIZES[size] || SIZES.md;
  const url = imageUrl(user?.avatar, "avatars");

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className={`${cls} rounded-full object-cover border border-gray-200 flex-shrink-0 ${className}`}
      />
    );
  }

  const initial =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.lastName?.[0]?.toUpperCase() ||
    "?";

  return (
    <div
      className={`${cls} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 ${className}`}>
      {initial}
    </div>
  );
}
