export const handleError = (error: any, componentName: string) => {
  console.error(`Error in ${componentName}: ${error.message}`, error)
  // Optionally send error to monitoring service
}
