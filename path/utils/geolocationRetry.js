export const retryGeolocation = async () => {
  let retries = 0
  const maxRetries = 3
  while (retries < maxRetries) {
    try {
      const pos = await getUserLocation()
      return pos
    } catch (err) {
      retries++
      if (retries >= maxRetries) {
        throw err
      }
      await new Promise(res => setTimeout(res, 2000))
    }
  }
}
