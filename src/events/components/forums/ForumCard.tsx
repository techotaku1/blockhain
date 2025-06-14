import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Forum } from '~/types';

interface ForumCardProps {
  forum: Forum;
}

export function ForumCard({ forum }: ForumCardProps) {
  return (
    <Link
      href={`/forums/${forum.id}`}
      className="bg-card-dark border-border-dark hover:border-primary-light flex flex-col rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-text-primary text-lg font-medium">
            {forum.title}
          </h3>
          <p className="text-text-muted mt-1">{forum.question}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            forum.status === 'OPEN'
              ? 'bg-success/20 text-success'
              : forum.status === 'CLOSED'
                ? 'bg-error/20 text-error'
                : 'bg-text-muted/20 text-text-muted'
          }`}
        >
          {forum.status}
        </span>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>By {forum.creatorId}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(forum.createdAt))} ago</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>👍 {forum.upvotes}</span>
          <span>👎 {forum.downvotes}</span>
        </div>
      </div>
    </Link>
  );
}
