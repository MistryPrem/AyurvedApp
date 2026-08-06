// In-Memory Storage Abstraction with fallback for AsyncStorage/Local Persistence

class StorageService {
  private memoryStore: Map<string, string> = new Map();

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = this.memoryStore.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (e) {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      this.memoryStore.set(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage setItem error', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    this.memoryStore.delete(key);
  }

  async clear(): Promise<void> {
    this.memoryStore.clear();
  }
}

export const storage = new StorageService();
