import React, { useEffect, useMemo, useState } from "react";

export const AddImageForm = ({ setImages, errors, isSubmitted, venue }) => {
  const initialUrls = useMemo(() => {
    const urls =
      venue?.media?.map((m) => m?.url).filter(Boolean) ??
      [];
    return urls.length ? urls : [""];
  }, [venue]);

  const [imageUrls, setImageUrls] = useState(initialUrls);

  // Sync when venue changes (edit mode)
  useEffect(() => {
    setImageUrls(initialUrls);
  }, [initialUrls]);

  // Push updates to RHF parent (setValue)
  useEffect(() => {
    setImages("images", imageUrls);
  }, [imageUrls, setImages]);

  const addRow = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const removeRow = (index) => {
    setImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  };

  const updateRow = (index, value) => {
    setImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Optional mild client-side hinting (not a validator)
  const looksLikeUrl = (v) =>
    !v || /^https?:\/\/.+/i.test(v);

  // Build an error message from RHF/Yup, regardless of structure
  const topLevelError =
    (errors?.images && "message" in errors.images && errors.images.message) ||
    (Array.isArray(errors?.images) && errors.images[0]?.message) ||
    "";

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary/10 ring-1 ring-secondary/20">
          <ImageIcon />
        </span>
        <div>
          <p className="text-sm font-medium">Images</p>
          <p className="text-xs text-secondary">Paste direct image URLs (use https://). The first image is the cover.</p>
        </div>
      </div>

      <div className="space-y-2">
        {imageUrls.map((url, index) => {
          const id = `imageUrlInput-${index}`;
          const showUrlHint = isSubmitted && !looksLikeUrl(url);
          const showThumb = Boolean(url?.trim());

          return (
            <div
              key={id}
              className="flex items-center gap-3 rounded-xl bg-surface/80 p-2 ring-1 ring-secondary/15"
            >
              {/* Thumb */}
              <div className="relative h-12 w-12 overflow-hidden rounded-lg ring-1 ring-secondary/15">
                {showThumb ? (
                 
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // fallback to a neutral bg if image fails
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary/10">
                    <SmallImageIcon />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="min-w-0 flex-1">
                <label htmlFor={id} className="sr-only">
                  Image URL {index + 1}
                </label>
                <input
                  id={id}
                  type="url"
                  value={url}
                  onChange={(e) => updateRow(index, e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className={`h-11 w-full rounded-xl border px-3 outline-none transition ${
                    showUrlHint
                      ? "border-red-300 focus:border-red-400"
                      : "border-secondary/30 bg-background focus:border-secondary"
                  }`}
                />
                {showUrlHint && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid URL starting with http:// or https://</p>
                )}
                {index === 0 && (
                  <p className="mt-1 text-[11px] text-secondary">Cover image</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="inline-flex items-center justify-center rounded-lg px-2 py-2 text-secondary ring-1 ring-secondary/20 hover:text-primary"
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary ring-1 ring-secondary/25 hover:text-primary"
        >
          <PlusIcon />
          Add another image
        </button>
      </div>

      {/* Validation error from schema */}
      {isSubmitted && topLevelError && (
        <p className="mt-2 text-sm text-red-600">{topLevelError}</p>
      )}
    </div>
  );
};


function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 13l2.5-2.5L14 14l2-2 2 2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
    </svg>
  );
}
function SmallImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M7 13l2-2 2 2 2-2 3 3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <rect x="6" y="6" width="12" height="14" rx="2" />
    </svg>
  );
}