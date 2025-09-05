import { API_Base_Url, API_Auth, API_Login_Url } from "../constants";
import { save } from "../../storage/save";
import { authFetch } from "../authFetch";


export const logIn = async (email, password) => {
  try {
    const res = await authFetch(API_Base_Url + API_Auth + API_Login_Url, {
      method: "POST",
      // authFetch will auto-JSON this plain object and set Content-Type
      body: { email, password },
    });

    // Try to parse JSON (handles both success/error payloads)
    const contentType = res.headers.get("content-type") || "";
    const parsed = contentType.includes("application/json")
      ? await res.json()
      : { message: await res.text() };

    if (!res.ok) {
      const msg =
        parsed?.errors?.[0]?.message ||
        parsed?.message ||
        "Could not log in";
      const err = new Error(msg);
      err.status = res.status;
      err.details = parsed;
      throw err;
    }

    const data = parsed?.data ?? parsed;
    const { accessToken, ...profile } = data;

    if (!accessToken) {
      throw new Error("Login succeeded but no access token was returned.");
    }

    save("accessToken", accessToken);
    save("profile", profile);

    return profile;
  } catch (err) {
    console.error("Login failed:", err);
    // Re-throw a clean Error for the caller
    throw err instanceof Error ? err : new Error("Could not log in");
  }
};