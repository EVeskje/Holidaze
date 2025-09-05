import React from "react";


export const Checkbox = ({
  register,
  registerYup,
  id,
  icon,
  label,
  className = "",
  checkboxHtmlFor, // legacy support
  helper,
  disabled = false,
  errors,
}) => {
  const inputId = id || checkboxHtmlFor || registerYup || crypto.randomUUID();
  const hasError = Boolean(errors && errors[registerYup]);
  const errorMsg = hasError ? errors[registerYup]?.message : "";

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") return <i className={icon} />;
    return icon; // ReactNode
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <label
        htmlFor={inputId}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-3 py-2",
          "bg-surface/80 ring-1 ring-secondary/20 transition",
          "hover:ring-secondary/40",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          hasError ? "ring-red-300 hover:ring-red-400" : "",
        ].join(" ")}
      >
        <input
          {...register(registerYup)}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className="h-4 w-4 rounded border-secondary/40 accent-accent focus:outline-none"
        />
        {icon && (
          <span className="text-secondary group-hover:text-primary">
            {renderIcon()}
          </span>
        )}
        <span className="text-sm text-primary">{label}</span>
      </label>

      {helper && !hasError && (
        <p className="mt-1 pl-1 text-xs text-secondary">{helper}</p>
      )}
      {hasError && (
        <p className="mt-1 pl-1 text-sm text-red-600">{errorMsg}</p>
      )}
    </div>
  );
};