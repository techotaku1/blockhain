import { forumActions } from '~/server/actions/forums';
import { ForumCard } from './ForumCard';
import type { Forum } from '~/types';

interface ForumListProps {
  eventId: number;
}

export async function ForumList({ eventId }: ForumListProps) {
  const { data: forums, error } = await forumActions.getByEventId(eventId);

  if (error) {
    return (
      <div className="text-error border-error/20 rounded-lg border p-4">
        Error al cargar los foros
      </div>
    );
  }

  if (!forums || forums.length === 0) {
    return (
      <div className="text-text-muted border-border-dark flex items-center justify-center rounded-lg border p-8">
        No hay foros aún. ¡Sé el primero en iniciar una discusión!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {forums.map((forum: Forum) => (
        <ForumCard key={forum.id} forum={forum} />
      ))}
    </div>
  );
}
