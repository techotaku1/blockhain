import type {
  PoapDrop,
  PoapDropInput,
  PoapMintRequest,
  ApiErrorResponse,
} from './types';

const POAP_API_URL = 'https://api.poap.tech';

export class PoapAPI {
  private apiKey: string;
  private clientSecret: string;

  constructor() {
    // Usar las variables del servidor sin NEXT_PUBLIC_
    const apiKey = process.env.POAP_API_KEY;
    const clientSecret = process.env.POAP_CLIENT_SECRET;

    if (!apiKey) throw new Error('POAP API key is required');
    if (!clientSecret) throw new Error('POAP client secret is required');

    this.apiKey = apiKey;
    this.clientSecret = clientSecret;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${POAP_API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'Access-Control-Allow-Origin': '*',
          // Remove Authorization header as we're using X-API-Key
        },
      });

      // Log the response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const responseData = (await response.json()) as T | ApiErrorResponse;

      if (!response.ok) {
        const errorData = responseData as ApiErrorResponse;
        throw new Error(
          `POAP API error: ${response.status} - ${errorData.message}`
        );
      }

      return responseData as T;
    } catch (error) {
      console.error('Full error details:', error);
      throw error;
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
