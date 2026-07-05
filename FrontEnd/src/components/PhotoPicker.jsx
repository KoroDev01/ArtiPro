import { useEffect, useMemo } from "react";
import { FiImage, FiX } from "react-icons/fi";

export function mergePhotoFiles(existing, incoming, max) {
  const merged = [...existing];
  for (const file of Array.from(incoming || [])) {
    if (merged.length >= max) break;
    const duplicate = merged.some(
      (f) =>
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified,
    );
    if (!duplicate) merged.push(file);
  }
  return merged;
}

/** Sélection de photos par ajouts successifs (re-clic possible). */
export default function PhotoPicker({
  photos,
  onChange,
  max = 3,
  label,
  className = "",
}) {
  const previews = useMemo(
    () => photos.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [photos],
  );

  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews],
  );

  const handleAdd = (e) => {
    onChange(mergePhotoFiles(photos, e.target.files, max));
    e.target.value = "";
  };

  const removeAt = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const atMax = photos.length >= max;

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          {label} (max {max})
        </label>
      )}

      <label
        className={`inline-flex items-center gap-2 text-sm font-medium cursor-pointer ${
          atMax
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:text-blue-700"
        }`}>
        <FiImage />
        {photos.length === 0
          ? "Ajouter des photos"
          : atMax
            ? `${max} photos sélectionnées`
            : `Ajouter une photo (${photos.length}/${max})`}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={atMax}
          className="hidden"
          onChange={handleAdd}
        />
      </label>

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {previews.map((p, i) => (
            <div key={p.url} className="relative group">
              <img
                src={p.url}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600"
                aria-label="Retirer la photo">
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
