import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Event } from '~/types';
import { VoteButtons } from './VoteButtons';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-card-dark border-border-dark hover:border-primary-light rounded-lg border p-6 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/events/${event.id}`}
            className="text-text-primary hover:text-primary-light text-xl font-semibold"
          >
            {event.title}
          </Link>
          <p className="text-text-muted mt-2">{event.description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            event.status === 'VOTING'
              ? 'bg-secondary-blue/20 text-secondary-blue'
              : event.status === 'APPROVED'
                ? 'bg-success/20 text-success'
                : 'bg-text-muted/20 text-text-muted'
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-text-muted flex items-center space-x-4">
          <span>Requested: {event.requestedFunds} ETH</span>
          <span>•</span>
          <span>
            Ends in: {formatDistanceToNow(new Date(event.votingEndDate))}
          </span>
        </div>
        <VoteButtons
          eventId={event.id}
          votes={{ up: event.upvotes, down: event.downvotes }}
        />
      </div>
    </div>
  );
}
