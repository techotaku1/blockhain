import { NextResponse } from 'next/server';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapRequestData, PoapDrop, ApiResponse } from '~/lib/poap/types';

export async function POST(request: Request) {
  try {
    const requestData = (await request.json()) as PoapRequestData;
    const api = new PoapAPI();

    const dropInput = {
      ...requestData,
      year: new Date().getFullYear(),
    };

    const poapResult = await api.createDrop(dropInput);

    return NextResponse.json({
      data: poapResult,
    } as ApiResponse<PoapDrop>);
  } catch (error) {
    console.error('POAP API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
