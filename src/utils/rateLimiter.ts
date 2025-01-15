interface RateLimitEntry {
  timestamp: number;
  streamerId: string;
}

class RateLimiter {
  private static instance: RateLimiter;
  private lastCalls: RateLimitEntry[] = [];
  private readonly timeWindow = 60000; // 1 minute in milliseconds

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  canMakeCall(streamerId: string): boolean {
    const now = Date.now();
    
    // Clean up old entries
    this.lastCalls = this.lastCalls.filter(
      call => now - call.timestamp < this.timeWindow
    );

    // Check if this streamer has been called recently
    const streamerCall = this.lastCalls.find(
      call => call.streamerId === streamerId
    );

    if (streamerCall) {
      const timeSinceLastCall = now - streamerCall.timestamp;
      return timeSinceLastCall >= this.timeWindow;
    }

    return true;
  }

  recordCall(streamerId: string): void {
    const now = Date.now();
    
    // Remove old entry for this streamer if it exists
    this.lastCalls = this.lastCalls.filter(
      call => call.streamerId !== streamerId
    );
    
    // Add new entry
    this.lastCalls.push({ timestamp: now, streamerId });
  }

  getTimeUntilNextCall(streamerId: string): number {
    const now = Date.now();
    const streamerCall = this.lastCalls.find(
      call => call.streamerId === streamerId
    );

    if (!streamerCall) return 0;

    const timeSinceLastCall = now - streamerCall.timestamp;
    return Math.max(0, this.timeWindow - timeSinceLastCall);
  }
}

export const rateLimiter = RateLimiter.getInstance();
