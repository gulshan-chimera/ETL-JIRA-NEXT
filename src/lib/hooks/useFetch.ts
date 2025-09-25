import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { axiosInstance as axios } from "../axios";

export function useFetch<T>({
  url,
  defaultState,
}: {
  url: string;
  defaultState: T;
}) {
  const [data, setData] = useState<T>(defaultState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setData(defaultState);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
