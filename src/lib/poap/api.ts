import type {
  PoapDrop,
  PoapDropInput,
  PoapMintRequest,
  ApiErrorResponse,
} from './types';

const POAP_API_URL = 'https://api.poap.tech';

interface PoapApiError {
  message: string;
  status?: number;
}

export class PoapAPI {
  private apiKey: string;
  private clientSecret: string;

  constructor() {
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
          'Client-Secret': this.clientSecret,
        },
      });

      const responseText = await response.text();
      const responseData = JSON.parse(responseText) as T | PoapApiError;

      if (!response.ok) {
        const error = responseData as PoapApiError;
        throw new Error(
          `POAP API error: ${response.status} - ${error.message ?? 'Unknown error'}`
        );
      }

      return responseData as T;
    } catch (error) {
      console.error('POAP API Error:', error);
      throw error;
    }
  }

  async createDrop(params: PoapDropInput): Promise<PoapDrop> {
    // Format dates correctly
    const startDate = new Date(params.start_date);
    const endDate = new Date(params.end_date);
    const expiryDate = new Date(params.expiry_date);

    return this.fetch<PoapDrop>('/events', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        city: params.city || 'Virtual',
        country: params.country || 'Global',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        expiry_date: expiryDate.toISOString().split('T')[0],
        year: new Date().getFullYear(),
        event_url: params.event_url,
        virtual_event: true,
        private_event: false,
        secret_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        event_template_id: 0,
        image: params.image,
        email: params.email,
        requested_codes: params.requested_codes,
        channel: 'website',
        platform: 'web',
        location_type: 'virtual',
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
