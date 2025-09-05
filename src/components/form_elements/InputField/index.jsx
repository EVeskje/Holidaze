/* eslint-disable react/prop-types */
import React, { useMemo, useState } from "react";

export const InputField = ({
  icon,
  label,
  htmlFor,
  register,
  registerYup,
  required = true,
  id,
  type = "text",
  min,
  max,
  step,
  placeholder,
  autoComplete,
  helper,
  disabled = false,
  readOnly = false,
  className = "",
  errors,
  togglePassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Fallbacks
  const inputId = id || htmlFor || registerYup || crypto.randomUUID();
  const hasError = Boolean(errors && errors[registerYup]);
  const errorMsg = hasError ? errors[registerYup]?.message : "";
  const describedBy = useMemo(() => {
    const ids = [];
    if (helper) ids.push(`${inputId}-helper`);
    if (hasError) ids.push(`${inputId}-error`);
    return ids.join(" ") || undefined;
  }, [helper, hasError, inputId]);

  const effectiveType = togglePassword ? (showPassword ? "text" : "password") : type;

  const registerOptions = required ? { required: "This field is required" } : {};

  return (
    <div className="w-full max-w-sm">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {icon ? <span className="mr-2 inline-flex align-middle">{icon}</span> : null}
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon (decorative) */}
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          {...register(registerYup, registerOptions)}
          id={inputId}
          type={effectiveType}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={[
            "h-11 w-full rounded-xl border bg-background px-3 text-sm text-primary outline-none",
            "ring-1 transition focus:ring-2",
            icon ? "pl-10" : "",
            togglePassword ? "pr-10" : "pr-3",
            hasError
              ? "border-red-300 ring-red-200 focus:ring-red-300"
              : "border-secondary/30 ring-secondary/15 focus:ring-accent/40",
            disabled ? "cursor-not-allowed opacity-60" : "",
            className,
          ].join(" ")}
        />

        {/* Password toggle */}
        {togglePassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary ring-1 ring-secondary/15 hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {/* Helper / Error */}
      {helper && !hasError && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-secondary">
          {helper}
        </p>
      )}
      {hasError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

/* ---------- Tiny inline icons ---------- */
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 4.26A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.94 19.94 0 01-4.35 5.94M6.12 6.12A19.94 19.94 0 001 12s4 8 11 8a10.94 10.94 0 004.12-.77" />
    </svg>
  );
}