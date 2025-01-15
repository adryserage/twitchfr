export class TwitchAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: string,
  ) {
    super(message);
    this.name = "TwitchAPIError";
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public waitTime: number,
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export interface ErrorResponse {
  error: string;
  details?: string;
  waitTime?: number;
}
