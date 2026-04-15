/**
 * Global Data Refresh Event System
 * Synchronizes data refreshes across all open browser tabs using BroadcastChannel
 */
const lastRefreshEvent = ref<{ dataType: string; timestamp: number } | null>(null)
let channel: BroadcastChannel | null = null

if (process.client) {
  channel = new BroadcastChannel('vigo_store_sync')
  channel.onmessage = (event) => {
    if (event.data?.type === 'REFRESH') {
      lastRefreshEvent.value = {
        dataType: event.data.dataType,
        timestamp: Date.now()
      }
    }
  }
}

export const useDataRefresh = () => {
  const triggerRefresh = (dataType: string) => {
    const event = { dataType, timestamp: Date.now() }
    lastRefreshEvent.value = event
    
    // Broadcast to other tabs
    if (channel) {
      channel.postMessage({ type: 'REFRESH', dataType })
    }
  }

  return {
    triggerRefresh,
    lastRefreshEvent: readonly(lastRefreshEvent)
  }
}
