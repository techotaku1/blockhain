import type { PoapDrop, PoapDropInput, PoapMintRequest } from './types';

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
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    });

    const response = await fetch(`${POAP_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
        error: errorText,
      });
      throw new Error(`POAP API error: ${response.statusText} - ${errorText}`);
    }

    return response.json() as Promise<T>;
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
