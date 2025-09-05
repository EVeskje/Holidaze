import { useState } from "react";
import { authFetch } from "../js/api/authFetch";

export function usePut(url) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [response, setResponse] = useState(null);

  const putData = async (data) => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await authFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      setResponse(json);
    } catch (error) {
      console.error("Error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { putData, response, isLoading, hasError };
}
