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
        // TODO: Implement API call with filters
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
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
      {/* Filters */}
      <div className="bg-card-dark border-border-dark flex items-center gap-4 rounded-lg border p-4">
        <span className="text-text-muted">Filter by:</span>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="bg-bg-dark text-text-primary border-border-dark focus:border-primary-light rounded-lg border px-3 py-1.5 focus:outline-none"
        >
          {FILTER_OPTIONS.status.map((status) => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'All Status' : status}
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
              {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-text-muted flex flex-col items-center justify-center py-12">
          <p className="text-lg">No events found</p>
          <p className="mt-2">
            Try adjusting your filters or create a new event
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
