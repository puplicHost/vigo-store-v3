/**
 * Global Data Refresh Event System
 * Allows triggering data refreshes across different pages
 */
export const useDataRefresh = () => {
  const refreshEvents = ref<Set<string>>(new Set())

  // Trigger a refresh event for a specific data type
  const triggerRefresh = (dataType: string) => {
    refreshEvents.value.add(dataType)
    // Clear the event after a short delay to prevent infinite loops
    setTimeout(() => {
      refreshEvents.value.delete(dataType)
    }, 100)
  }

  // Check if a refresh event is pending for a data type
  const shouldRefresh = (dataType: string) => {
    return refreshEvents.value.has(dataType)
  }

  return {
    triggerRefresh,
    shouldRefresh
  }
}
