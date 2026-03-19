import { createClient } from "node-fetch"

const apiClient = createClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "https://api.example.com"
})

export const fetchData = async (url: string, options: any = {}) => {
  const response = await apiClient.get(url, options)
  return response.json()
}
