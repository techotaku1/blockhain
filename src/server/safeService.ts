import { ethers } from "ethers"
import Safe from "@safe-global/protocol-kit"
import { MetaTransactionData } from "@safe-global/types-kit"
import "dotenv/config"

let safeInstance: Awaited<ReturnType<typeof Safe.init>> | null = null

export async function getSafeInstance() {
  if (safeInstance) return safeInstance

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)
  const signerPrivateKey = process.env.PRIVATE_KEY!

  try {
    safeInstance = await Safe.init({
      provider: process.env.RPC_URL!,
      signer: signerPrivateKey,
      safeAddress: process.env.SAFE_ADDRESS!,
    })
  } catch (err) {
    console.warn("⚠️  Error al inicializar Safe. Modo simulación activado:", err)
    safeInstance = null // indica que no hay instancia real
  }

  return safeInstance
}

export async function getSafeOwners(): Promise<string[]> {
  const safe = await getSafeInstance()
  
  if (!safe) {
    // Simulación de owners en pruebas
    return [process.env.TEST_OWNER?.toLowerCase() || "0x1111111111111111111111111111111111111111"]
  }

  return await safe.getOwners()
}

export async function executeSafeTransaction({
  to,
  value,
  data = "0x",
}: {
  to: string
  value: string
  data?: string
}) {
  const safe = await getSafeInstance()

  if (!safe) {
    console.warn("⚠️  Modo simulación: no se ejecuta transacción real")
    return { simulated: true }
  }

  const txData: MetaTransactionData = {
    to,
    value,
    data,
    operation: 0,
  }

  const safeTx = await safe.createTransaction({
    transactions: [txData],
  })

  const txResponse = await safe.executeTransaction(safeTx)
  const maybeTx = txResponse.transactionResponse as ethers.providers.TransactionResponse

  if (maybeTx && typeof maybeTx.wait === "function") {
    await maybeTx.wait()
  }

  return safeTx.data
}
