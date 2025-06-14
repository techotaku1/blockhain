import { NextResponse } from 'next/server';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapRequestData } from '~/lib/poap/types';

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as PoapRequestData;

    if (!data?.image?.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Valid base64 image is required' },
        { status: 400 }
      );
    }

    if (!process.env.POAP_API_KEY) {
      return NextResponse.json(
        { error: 'POAP API key not configured' },
        { status: 500 }
      );
    }

    console.log('Processing POAP request:', {
      ...data,
      image: '[REDACTED]',
    });

    const api = new PoapAPI();
    const result = await api.createDrop(data);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('POAP Creation Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create POAP',
      },
      { status: 500 }
    );
  }
}
