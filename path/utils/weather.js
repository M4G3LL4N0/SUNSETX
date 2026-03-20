export const getWeather = async (lat: number, lon: number): Promise<{ temperature: number; condition: string }> => {
  // TODO: Implement actual weather API call
  return Promise.resolve({ temperature: 70, condition: "Clear" });
};
