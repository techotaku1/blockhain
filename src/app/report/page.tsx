'use client';

import { useState } from 'react';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapDrop } from '~/lib/poap/types';

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<PoapDrop | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const api = new PoapAPI();
      const drop = await api.createDrop({
        name: 'Reporte Ambiental',
        description: description || 'Contribución a la protección ambiental',
        city: 'Global',
        country: 'World',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        expiry_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        year: new Date().getFullYear(),
        event_url: 'https://eco-guardian.com',
        image: imageUrl,
        email: 'tu-email@dominio.com',
        requested_codes: 1,
      });
      setResult(drop);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <h1 className="mb-8 text-center text-3xl font-bold text-green-800">
            Reporte Ambiental
          </h1>

          <div className="space-y-6">
            {/* Subida de imagen */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Foto del Problema Ambiental
              </label>
              <input
                type="file"
                accept="image/*"
                title="Sube una foto del problema ambiental"
                placeholder="Selecciona una imagen"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción del Problema
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32 w-full rounded-lg border border-gray-300 p-2"
                placeholder="Describe el problema ambiental..."
              />
            </div>

            {/* Botón de envío */}
            <button
              onClick={handleSubmit}
              disabled={loading || !imageUrl}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Enviar Reporte y Obtener POAP</span>
              )}
            </button>

            {/* Resultado */}
            {result && (
              <div className="mt-6 rounded-lg bg-green-50 p-4">
                <h3 className="font-medium text-green-800">
                  ¡Reporte Enviado!
                </h3>
                <p className="text-sm text-green-600">
                  Tu POAP será enviado al email registrado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
