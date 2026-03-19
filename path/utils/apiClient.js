import { fetch as fetchPolyfill } from "node-fetch";

export const fetchData = async (url: string, options: RequestInit = {}) => {
  const response = await fetchPolyfill(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorBody}`);
  }
  return response.json();
}
