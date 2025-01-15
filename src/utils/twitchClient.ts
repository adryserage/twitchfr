import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { TwitchAPIError } from '@/types/errors';

class TwitchClientManager {
  private static instance: TwitchClientManager;
  private apiClient: ApiClient | null = null;
  private initializationPromise: Promise<ApiClient> | null = null;

  private constructor() {}

  static getInstance(): TwitchClientManager {
    if (!TwitchClientManager.instance) {
      TwitchClientManager.instance = new TwitchClientManager();
    }
    return TwitchClientManager.instance;
  }

  async getClient(): Promise<ApiClient> {
    if (this.apiClient) {
      return this.apiClient;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeClient();
    return this.initializationPromise;
  }

  private async initializeClient(): Promise<ApiClient> {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new TwitchAPIError(
        'Missing Twitch credentials',
        500,
        'Please check your environment variables'
      );
    }

    if (!/^[a-z0-9]{30}$/.test(clientId)) {
      throw new TwitchAPIError(
        'Invalid client ID format',
        400,
        'Client ID should be 30 characters long and contain only lowercase letters and numbers'
      );
    }

    try {
      console.log('Initializing Twitch API client...');
      const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
      this.apiClient = new ApiClient({ authProvider });

      // Verify the client works
      const testUser = await this.apiClient.users.getUserByName('twitch');
      if (!testUser) {
        throw new TwitchAPIError('Failed to validate API connection');
      }

      console.log('Twitch API client initialized successfully');
      return this.apiClient;
    } catch (error) {
      this.apiClient = null;
      this.initializationPromise = null;

      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid client')) {
          throw new TwitchAPIError(
            'Invalid client credentials',
            401,
            'The client ID or secret is invalid. Please check your Twitch Developer Console.'
          );
        } else if (message.includes('forbidden')) {
          throw new TwitchAPIError(
            'Access forbidden',
            403,
            'Your application may not have the required permissions or the credentials may have expired.'
          );
        }
      }

      throw new TwitchAPIError(
        'Failed to initialize Twitch API',
        500,
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  resetClient(): void {
    this.apiClient = null;
    this.initializationPromise = null;
  }
}

export const twitchClient = TwitchClientManager.getInstance();
