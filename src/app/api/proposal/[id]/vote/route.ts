import { db } from '~/server/db'
import { proposals, votes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { getSafeOwners } from '~/server/safeService'

const voteSchema = z.object({
  voter: z.string().length(42), // Dirección Ethereum
  vote : z.boolean(),           // true = sí, false = no
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Validar el cuerpo del request
    const body   = await req.json()
    const parsed = voteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { voter, vote } = parsed.data

    // 2. Verificar que el votante sea owner del Safe
    const owners = (await getSafeOwners()).map((o) => o.toLowerCase())
    if (!owners.includes(voter.toLowerCase())) {
      return NextResponse.json({ error: 'Votante no autorizado' }, { status: 403 })
    }

    // 3. Evitar votos duplicados
    const proposalId = params.id
    const existingVotes = await db
      .select()
      .from(votes)
      .where(eq(votes.proposalId, proposalId))

    if (existingVotes.some((v) => v.voter.toLowerCase() === voter.toLowerCase())) {
      return NextResponse.json({ error: 'Ya votaste por esta propuesta' }, { status: 400 })
    }

    // 4. Registrar el voto
    await db.insert(votes).values({
      id: uuidv4(),
      proposalId,
      voter,
      vote,
    })

    // 5. Verificar si ya votaron todos (esto se usará más adelante)
    const allVotes = [...existingVotes, { voter, vote }]
    const yesVotes = allVotes.filter((v) => v.vote).length
    const hasEveryoneVoted = allVotes.length === owners.length
    const hasMajority = yesVotes > owners.length / 2

    console.log({
      proposalId,
      totalVotes: allVotes.length,
      yesVotes,
      hasEveryoneVoted,
      hasMajority,
    })

    // 6. NO ejecutamos ninguna transacción aquí
    // Eso se hará más adelante en otro endpoint/controlador

    return NextResponse.json({ status: 'voto registrado' })
  } catch (err) {
    console.error('❌ Error en /vote:', err)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}


export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const votesList = await db
    .select()
    .from(votes)
    .where(eq(votes.proposalId, params.id));

  return NextResponse.json(votesList);
}
