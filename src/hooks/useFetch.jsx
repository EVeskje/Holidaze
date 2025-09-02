import { useState, useEffect } from "react";
import { authFetch } from "../js/api/authFetch";

export function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function getData(url) {
      try {
        setIsLoading(true);
        setHasError(false);
        const fetchedData = await authFetch(url);
        const json = await fetchedData.json();
        setData(json.data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getData(url);
  }, [url]);
  return { data, isLoading, hasError };
}
