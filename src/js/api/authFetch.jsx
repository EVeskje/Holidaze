import { headers as buildHeaders } from "./headers";

const isPlainObject = (v) =>
  typeof v === "object" && v !== null && Object.getPrototypeOf(v) === Object.prototype;

const isNonJsonBody = (v) =>
  v instanceof FormData ||
  v instanceof Blob ||
  v instanceof ArrayBuffer ||
  (typeof ReadableStream !== "undefined" && v instanceof ReadableStream) ||
  v instanceof URLSearchParams;

function mergeHeaders(base, override) {
  const out = new Headers(base);

  if (!override) return out;

  if (override instanceof Headers) {
    override.forEach((v, k) => out.set(k, v));
  } else if (Array.isArray(override)) {
    // e.g. [["Content-Type","..."], ...]
    for (const [k, v] of override) out.set(k, v);
  } else {
    // plain object
    for (const [k, v] of Object.entries(override)) {
      if (v !== undefined && v !== null) out.set(k, String(v));
    }
  }
  return out;
}

// ---------- main ----------
export const authFetch = (url, options = {}) => {
  const { body } = options;

  let json = false;
  let finalBody = body;

  if (isPlainObject(body)) {
    json = true;                 // send as JSON
    finalBody = JSON.stringify(body);
  } else if (body == null) {
    json = false;                // no body => no JSON header
  } else if (isNonJsonBody(body)) {
    json = false;                // FormData/Blob/etc => don't set JSON header
  } else if (typeof body === "string") {
    json = false;                // assume caller knows the Content-Type
  } else {
    // Unknown object type; be conservative and don't force JSON
    json = false;
  }

  // Build default headers (auth, api key, accept, optional JSON content-type)
  const generated = buildHeaders({ json });

  // Merge with caller headers (caller wins)
  const merged = mergeHeaders(generated, options.headers);

  return fetch(url, {
    ...options,
    headers: merged,
    body: finalBody,
  });
};