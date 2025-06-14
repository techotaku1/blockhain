import { Suspense } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import EventList from './components/EventList';
import EventForm from './components/EventForm';

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-3xl font-bold">
            Community Projects
          </h1>
          <p className="text-text-muted mt-2">
            Vote and discuss on community proposals
          </p>
        </div>
        <SignedIn>
          <EventForm />
        </SignedIn>
        <SignedOut>
          <p className="text-text-muted">Sign in to create projects</p>
        </SignedOut>
      </div>

      <Suspense
        fallback={
          <div className="text-text-muted flex h-64 items-center justify-center">
            Loading projects...
          </div>
        }
      >
        <EventList />
      </Suspense>
    </div>
  );
}
