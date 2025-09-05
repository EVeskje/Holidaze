import React from "react";
import { Link as RouterLink } from "react-router-dom";

export function TextLink({
  to,                 // react-router path
  href,               // external URL
  onClick,            // button action
  target,
  rel,
  children,
  className = "",
  leadingIcon,        
  trailingIcon,       
  disabled = false,
  ...rest
}) {
  const base =
    "inline-flex items-center gap-1 text-sm md:text-base text-accent " +
    "underline-offset-2 hover:underline " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 " +
    "rounded-sm disabled:opacity-50 disabled:pointer-events-none";

  const cls = `${base} ${className}`;

  // Prefer RouterLink when `to` is provided
  if (to && !disabled) {
    return (
      <RouterLink to={to} className={cls} {...rest}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </RouterLink>
    );
  }

  // Use <a> for external links
  if (href && !disabled) {
    const safeRel = target === "_blank" ? (rel || "noopener noreferrer") : rel;
    return (
      <a href={href} target={target} rel={safeRel} className={cls} {...rest}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </a>
    );
  }

  // Fallback: button for actions
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      disabled={disabled}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}