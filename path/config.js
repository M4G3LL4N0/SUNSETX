import { default as fs } from "fs/promises"

export const loadConfig = async () => {
  try {
    const data = await fs.readFile("src/settings.json", "utf-8")
    return JSON.parse(data)
  } catch (err) {
    console.error("Failed to load config:", err)
    return {}
  }
}
