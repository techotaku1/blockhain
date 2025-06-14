import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
import type { Event, EventStatus, EventType } from '~/types';

const FILTER_OPTIONS = {
  status: ['ALL', 'VOTING', 'APPROVED', 'REJECTED', 'IN_PROGRESS'] as const,
  type: [
    'ALL',
    'SOCIAL_INTEREST',
    'DONATION',
    'KICKSTARTER',
    'PRIVATE_EVENT',
    'SOCIAL_ENGAGEMENT',
  ] as const,
};

const STATUS_LABELS: Record<string, string> = {
  ALL: 'Todos los Estados',
  VOTING: 'En Votación',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  IN_PROGRESS: 'En Progreso',
};

const TYPE_LABELS: Record<string, string> = {
  ALL: 'Todos los Tipos',
  SOCIAL_INTEREST: 'Interés Social',
  DONATION: 'Donación',
  KICKSTARTER: 'Crowdfunding',
  PRIVATE_EVENT: 'Evento Privado',
  SOCIAL_ENGAGEMENT: 'Compromiso Social',
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card-dark/50 border-border-dark h-48 animate-pulse rounded-lg border"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-card-dark border-border-dark flex items-center gap-4 rounded-lg border p-4">
        <span className="text-text-muted">Filtrar por:</span>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="bg-bg-dark text-text-primary border-border-dark focus:border-primary-light rounded-lg border px-3 py-1.5 focus:outline-none"
        >
          {FILTER_OPTIONS.status.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="bg-bg-dark text-text-primary border-border-dark focus:border-primary-light rounded-lg border px-3 py-1.5 focus:outline-none"
        >
          {FILTER_OPTIONS.type.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Proyectos */}
      {events.length === 0 ? (
        <div className="text-text-muted flex flex-col items-center justify-center py-12">
          <p className="text-lg">No se encontraron proyectos</p>
          <p className="mt-2">
            Intenta ajustar los filtros o crea un nuevo proyecto
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
