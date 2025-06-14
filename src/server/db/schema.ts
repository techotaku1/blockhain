// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { pgTable, uuid, text, boolean, timestamp, index, pgTableCreator, pgEnum, serial} from "drizzle-orm/pg-core";


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 * import { sql } from 'drizzle-orm';
import {
  index,
  pgTableCreator,
  varchar,
  timestamp,
  integer,
  pgEnum,
  text,
  boolean,
  numeric,
  jsonb,
  serial
} from 'drizzle-orm/pg-core';
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gonzaapp_${name}`);

export const eventType = pgEnum('event_type', [
  'SOCIAL_INTEREST',
  'DONATION',
  'KICKSTARTER',
  'PRIVATE_EVENT',
  'SOCIAL_ENGAGEMENT',
]);

export const eventStatus = pgEnum('event_status', [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]);

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


// Tabla de propuestas (cada una es una idea de gasto)
export const proposals = createTable("proposal", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  to: text("to").notNull(),
  value: text("value").notNull(),
  data: text("data").notNull().default("0x"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  executed: boolean("executed").default(false).notNull(),
});

// Tabla de votos por propuesta
export const votes = createTable("vote", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").notNull().references(() => proposals.id),
  voter: text("voter").notNull(),
  vote: boolean("vote").notNull(), // true = sí, false = no
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});


export const events = createTable(
  'event',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }).notNull(),
    description: text('description'),
    type: eventType('type'),
    status: eventStatus('status').default('DRAFT').notNull(),
    creatorId: d.varchar({ length: 256 }).notNull(), // wallet address
    location: d.varchar({ length: 256 }),
    startDate: d.timestamp({ withTimezone: true }).notNull(),
    endDate: d.timestamp({ withTimezone: true }),
    maxParticipants: d.integer(),
    poapEventId: d.varchar({ length: 256 }), // POAP integration
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index('event_creator_idx').on(t.creatorId),
    index('event_type_idx').on(t.type),
    index('event_status_idx').on(t.status),
  ]
);

export const eventParticipants = createTable(
  'event_participant',
  (d) => ({
    id: serial('id').primaryKey(), // Changed to serial instead of integer
    eventId: d.integer().references(() => events.id),
    participantId: d.varchar({ length: 256 }).notNull(),
    status: d.varchar({ length: 32 }).default('REGISTERED').notNull(),
    poapClaimed: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index('participant_event_idx').on(t.eventId, t.participantId)]
);

export const rewards = createTable(
  'reward',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: d.integer().references(() => events.id),
    type: d.varchar({ length: 32 }).notNull(), // POAP, TOKEN, BADGE
    tokenAddress: d.varchar({ length: 256 }), // If reward is a token
    amount: d.numeric(), // Token amount if applicable
    metadata: d.jsonb(), // Additional reward data
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index('reward_event_idx').on(t.eventId)]
);