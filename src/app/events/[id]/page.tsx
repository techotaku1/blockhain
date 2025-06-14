import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importamos el locale español
import { eventActions } from '~/server/actions/events';
import { VoteButtons } from '../components/VoteButtons';
import { CreateForum } from '../components/forums/CreateForum';
import { ForumList } from '../components/forums/ForumList';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { data: event, error } = await eventActions.getById(Number(params.id));

  if (error || !event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="bg-card-dark border-border-dark rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-text-primary text-3xl font-bold">
              {event.title}
            </h1>
            <p className="text-text-muted mt-2">Creado por {event.creatorId}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm ${
              event.status === 'VOTING'
                ? 'bg-secondary-blue/20 text-secondary-blue'
                : event.status === 'APPROVED'
                  ? 'bg-success/20 text-success'
                  : event.status === 'REJECTED'
                    ? 'bg-error/20 text-error'
                    : 'bg-text-muted/20 text-text-muted'
            }`}
          >
            {event.status === 'VOTING'
              ? 'En Votación'
              : event.status === 'APPROVED'
                ? 'Aprobado'
                : event.status === 'REJECTED'
                  ? 'Rechazado'
                  : event.status === 'IN_PROGRESS'
                    ? 'En Progreso'
                    : event.status === 'COMPLETED'
                      ? 'Completado'
                      : event.status === 'CANCELLED'
                        ? 'Cancelado'
                        : 'Borrador'}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-text-primary">{event.description}</p>

          {/* Detalles del Proyecto */}
          <div className="border-border-dark mt-4 grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div>
              <h3 className="text-text-muted text-sm">Fondos Solicitados</h3>
              <p className="text-text-primary text-lg font-medium">
                {event.requestedFunds} ETH
              </p>
            </div>
            <div>
              <h3 className="text-text-muted text-sm">Votación Termina</h3>
              <p className="text-text-primary text-lg font-medium">
                {formatDistanceToNow(new Date(event.votingEndDate), {
                  locale: es,
                })}
              </p>
            </div>
            <div>
              <h3 className="text-text-muted text-sm">Ubicación</h3>
              <p className="text-text-primary text-lg font-medium">
                {event.location || 'No especificada'}
              </p>
            </div>
            <div>
              <h3 className="text-text-muted text-sm">Votos Requeridos</h3>
              <p className="text-text-primary text-lg font-medium">
                {event.minVotesRequired}
              </p>
            </div>
          </div>

          {/* Sección de Votos */}
          <div className="border-border-dark flex items-center justify-between border-t pt-4">
            <div className="text-text-muted">
              {event.upvotes + event.downvotes} votos en total
            </div>
            <VoteButtons
              eventId={event.id}
              votes={{
                up: event.upvotes,
                down: event.downvotes,
              }}
            />
          </div>
        </div>
      </div>

      {/* Sección de Foros */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-text-primary text-2xl font-bold">
            Foros de Discusión
          </h2>
          <CreateForum eventId={event.id} />
        </div>

        <Suspense
          fallback={
            <div className="text-text-muted flex items-center justify-center py-12">
              Cargando foros...
            </div>
          }
        >
          <ForumList eventId={event.id} />
        </Suspense>
      </div>
    </div>
  );
}
