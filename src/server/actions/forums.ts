import { and, eq, sql } from 'drizzle-orm';
import { db } from '~/server/db';
import { forums, forumResponses } from '~/server/db/schema';
import type {
  CreateForumInput,
  UpdateForumInput,
  CreateForumResponseInput,
  ForumStatus,
  ForumVoteInput,
  ResponseVoteInput,
  ApiResponse,
  ForumWithDetails,
  Forum,
} from '~/types';

export const forumActions = {
  // Create forum
  async create(
    input: CreateForumInput
  ): Promise<ApiResponse<ForumWithDetails>> {
    try {
      const [forum] = await db
        .insert(forums)
        .values({
          ...input,
          upvotes: 0,
          downvotes: 0,
        })
        .returning();
      return { data: forum as ForumWithDetails };
    } catch (error) {
      return { error: 'Failed to create forum' };
    }
  },

  // Get forum with responses
  async getById(id: number): Promise<ApiResponse<ForumWithDetails>> {
    try {
      const forum = await db.query.forums.findFirst({
        where: eq(forums.id, id),
        with: {
          responses: {
            orderBy: (responses, { desc }) => [desc(responses.createdAt)],
          },
          event: true,
        },
      });
      if (!forum || forum.eventId === null) {
        return { error: 'Forum not found' };
      }
      return { data: forum as unknown as ForumWithDetails };
    } catch (error) {
      return { error: 'Failed to fetch forum' };
    }
  },

  async getByEventId(eventId: number): Promise<ApiResponse<Forum[]>> {
    try {
      const eventForums = await db
        .select()
        .from(forums)
        .where(and(eq(forums.eventId, eventId), sql`${forums.eventId} IS NOT NULL`))
        .orderBy(forums.createdAt);

      return { data: eventForums as Forum[] };
    } catch (error) {
      return { error: 'Failed to fetch forums' };
    }
  },

  // Add response
  async addResponse(input: CreateForumResponseInput) {
    try {
      const [response] = await db
        .insert(forumResponses)
        .values({
          ...input,
          upvotes: 0,
          downvotes: 0,
        })
        .returning();
      return { data: response };
    } catch (error) {
      return { error: 'Failed to add response' };
    }
  },

  // Vote on forum
  async voteForum({ forumId, type }: ForumVoteInput) {
    try {
      const [updatedForum] = await db
        .update(forums)
        .set({
          [type === 'upvote' ? 'upvotes' : 'downvotes']: sql`${
            type === 'upvote' ? forums.upvotes : forums.downvotes
          } + 1`,
          updatedAt: new Date(),
        })
        .where(eq(forums.id, forumId))
        .returning();
      return { data: updatedForum };
    } catch (error) {
      return { error: 'Failed to update vote' };
    }
  },

  // Vote on response
  async voteResponse({ responseId, type }: ResponseVoteInput) {
    try {
      const [updatedResponse] = await db
        .update(forumResponses)
        .set({
          [type === 'upvote' ? 'upvotes' : 'downvotes']: sql`${
            type === 'upvote'
              ? forumResponses.upvotes
              : forumResponses.downvotes
          } + 1`,
          updatedAt: new Date(),
        })
        .where(eq(forumResponses.id, responseId))
        .returning();
      return { data: updatedResponse };
    } catch (error) {
      return { error: 'Failed to update response vote' };
    }
  },
};
