import { useState } from "react";
import { authFetch } from "../js/api/authFetch";

export function useDelete(url) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [response, setResponse] = useState(null);

  const deleteData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await authFetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const json = await response.json();
        setResponse(json);
      } else {
        setResponse(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteData, response, isLoading, hasError };
}
