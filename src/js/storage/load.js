/**
 * Safely load a value from localStorage.
 * @param {string} key
 * @param {*} [defaultValue=null] value to return if missing/invalid
 */
export const load = (key, defaultValue = null) => {
  try {
    if (typeof window === "undefined") return defaultValue;

    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === "undefined") return defaultValue;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (err) {
    console.error("Failed to load from localStorage:", err);
    return defaultValue;
  }
};
