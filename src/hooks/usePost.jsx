import { useState } from "react";
import { authFetch } from "../js/api/authFetch";

export const usePost = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [response, setResponse] = useState(null);

  const postData = async (data) => {
    try {
      setIsLoading(true);
      setHasError(false);

      const response = await authFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Error posting data");
      }

      const json = await response.json();
      setResponse(json);

      return json;
    } catch (error) {
      console.error("Error:", error);
      setHasError(true);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { postData, response, isLoading, hasError };
};
