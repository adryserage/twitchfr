interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private pendingRequests: Map<string, Promise<T>> = new Map();
  private readonly ttl: number;

  constructor(ttlMinutes: number = 1) {
    this.ttl = ttlMinutes * 60 * 1000; // Convert minutes to milliseconds
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  async getOrFetch(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Check cache first
    const cachedValue = this.get(key);
    if (cachedValue) return cachedValue;

    // Check if there's already a pending request
    const pending = this.pendingRequests.get(key);
    if (pending) return pending;

    // Create new request
    const promise = (async (): Promise<T> => {
      try {
        const value = await fetchFn();
        this.set(key, value);
        return value;
      } finally {
        // Clean up pending request
        this.pendingRequests.delete(key);
      }
    })();

    // Store the pending request
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Create a singleton instance for streamer data
export const streamerCache = new Cache(1); // 1 minute TTL
