const PREFIX = 'hc360_'

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.warn(`Error saving to localStorage key "${key}":`, e)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e)
    }
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    } catch (e) {
      console.warn('Error clearing localStorage:', e)
    }
  },
}
