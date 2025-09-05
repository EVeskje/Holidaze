import React from "react";

export const Loader = ({
  label = "Loading…",
  fullscreen = false, // covers the page with a soft overlay
  showLabel = true, // hide to use screen-reader-only label
  size = "md", // "sm" | "md" | "lg"
  className = "",
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
    : "inline-flex items-center gap-3";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`${containerClasses} ${className}`}
    >
      {/* Spinner */}
      <svg
        viewBox="0 0 24 24"
        className={`text-accent animate-spin motion-reduce:animate-none ${sizeMap[size]}`}
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      {showLabel ? (
        <span className="text-secondary text-sm">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};
