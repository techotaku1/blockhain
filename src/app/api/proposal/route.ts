import { db } from '~/server/db';
import { proposals } from '~/server/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  to: z.string().length(42),
  value: z.string(),
  data: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const id = uuidv4();
  const { title, description, to, value, data = '0x' } = parsed.data;

  await db.insert(proposals).values({
    id,
    title,
    description,
    to,
    value,
    data,
    executed: false,
  });

  return NextResponse.json({ id, status: 'created' });
}
