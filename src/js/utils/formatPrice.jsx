// src/js/utils/formatPrice.jsx

/** Parse numbers safely from number|string inputs */
function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    // remove spaces (incl. non-breaking), convert commas to dots (best-effort)
    const cleaned = value.replace(/[\s\u00A0]/g, "").replace(/,/g, ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Space-group an integer or fixed-decimal number */
function spaceGroup(n, decimals = 0) {
  const fixed = n.toFixed(decimals);
  const [intPart, frac] = fixed.split(".");
  const spaced = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return frac ? `${spaced}.${frac}` : spaced;
}

/**
 * formatPrice(value, opts?)
 * Default: space-grouped integer string (keeps your current UI behavior).
 * Pass currency/locale to get proper currency formatting via Intl.
 *
 * @param {number|string} value
 * @param {object} [opts]
 * @param {string} [opts.locale]  e.g. "en-GB", "nb-NO"
 * @param {string} [opts.currency] e.g. "USD", "NOK" -> enables currency mode
 * @param {boolean} [opts.compact] use compact notation (e.g. 12K)
 * @param {number} [opts.minimumFractionDigits]
 * @param {number} [opts.maximumFractionDigits]
 * @param {boolean} [opts.useIntl] force Intl even without currency
 */
export const formatPrice = (value = 0, opts = {}) => {
  const n = toNumber(value);

  const {
    locale = (typeof navigator !== "undefined" && navigator.language) || "en-GB",
    currency,           // if provided, use Intl currency
    compact = false,
    minimumFractionDigits,
    maximumFractionDigits,
    useIntl = false,    // allow forcing Intl decimal formatting
  } = opts;

  if (currency || useIntl) {
    try {
      const fmt = new Intl.NumberFormat(locale, {
        style: currency ? "currency" : "decimal",
        currency,
        notation: compact ? "compact" : "standard",
        useGrouping: true,
        ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
        ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
      });
      return fmt.format(n);
    } catch {
      // fall through to space-group if Intl errors
    }
  }

  // Default legacy behavior: space-grouped integer, no symbol
  return spaceGroup(n, 0);
};

/* Optional convenience helper if you often show cents for currency */
export const formatCurrency = (value = 0, currency = "USD", locale) =>
  formatPrice(value, {
    currency,
    locale,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });