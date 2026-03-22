import { default as fs } from "fs/promises"
import { safe } from "@/lib/safe"

export const CONFIG_PATH = "src/settings.json"

export type AppConfig = {
  // Define proper config schema here
  vapidKeys?: {
    publicKey: string
    privateKey: string  
  }
  openWeather?: {
    apiKey: string
  }
}

export const loadConfig = async (): Promise<AppConfig> => {
  return safe(async () => {
    const data = await fs.readFile(CONFIG_PATH, "utf-8")
    return JSON.parse(data) as AppConfig
  }, {}, "Failed to load config")
}
