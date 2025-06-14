import type {
  PoapDrop,
  PoapDropInput,
  PoapMintRequest,
  ApiErrorResponse,
} from './types';

const POAP_API_URL = 'https://api.poap.tech';

export class PoapAPI {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
    if (!apiKey) throw new Error('POAP API key is required');
    this.apiKey = apiKey;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      console.log('Fetching:', `${POAP_API_URL}${endpoint}`);
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'X-API-Key': `${this.apiKey.substring(0, 10)}...`,
      });

      const response = await fetch(`${POAP_API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
      });

      const responseData = (await response.json()) as T | ApiErrorResponse;

      if (!response.ok) {
        const errorData = responseData as ApiErrorResponse;
        throw new Error(
          `POAP API error: ${response.status} - ${errorData.message}`
        );
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  async createDrop(params: PoapDropInput): Promise<PoapDrop> {
    return this.fetch<PoapDrop>('/events', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        virtual_event: true,
        private_event: false,
        secret_code: Math.random().toString(36).substring(2, 8),
      }),
    });
  }

  async createMintRequest(params: PoapMintRequest): Promise<void> {
    return this.fetch<void>('/redeem-request', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        redeem_type: 'qr_code',
      }),
    });
  }

  async getEventById(eventId: number | string): Promise<PoapDrop> {
    return this.fetch<PoapDrop>(`/events/id/${eventId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });
  }
}
