import type { PoapDrop, PoapDropInput } from './types';

const POAP_API_URL = 'https://api.poap.tech';

interface ApiErrorResponse {
  status: number;
  message: string;
}

export class PoapAPI {
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.POAP_API_KEY;
    if (!apiKey) throw new Error('POAP API key is required');
    this.apiKey = apiKey;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Build URL with API key as query parameter like in Thunder Client
      const url = new URL(`${POAP_API_URL}${endpoint}`);
      url.searchParams.append('X-API-Key', this.apiKey);
      url.searchParams.append('Content-Type', 'application/json');

      console.log('Making request to:', url.toString());

      const response = await fetch(url.toString(), {
        ...options,
        // No headers needed since we're using URL params
      });

      let responseData: unknown;
      try {
        responseData = await response.json();
      } catch (_error) {
        throw new Error('Invalid JSON response from POAP API');
      }

      if (!response.ok) {
        const errorData = responseData as ApiErrorResponse;
        const errorMessage = errorData?.message ?? 'Unknown error';
        throw new Error(`POAP API error: ${response.status} - ${errorMessage}`);
      }

      return responseData as T;
    } catch (error) {
      console.error('POAP API Error:', error);
      throw error;
    }
  }

  async createDrop(params: PoapDropInput): Promise<PoapDrop> {
    const now = new Date();
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const payload = {
      fancy_id: `environmental-report-${Date.now()}`,
      name: '[TEST] Environmental Report',
      description: 'TEST - Initial validation of POAP integration',
      location_type: 'virtual',
      event_url: params.event_url || '',
      image_url: params.image,
      country: 'World',
      city: 'Virtual',
      platform: 'web',
      year: now.getFullYear(),
      start_date: formatDate(now),
      end_date: formatDate(now),
      expiry_date: formatDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
      from_admin: true,
      virtual_event: true,
      event_template_id: 0,
      private_event: true
    };

    console.log('Creating POAP with:', {
      ...payload,
      image_url: '[REDACTED]',
    });

    return this.fetch<PoapDrop>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}