import { API_Base_Url, API_Auth, API_Register_Url } from "../constants";
import { authFetch } from "../authFetch";

/**
 * Register a new account.
 * @returns The parsed API response (same shape as the backend returns).
 */
export const register = async (name, email, password, profileImgUrl) => {
  const payload = {
    name,
    email,
    password,
    ...(profileImgUrl
      ? { avatar: { url: String(profileImgUrl), alt: "Profile image" } }
      : {}),
  };

  try {
    const res = await authFetch(API_Base_Url + API_Auth + API_Register_Url, {
      method: "POST",
      // Pass a plain object; authFetch will set JSON headers & stringify
      body: payload,
    });

    const contentType = res.headers.get("content-type") || "";
    const parsed = contentType.includes("application/json")
      ? await res.json()
      : { message: await res.text() };

    if (!res.ok) {
      const msg =
        parsed?.errors?.[0]?.message ||
        parsed?.message ||
        "Could not register the account";
      const err = new Error(msg);
      err.status = res.status;
      err.details = parsed;
      throw err;
    }

    return parsed; // preserve existing return behavior
  } catch (err) {
    console.error("Registration failed:", err);
    throw err instanceof Error ? err : new Error("Could not register the account");
  }
};