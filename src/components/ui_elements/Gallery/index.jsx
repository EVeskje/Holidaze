import React, { useMemo, useState, useEffect, useCallback } from "react";
import ImagePlaceholder from "../../../assets/images/no_img.png";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

export const Gallery = ({ data, className = "" }) => {
  const images = useMemo(() => {
    const arr = Array.isArray(data?.media) ? data.media : [];
    if (arr.length === 0) {
      return [{ url: ImagePlaceholder, alt: "Image not available" }];
    }
    return arr.map((m, i) => ({
      url: m?.url || ImagePlaceholder,
      alt: m?.alt || data?.name || `Venue image ${i + 1}`,
    }));
  }, [data]);

  const [index, setIndex] = useState(0);

  // Reset to first image if the media set changes
  useEffect(() => setIndex(0), [images.length]);

  const select = useCallback((i) => setIndex(i), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const hasMultiple = images.length > 1;
  const current = images[index];

  return (
    <figure
      className={[
        "bg-surface/80 ring-secondary/15 group overflow-hidden rounded-2xl ring-1",
        className,
      ].join(" ")}
    >
      {/* Main image / carousel */}
      <div
        className="relative outline-none"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-roledescription="carousel"
        aria-label="Venue photos"
        aria-live="polite"
      >
        <div className="bg-secondary/10 aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
          <img
            src={current.url}
            alt={current.alt}
            onError={(e) => handleImageErrors(e, ImagePlaceholder)}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Prev/Next controls */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="bg-background/70 text-primary ring-secondary/20 hover:bg-background absolute left-3 top-1/2 -translate-y-1/2 rounded-xl p-2 ring-1 backdrop-blur"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="bg-background/70 text-primary ring-secondary/20 hover:bg-background absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 ring-1 backdrop-blur"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* Counter badge */}
            <div className="bg-background/80 text-secondary ring-secondary/15 absolute bottom-2 right-2 rounded-full px-2 py-1 text-xs ring-1">
              {index + 1}/{images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((img, i) => {
            const selected = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={selected ? "true" : undefined}
                className={[
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl ring-1 transition",
                  selected
                    ? "ring-accent"
                    : "ring-secondary/15 hover:ring-secondary/30",
                ].join(" ")}
              >
                <img
                  src={img.url}
                  alt=""
                  onError={(e) => handleImageErrors(e, ImagePlaceholder)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {selected && (
                  <span
                    className="ring-accent/60 pointer-events-none absolute inset-0 rounded-xl ring-2"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </figure>
  );
};
