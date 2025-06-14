'use client';

import { useState } from 'react';

import { PoapAPI } from '~/lib/poap/api';

import type { PoapEventResponse, PoapDrop } from '~/lib/poap/types';

export default function PoapTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoapEventResponse | PoapDrop | null>(
    null
  );
  const [error, setError] = useState<string>('');
  const poapApi = new PoapAPI();

  // Test de conexión básica
  const testConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await poapApi.getEventById(16947);
      setResult(result);
      console.log('POAP Response:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('POAP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test de creación de drop
  const testCreateDrop = async () => {
    setLoading(true);
    setError('');
    try {
      const drop = await poapApi.createDrop({
        name: 'Environmental Report Test',
        description: 'Test drop for environmental reporting system',
        city: 'Test City',
        country: 'Test Country',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        expiry_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        year: new Date().getFullYear(),
        event_url: 'https://test-event.com',
        image: 'YOUR_BASE64_IMAGE',
        email: 'your-email@domain.com',
        requested_codes: 1,
      });
      setResult(drop);
      console.log('Drop Created:', drop);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Drop Creation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">POAP Integration Test</h1>

      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test POAP Connection'}
        </button>

        <button
          onClick={testCreateDrop}
          disabled={loading}
          className="ml-4 rounded bg-green-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Test Create Drop'}
        </button>

        {error && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <pre className="overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
