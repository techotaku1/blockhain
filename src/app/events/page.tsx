'use client'
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
            Proyectos
          </h1>
          <p className="text-text-muted mt-2">
            Vota y discute sobre propuestas de bonos verder
          </p>
        </div>
        <SignedIn>
          <EventForm />
        </SignedIn>
        <SignedOut>
          <p className="text-text-muted">Inicia sesíon para crear proyectos</p>
        </SignedOut>
      </div>

      <Suspense
        fallback={
          <div className="text-text-muted flex h-64 items-center justify-center">
            Cargando proyectos...
          </div>
        }
      >
        <EventList />
      </Suspense>
    </div>
  );
}
