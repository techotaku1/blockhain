'use client';

import { useState } from 'react';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapDrop } from '~/lib/poap/types';

export default function PoapTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoapDrop | null>(null);
  const [error, setError] = useState<string>('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Log para verificar la API key
      console.log('API Key available:', !!process.env.NEXT_PUBLIC_POAP_API_KEY);

      const api = new PoapAPI();
      console.log(
        'Testing connection to:',
        `${process.env.NEXT_PUBLIC_POAP_API_KEY?.substring(0, 10)}...`
      );

      const event = await api.getEventById('16947');
      console.log('Response received:', event);
      setResult(event);
    } catch (err) {
      console.error('Full error:', err);
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Prueba de Conexión POAP
          </h1>

          <div className="space-y-4">
            <button
              onClick={handleTest}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="mr-3 h-5 w-5 animate-spin"
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
                  Probando...
                </span>
              ) : (
                'Probar Conexión'
              )}
            </button>

            {error && (
              <div className="border-l-4 border-red-500 bg-red-50 p-4">
                <p className="text-red-700">{error}</p>
                <p className="mt-1 text-sm text-red-600">
                  Verifica la consola del navegador para más detalles
                </p>
              </div>
            )}

            {result && (
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <p className="text-green-700">¡Conexión exitosa!</p>
                <pre className="mt-2 overflow-auto rounded bg-white p-2 text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
