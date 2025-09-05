import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg"
  closeOnBackdrop = true,
  closeOnEsc = true,
  initialFocusRef,
  className = "",
}) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const titleIdRef = useRef(`modal-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scroll
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // ESC + focus trap
    const onKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEsc) onClose?.();
      if (e.key === "Tab") trapFocus(e);
    };
    document.addEventListener("keydown", onKeyDown);

    // Initial focus
    const focusTarget =
      initialFocusRef?.current ||
      dialogRef.current?.querySelector(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
      );
    focusTarget?.focus();

    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose, initialFocusRef]);

  const trapFocus = (e) => {
    const root = dialogRef.current;
    if (!root) return;
    const focusable = root.querySelectorAll(
      'button,[href],input,select,textarea,details,[tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && active === last) {
      first.focus();
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  const content = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        className={[
          "bg-surface text-primary ring-secondary/20 w-full rounded-2xl shadow-xl ring-1",
          "max-h-[85vh] transform-gpu overflow-auto transition duration-150 ease-out",
          sizes[size],
          className,
        ].join(" ")}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="border-secondary/15 from-accent/10 to-secondary/10 flex items-center justify-between border-b bg-gradient-to-r px-5 py-4">
            {title ? (
              <h2 id={titleIdRef.current} className="text-lg font-semibold">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-secondary hover:bg-background hover:text-primary hover:ring-secondary/20 focus:ring-accent/40 rounded-lg p-2 ring-1 ring-transparent focus:outline-none focus:ring-2"
                aria-label="Close dialog"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-secondary/15 flex items-center justify-end gap-3 border-t px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render in a portal so it overlays the entire app
  if (typeof document !== "undefined") {
    const target = document.getElementById("modal-root") || document.body;
    return createPortal(content, target);
  }
  return content;
};
