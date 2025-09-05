// save.js
export const save = (key, value) => {
  try {
    if (typeof window === "undefined") return; // SSR / tests

    if (value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
};
