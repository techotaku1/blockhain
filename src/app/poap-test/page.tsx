'use client';

import { useState } from 'react';
import { PoapAPI } from '~/lib/poap/api';

export default function PoapTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

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
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">POAP API Test</h1>

        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test POAP API'}
        </button>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
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
