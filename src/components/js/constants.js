// ----- Base -----
const ENV_BASE = (import.meta?.env?.VITE_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export const API_Base_Url = ENV_BASE || "https://v2.api.noroff.dev";
export const API_Url = `${API_Base_Url}/holidaze`;

// ----- Auth -----
export const API_Auth = "/auth";
export const API_Register_Url = "/register";
export const API_Login_Url = "/login";

// API key
export const API_Key =
  import.meta?.env?.VITE_API_KEY ?? "942b0bef-3136-4c35-b9c3-190d76f103e8";

// ----- Resources
export const all_Venues = "/venues";
export const profile_Url = "/profiles";
export const bookings_Url = "/bookings";


export function joinUrl(...parts) {
  return parts
    .filter(Boolean)
    .map((p, i) => {
      const s = String(p);
      if (i === 0) return s.replace(/\/+$/, ""); 
      return s.replace(/^\/+/, ""); 
    })
    .join("/");
}

export function api(path = "") {
  return joinUrl(API_Url, path);
}

export function withQuery(url, params) {
  if (!params || typeof params !== "object") return url;
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && `${v}` !== "",
  );
  if (entries.length === 0) return url;

  const qs = new URLSearchParams();
  for (const [k, v] of entries) qs.set(k, String(v));
  return `${url}?${qs.toString()}`;
}
