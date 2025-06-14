'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CreateEventInput, EventType } from '~/types';

const EVENT_TYPES: { [key in EventType]: string } = {
  SOCIAL_INTEREST: 'Interés Social',
  DONATION: 'Donación',
  KICKSTARTER: 'Crowdfunding',
  PRIVATE_EVENT: 'Evento Privado',
  SOCIAL_ENGAGEMENT: 'Compromiso Social',
};

export default function EventForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const eventData: CreateEventInput = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as EventType,
      status: 'DRAFT',
      creatorId: user?.id ?? '',

      // Campos requeridos según CreateEventInput
      requestedFunds: Number(formData.get('requestedFunds')),
      votingEndDate: new Date(formData.get('votingEndDate') as string),

      // Campos opcionales
      location: formData.get('location') as string,
      fundingAddress: formData.get('fundingAddress') as string,
      imageUrl: formData.get('imageUrl') as string,
      documentUrl: formData.get('documentUrl') as string,
      minVotesRequired: Number(formData.get('minVotesRequired')),
    };

    // TODO: Añadir llamada a API para crear evento
    console.log(eventData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary-light hover:bg-primary-light/90 rounded-lg px-4 py-2 text-white"
      >
        Crear Proyecto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card-dark border-border-dark w-full max-w-md rounded-lg border p-6">
            <h2 className="text-text-primary mb-4 text-xl font-bold">
              Crear Nuevo Proyecto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Título
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
                  Descripción
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Tipo de Proyecto
                </label>
                <select
                  name="type"
                  required
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                >
                  {Object.entries(EVENT_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Fondos Solicitados (ETH)
                </label>
                <input
                  type="number"
                  name="requestedFunds"
                  required
                  step="0.01"
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Fecha Final de Votación
                </label>
                <input
                  type="datetime-local"
                  name="votingEndDate"
                  required
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Dirección de Fondos
                </label>
                <input
                  type="text"
                  name="fundingAddress"
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="text-text-primary block text-sm font-medium">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  className="border-border-dark bg-bg-dark text-text-primary mt-1 w-full rounded-md border p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-card-dark text-text-muted hover:text-text-primary rounded px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary-light hover:bg-primary-light/90 rounded px-4 py-2 text-white"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
