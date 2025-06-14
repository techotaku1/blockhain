export type EventType =
  | 'SOCIAL_INTEREST'
  | 'DONATION'
  | 'KICKSTARTER'
  | 'PRIVATE_EVENT'
  | 'SOCIAL_ENGAGEMENT';

export type EventStatus =
  | 'DRAFT'
  | 'VOTING'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ForumStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface EventWithDetails extends Event {
  votes: EventVote[];
  forums: Forum[];
}

// Base interfaces
export interface Event {
  id: number;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  creatorId: string;
  requestedFunds: number;
  votingEndDate: Date;
  upvotes: number;
  downvotes: number;
  location?: string;
  fundingAddress?: string;
  imageUrl?: string;
  documentUrl?: string;
  minVotesRequired: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EventVote {
  id: number;
  eventId: number;
  voterId: string;
  voteType: boolean;
  createdAt: Date;
}

export interface Forum {
  id: number;
  eventId: number;
  title: string;
  question: string;
  creatorId: string;
  status: ForumStatus;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ForumResponse {
  id: number;
  forumId: number;
  content: string;
  responderId: string;
  upvotes: number;
  downvotes: number;
  parentId?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Input types
export interface CreateEventInput
  extends Omit<
    Event,
    'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'
  > {
  minVotesRequired: number;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: number;
}

export interface CreateEventVoteInput {
  eventId: number;
  voterId: string;
  voteType: boolean;
}

export interface CreateForumInput
  extends Omit<
    Forum,
    'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'
  > {
}

export interface UpdateForumInput extends Partial<CreateForumInput> {
  id: number;
}

export interface CreateForumResponseInput
  extends Omit<
    ForumResponse,
    'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'
  > {
  parentId?: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Extended types with relationships
export interface EventWithDetails extends Event {
  votes: EventVote[];
  forums: Forum[];
}

export interface ForumWithDetails extends Forum {
  responses?: ForumResponse[];
  event?: Event;
}

// Vote related types
export interface VoteInput {
  eventId: number;
  voterId: string;
  voteType: boolean;
}

export interface ForumVoteInput {
  forumId: number;
  type: 'upvote' | 'downvote';
}

export interface ResponseVoteInput {
  responseId: number;
  type: 'upvote' | 'downvote';
}
