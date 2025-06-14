'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { CreateForumInput } from '~/types';

interface CreateForumProps {
  eventId: number;
}

export function CreateForum({ eventId }: CreateForumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const forumData: CreateForumInput = {
      eventId,
      title: formData.get('title') as string,
      question: formData.get('question') as string,
      creatorId: user?.id ?? '',
      status: 'OPEN',
    };

    try {
      // TODO: Add API call to create forum
      console.log(forumData);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create forum:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary-light hover:bg-primary-light/90 rounded-lg px-4 py-2 text-white"
      >
        New Discussion
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card-dark border-border-dark w-full max-w-md rounded-lg border p-6">
            <h2 className="text-text-primary mb-4 text-xl font-bold">
              Start New Discussion
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Question/Topic
                </label>
                <textarea
                  name="question"
                  required
                  rows={3}
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted hover:text-text-primary bg-card-dark rounded px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-light hover:bg-primary-light/90 rounded px-4 py-2 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
