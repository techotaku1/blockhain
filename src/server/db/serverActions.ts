'use server';

import { db } from '~/server/db'; // Ajusta la ruta según tu estructura
import { userPoints, users, userHistory } from '~/server/db/schema';
import { sql } from 'drizzle-orm';

export async function createUserPoint(formData: FormData) {
  const descripcion = formData.get('descripcion') as string;
  const tipoResiduo = formData.get('tipoResiduo') as string;
  const entidad = formData.get('entidad') as string;
  const notificarAutoridad = formData.get('notificarAutoridad') === '1';
  // Aquí puedes manejar la imagen si la quieres guardar en disco o en la base de datos

  // Simula un userId (deberías obtenerlo del usuario autenticado)
  const userId = 'demo-user';

  await db.insert(userPoints).values({
    userId,
    puntos: 20, // Puedes calcular los puntos según la acción
    descripcion: `${descripcion} (${tipoResiduo}, ${entidad})`,
    // fecha se autogenera
  });
}

export async function getUserStats() {
  // Aquí deberías obtener el userId del usuario autenticado
  const userId = 'demo-user'; // Reemplaza por el userId real
  // Obtener puntos totales
  const puntosResult = await db
    .select({ total: sql<number>`SUM(${userPoints.puntos})` })
    .from(userPoints)
    .where(sql`${userPoints.userId} = ${userId}`);
  const puntos = puntosResult[0]?.total ?? 0;

  // Obtener insignias (esto depende de cómo las guardes, aquí es solo un ejemplo)
  // Si las insignias están en otra tabla, haz el query correspondiente
  const insignias = [
    {
      nombre: 'Recolector Verde',
      color: 'bg-green-700',
      icono: 'FaLeaf',
    },
    {
      nombre: 'Embajador Ecológico',
      color: 'bg-yellow-400',
      icono: 'FaMedal',
    },
    // ...puedes traerlas de la base si tienes una tabla de insignias
  ];

  return { puntos, insignias };
}

export async function getAllUsers() {
  return db.select().from(users);
}

export async function addUserFromClerk({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name: string;
}) {
  // Evita duplicados
  const exists = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${id}`);
  if (exists.length === 0) {
    await db.insert(users).values({ id, email, name });
  }
}

export async function addUserHistory({
  userId,
  action,
  points,
}: {
  userId: string;
  action: string;
  points: number;
}) {
  await db.insert(userHistory).values({ userId, action, points });
}

export async function saveUserFromClerk({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name: string;
}) {
  // Evita duplicados
  const exists = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${id}`);
  if (exists.length === 0) {
    await db.insert(users).values({ id, email, name });
  }
}
