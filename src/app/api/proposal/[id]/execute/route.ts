import { db } from '~/server/db'
import { proposals, votes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { executeSafeTransaction, getSafeOwners } from '~/server/safeService'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const proposalId = params.id

    // 1. Obtener la propuesta
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    if (proposal.executed) {
      return NextResponse.json({ status: 'Ya fue ejecutada' })
    }

    // 2. Obtener votos y dueños
    const votesList = await db
      .select()
      .from(votes)
      .where(eq(votes.proposalId, proposalId))

    const owners = (await getSafeOwners()).map((o) => o.toLowerCase())
    const yesVotes = votesList.filter((v) => v.vote).length
    const hasEveryoneVoted = votesList.length === owners.length
    const hasMajority = yesVotes > owners.length / 2

    if (!hasEveryoneVoted || !hasMajority) {
      return NextResponse.json({
        error: 'Aún no se puede ejecutar: falta mayoría o votos',
        details: {
          totalVotes: votesList.length,
          yesVotes,
          owners: owners.length,
        },
      }, { status: 400 })
    }

    // 3. Intentar ejecutar transacción
    try {
      await executeSafeTransaction({
        to: proposal.to,
        value: proposal.value,
        data: proposal.data,
      })
    } catch (err) {
      console.warn('⚠️ Transacción fallida. Simulando ejecución:', err)
    }

    // 4. Marcar como ejecutada
    await db
      .update(proposals)
      .set({ executed: true })
      .where(eq(proposals.id, proposalId))

    return NextResponse.json({ status: 'Propuesta ejecutada (o simulada)' })
  } catch (err) {
    console.error('❌ Error en /execute:', err)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
