'use client';

import React, { useState } from 'react';

import { PoapAPI } from '~/lib/poap/api';

export default function PoapTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [poaps, setPoaps] = React.useState<string[]>([]); // Usa el tipo adecuado en vez de any

  const handleTest = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Starting POAP API test...');
      const api = new PoapAPI();
      const event = await api.getEventById('16947');
      console.log('API Response:', event);
      setResult(event);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">POAP API Test</h1>

        <button
          onClick={handleTest}
          disabled={loading}
          className="mb-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test POAP API'}
        </button>

        {error && (
          <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
            <p className="font-bold">Success!</p>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
