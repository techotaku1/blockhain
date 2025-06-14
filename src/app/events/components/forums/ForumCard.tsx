import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importamos el locale español
import type { Forum } from '~/types';

interface ForumCardProps {
  forum: Forum;
}

export function ForumCard({ forum }: ForumCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Abierto';
      case 'CLOSED':
        return 'Cerrado';
      case 'ARCHIVED':
        return 'Archivado';
      default:
        return status;
    }
  };

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
          {getStatusLabel(forum.status)}
        </span>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>Por {forum.creatorId}</span>
          <span>•</span>
          <span>
            hace{' '}
            {formatDistanceToNow(new Date(forum.createdAt), { locale: es })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>👍 {forum.upvotes}</span>
          <span>👎 {forum.downvotes}</span>
        </div>
      </div>
    </Link>
  );
}
