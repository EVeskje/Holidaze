import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const PrimaryButton = forwardRef(
  (
    {
      type = "button",
      onClick,
      className = "",
      children,
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const base =
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium " +
      "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50";
    const variant =
      "border border-accent text-accent bg-surface shadow-sm " +
      "hover:bg-accent hover:text-white " +
      "disabled:opacity-60 disabled:cursor-not-allowed";
    const width = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={`${base} ${variant} ${width} ${className}`.trim()}
        {...rest}
      >
        {leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null}
        {loading ? (
          <>
            <Spinner />
            <span className="ml-2">{children}</span>
          </>
        ) : (
          children
        )}
        {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

PrimaryButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
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
        className="opacity-75"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}