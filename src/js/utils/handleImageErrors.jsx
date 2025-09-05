// src/js/utils/handleImageErrors.jsx

// Tiny gray placeholder (no network fetch)
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
       <rect width="160" height="100" fill="#f3f4f6"/>
       <path d="M20 72l30-30 22 22 18-18 30 30H20z" fill="#e5e7eb"/>
       <circle cx="52" cy="38" r="8" fill="#e5e7eb"/>
     </svg>`
  );

/**
 * Swap a broken <img> to a safe placeholder once, with no infinite loops.
 * @param {React.SyntheticEvent<HTMLImageElement>|Event} e
 * @param {string} [placeholderUrl]  an imported image URL (recommended)
 * @param {string} [altText="Image not available"]
 */
export const handleImageErrors = (e, placeholderUrl, altText = "Image not available") => {
  const img = e?.currentTarget || e?.target;
  if (!img || img.dataset.fallbackApplied === "1") return;

  // Prevent loops on further errors
  img.onerror = null;

  // Clear srcset to force using src
  if (img.srcset) img.srcset = "";

  // Use provided placeholder or inline SVG (no network)
  img.src = placeholderUrl || FALLBACK_SVG;

  // Improve accessibility
  if (!img.alt) img.alt = altText;

  // Mark so we don't run twice
  img.dataset.fallbackApplied = "1";
};