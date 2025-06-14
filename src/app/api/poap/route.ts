import { NextResponse } from 'next/server';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapDropInput } from '~/lib/poap/types';

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as PoapDropInput;

    // Validate required fields
    if (!data.name || !data.description || !data.image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const api = new PoapAPI();
    const result = await api.createDrop(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('POAP API Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create POAP drop',
      },
      { status: 500 }
    );
  }
}
