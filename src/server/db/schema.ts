// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm';
import {
  index,
  uniqueIndex,
  pgTableCreator,
  varchar,
  timestamp,
  integer,
  pgEnum,
  text,
  boolean,
  numeric,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

// proyectos: titulo, descripcion, participantes, creador, acciones, foros
// foros: comentario principal (pregunta), respuestas

export const eventType = pgEnum('event_type', [
  'SOCIAL_INTEREST',
  'DONATION',
  'KICKSTARTER',
  'PRIVATE_EVENT',
  'SOCIAL_ENGAGEMENT',
]);

export const eventStatus = pgEnum('event_status', [
  'DRAFT',
  'VOTING',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const actionType = pgEnum('action_type', [
  'COLLECT',
  'DONATE',
  'PARTICIPATE',
  'SHARE',
  'OTHER',
]);

export const events = createTable(
  'event',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }).notNull(),
    description: text('description'),
    type: eventType('type'),
    status: eventStatus('status').default('DRAFT').notNull(),
    creatorId: d.varchar({ length: 256 }).notNull(),
    location: d.varchar({ length: 256 }),
    startDate: d.timestamp({ withTimezone: true }).notNull(),
    endDate: d.timestamp({ withTimezone: true }),
    maxParticipants: d.integer(),
    poapEventId: d.varchar({ length: 256 }),
    imageUrl: d.varchar({ length: 512 }), // Nueva: Imagen del proyecto
    actionType: actionType('actionType'), // Nueva: Tipo de acción
    actionGoal: d.integer(), // Nueva: Meta numérica
    actionProgress: d.integer().default(0), // Nueva: Progreso actual
    actionMetadata: d.jsonb(), // Nueva: Datos específicos de la acción
    evidenceRequired: d.boolean().default(true), // Nueva: Requiere evidencia
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
    index('event_action_type_idx').on(t.actionType),
  ]
);

export const eventEvidence = createTable(
  'event_evidence',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: d.integer().references(() => events.id),
    participantId: d.varchar({ length: 256 }).notNull(),
    imageUrl: d.varchar({ length: 512 }).notNull(),
    description: text('description'),
    verified: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index('evidence_event_idx').on(t.eventId),
    index('evidence_participant_idx').on(t.participantId),
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

export const eventVotes = createTable(
  'event_vote',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: d.integer().references(() => events.id, { onDelete: 'cascade' }),
    voterId: d.varchar({ length: 256 }).notNull(),
    voteType: d.boolean().notNull(), // true = upvote, false = downvote
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index('vote_event_idx').on(t.eventId),
    index('vote_voter_idx').on(t.voterId),
    // Prevenir votos duplicados por usuario por evento
    uniqueIndex('vote_unique_idx').on(t.eventId, t.voterId),
  ]
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

// ...existing code...

export const forumStatus = pgEnum('forum_status', [
  'OPEN',
  'CLOSED',
  'ARCHIVED',
]);

export const forums = createTable(
  'forum',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: d.integer().references(() => events.id),
    title: d.varchar({ length: 256 }).notNull(),
    question: text('question').notNull(),
    creatorId: d.varchar({ length: 256 }).notNull(), // wallet address
    status: forumStatus('status').default('OPEN').notNull(),
    upvotes: d.integer().default(0),
    downvotes: d.integer().default(0),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index('forum_event_idx').on(t.eventId),
    index('forum_creator_idx').on(t.creatorId),
    index('forum_status_idx').on(t.status),
  ]
);

export const forumResponses: any = createTable(
  'forum_response',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    forumId: d.integer().references(() => forums.id),
    content: text('content').notNull(),
    responderId: d.varchar({ length: 256 }).notNull(), // wallet address
    upvotes: d.integer().default(0),
    downvotes: d.integer().default(0),
    parentId: d.integer().references(() => forumResponses.id), // For nested responses
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index('response_forum_idx').on(t.forumId),
    index('response_responder_idx').on(t.responderId),
    index('response_parent_idx').on(t.parentId),
  ]
);
