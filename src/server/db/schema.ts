// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gonzaapp_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const userPoints = createTable(
  'user_points',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 128 }).notNull(), // ID del usuario (puede ser UUID, email, etc.)
    puntos: d.integer().notNull(),
    descripcion: d.varchar({ length: 256 }),
    fecha: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  })
  // Puedes agregar índices si lo deseas, por ejemplo por userId
);

export const users = createTable('users', (d) => ({
  id: d.varchar({ length: 128 }).primaryKey(), // Clerk userId
  email: d.varchar({ length: 256 }).notNull(),
  name: d.varchar({ length: 256 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const userRewardsProgress = createTable(
  'user_rewards_progress',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 128 }).notNull(),
    rewardId: d.varchar({ length: 128 }).notNull(),
    progress: d.integer().notNull(), // porcentaje o puntos de progreso
    completed: d.boolean().default(false).notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  })
);

export const userSitesHistory = createTable('user_sites_history', (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d.varchar({ length: 128 }).notNull(),
  siteName: d.varchar({ length: 256 }).notNull(),
  siteUrl: d.varchar({ length: 512 }),
  visitedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const userHistory = createTable('user_history', (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d.varchar({ length: 128 }).notNull(),
  action: d.varchar({ length: 256 }).notNull(),
  points: d.integer().notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));
