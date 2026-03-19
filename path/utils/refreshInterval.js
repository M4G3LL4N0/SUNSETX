export const useRefreshInterval = () => {
  let intervalId = null
  const refreshInterval = setInterval(() => {
    if (isActive) {
      attemptLocationFetch()
    }
  }, 90000) // 15 minutes
  return intervalId
}
