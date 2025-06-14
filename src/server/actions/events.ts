import { and, eq, sql } from 'drizzle-orm';
import { db } from '~/server/db';
import { events, eventVotes, forums } from '~/server/db/schema';
import type {
  CreateEventInput,
  UpdateEventInput,
  EventStatus,
  EventType,
  CreateEventVoteInput,
  ApiResponse,
  EventWithDetails,
  Event,
  ForumStatus,
  EventVote,
} from '~/types';

export const eventActions = {
  async getById(id: number): Promise<ApiResponse<EventWithDetails>> {
    try {
      const rawEvent = await db.query.events.findFirst({
        where: eq(events.id, id),
        with: {
          votes: true,
          forums: true,
        },
      });

      if (!rawEvent) {
        return { error: 'Event not found' };
      }

      // Transform DB schema to match EventWithDetails type
      const event: EventWithDetails = {
        id: rawEvent.id,
        title: rawEvent.title,
        description: rawEvent.description || '',
        type: rawEvent.type || 'SOCIAL_INTEREST',
        status: rawEvent.status as EventStatus, // Cast to correct type
        creatorId: rawEvent.creatorId,
        requestedFunds: Number(rawEvent.actionGoal || 0),
        votingEndDate: rawEvent.endDate || new Date(),
        upvotes: rawEvent.actionProgress || 0,
        downvotes: 0,
        location: rawEvent.location || '',
        fundingAddress: '',
        imageUrl: rawEvent.imageUrl || '',
        documentUrl: '',
        minVotesRequired: rawEvent.maxParticipants || 0,
        createdAt: rawEvent.createdAt,
        updatedAt: rawEvent.updatedAt || undefined, // Convert null to undefined
        votes:
          rawEvent.votes?.map((vote) => ({
            id: vote.id,
            eventId: vote.eventId,
            voterId: vote.voterId,
            voteType: vote.voteType,
            createdAt: vote.createdAt,
          })) || [],
        forums: (rawEvent.forums || []).map((forum) => ({
          id: forum.id,
          eventId: forum.eventId,
          title: forum.title,
          question: forum.question,
          creatorId: forum.creatorId,
          status: forum.status as ForumStatus,
          upvotes: forum.upvotes || 0,
          downvotes: forum.downvotes || 0,
          createdAt: forum.createdAt,
          updatedAt: forum.updatedAt || undefined,
        })),
      };

      return { data: event };
    } catch (error) {
      return { error: 'Failed to fetch event' };
    }
  },

  async getAll(filters?: {
    creatorId?: string;
    status?: EventStatus;
    type?: EventType;
  }): Promise<ApiResponse<Event[]>> {
    try {
      const conditions = [];
      if (filters) {
        if (filters.creatorId) {
          conditions.push(eq(events.creatorId, filters.creatorId));
        }
        if (filters.status) {
          conditions.push(eq(events.status, filters.status));
        }
        if (filters.type) {
          conditions.push(eq(events.type, filters.type));
        }
      }

      const rawEvents = await db
        .select()
        .from(events)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Transform DB schema to match Event type
      const transformedEvents: Event[] = rawEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        type: event.type || 'SOCIAL_INTEREST',
        status: event.status,
        creatorId: event.creatorId,
        requestedFunds: Number(event.actionGoal || 0),
        votingEndDate: event.endDate || new Date(),
        upvotes: event.actionProgress || 0,
        downvotes: 0,
        location: event.location || '',
        fundingAddress: '',
        imageUrl: event.imageUrl || '',
        documentUrl: '',
        minVotesRequired: event.maxParticipants || 0,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt || undefined,
      }));

      return { data: transformedEvents };
    } catch (error) {
      return { error: 'Failed to fetch events' };
    }
  },

  async vote(input: CreateEventVoteInput): Promise<ApiResponse<EventVote>> {
    try {
      return await db.transaction(async (tx) => {
        const existingVote = await tx.query.eventVotes.findFirst({
          where: and(
            eq(eventVotes.eventId, input.eventId),
            eq(eventVotes.voterId, input.voterId)
          ),
        });

        if (existingVote) {
          return { error: 'User already voted on this event' };
        }

        const [vote] = await tx.insert(eventVotes).values(input).returning() as unknown as EventVote[];

        await tx
          .update(events)
          .set({
            actionProgress: sql`${events.actionProgress} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(events.id, input.eventId));

        return { data: vote };
      });
    } catch (error) {
      return { error: 'Failed to register vote' };
    }
  },

  async updateStatus(
    id: number,
    status: EventStatus
  ): Promise<ApiResponse<Event>> {
    try {
      const [rawEvent] = await db
        .update(events)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
        .returning();

      const event: Event = {
        id: rawEvent.id,
        title: rawEvent.title,
        description: rawEvent.description || '',
        type: rawEvent.type || 'SOCIAL_INTEREST',
        status: rawEvent.status,
        creatorId: rawEvent.creatorId,
        requestedFunds: Number(rawEvent.actionGoal || 0),
        votingEndDate: rawEvent.endDate || new Date(),
        upvotes: rawEvent.actionProgress || 0,
        downvotes: 0,
        location: rawEvent.location || '',
        fundingAddress: '',
        imageUrl: rawEvent.imageUrl || '',
        documentUrl: '',
        minVotesRequired: rawEvent.maxParticipants || 0,
        createdAt: rawEvent.createdAt,
        updatedAt: rawEvent.updatedAt || undefined,
      };

      return { data: event };
    } catch (error) {
      return { error: 'Failed to update event status' };
    }
  },
};
