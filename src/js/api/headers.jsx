import { load } from "../storage/load";
import { API_Key } from "./constants";

export function headers(hasBodyOrOptions = false) {

  const isBoolean = typeof hasBodyOrOptions === "boolean";

  const {
    json = isBoolean ? hasBodyOrOptions : false,
    auth = true,
    apiKey = true,
    accept = "application/json",
    token, 
    extra = {},
  } = isBoolean ? {} : hasBodyOrOptions || {};

  const h = new Headers();

  // Accept
  if (accept) h.set("Accept", accept);

  // Auth
  if (auth) {
    const accessToken = token ?? load("accessToken");
    if (accessToken) h.set("Authorization", `Bearer ${accessToken}`);
  }

  // Noroff API key
  if (apiKey && API_Key) {
    h.set("X-Noroff-API-Key", API_Key);
  }

  // Content-Type for JSON payloads
  if (json) {
    h.set("Content-Type", "application/json");
  }

  // Any caller-provided extras
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined && v !== null) h.set(k, String(v));
  }

  return h;
}

export default headers;