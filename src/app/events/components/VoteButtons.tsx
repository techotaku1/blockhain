import { useUser } from '@clerk/nextjs';
import { useTransition } from 'react';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu';

interface VoteButtonsProps {
  eventId: number;
  votes: {
    up: number;
    down: number;
  };
}

export function VoteButtons({ eventId, votes }: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useUser();

  const handleVote = (type: 'up' | 'down') => {
    if (!isSignedIn) return;

    startTransition(() => {
      // TODO: Implement vote action
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote('up')}
        disabled={!isSignedIn || isPending}
        className={`flex items-center space-x-1 rounded-lg px-3 py-1 transition-colors ${
          isSignedIn
            ? 'hover:bg-success/20 text-text-muted hover:text-success'
            : 'cursor-not-allowed opacity-50'
        }`}
      >
        <LuThumbsUp className="h-5 w-5" />
        <span>{votes.up}</span>
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={!isSignedIn || isPending}
        className={`flex items-center space-x-1 rounded-lg px-3 py-1 transition-colors ${
          isSignedIn
            ? 'hover:bg-error/20 text-text-muted hover:text-error'
            : 'cursor-not-allowed opacity-50'
        }`}
      >
        <LuThumbsDown className="h-5 w-5" />
        <span>{votes.down}</span>
      </button>
    </div>
  );
}
