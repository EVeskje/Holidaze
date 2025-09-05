/**
 * Format a date safely.
 * @param {Date|string|number} value
 * @param {Object} [opts]
 * @param {string} [opts.locale]   e.g. "en-GB", "nb-NO" (defaults to browser locale)
 * @param {string} [opts.timeZone] e.g. "Europe/Oslo" (defaults to system timezone)
 * @returns {string} "01 Sep 2025" on success, "Invalid date" on failure
 */
export const formatDate = (value, opts = {}) => {
  const date = toDate(value);
  if (!date) return "Invalid date";

  const {
    locale = (typeof navigator !== "undefined" && navigator.language) || "en-GB",
    timeZone, // leave undefined to use system tz
  } = opts;

  try {
    const fmt = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short", // "Sep" not "Sept"
      year: "numeric",
      ...(timeZone ? { timeZone } : {}),
    });
    return fmt.format(date);
  } catch {
    return "Invalid date";
  }
};


/** Parse various inputs to Date (returns null if invalid) */
function toDate(value) {
  if (value instanceof Date && !isNaN(value)) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Handle bare YYYY-MM-DD safely (avoid inconsistent browser parsing)
    const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
    const d = new Date(isoDateOnly ? `${trimmed}T00:00:00` : trimmed);
    return isNaN(d) ? null : d;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }

  return null;
}

/**
 * Format a date range, e.g. "01–05 Sep 2025" or "28 Sep – 02 Oct 2025".
 * Falls back gracefully if one side is invalid.
 */
export const formatDateRange = (from, to, opts = {}) => {
  const start = toDate(from);
  const end = toDate(to);
  if (!start && !end) return "Invalid date";
  if (start && !end) return formatDate(start, opts);
  if (!start && end) return formatDate(end, opts);

  const { locale = (typeof navigator !== "undefined" && navigator.language) || "en-GB", timeZone } = opts;

  try {
    const fmt = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(timeZone ? { timeZone } : {}),
    });

    // Use native range formatter if available
    if (typeof fmt.formatRange === "function") {
      return fmt.formatRange(start, end);
    }

    // Fallback: compact range
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
      // "01–05 Sep 2025"
      const dayFmt = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        ...(timeZone ? { timeZone } : {}),
      });
      const tailFmt = new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "numeric",
        ...(timeZone ? { timeZone } : {}),
      });
      return `${dayFmt.format(start)}–${dayFmt.format(end)} ${tailFmt.format(end)}`;
    }

    // "28 Sep – 02 Oct 2025"
    return `${formatDate(start, opts)} – ${formatDate(end, opts)}`;
  } catch {
    return "Invalid date";
  }
};

/** Get YYYY-MM-DD (useful for payloads) */
export const toISODate = (value, timeZone) => {
  const d = toDate(value);
  if (!d) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};