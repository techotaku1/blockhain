'use client';

import { type MouseEvent, useState } from 'react';
import { PoapAPI } from '~/lib/poap/api';

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const poapApi = new PoapAPI();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const drop = await poapApi.createDrop({
        name: 'Environmental Report',
        description: 'Reward for reporting environmental issues',
        city: 'Global',
        country: 'Global',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        expiry_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        year: new Date().getFullYear(),
        event_url: 'https://your-app-url.com',
        image: 'your-image-url',
        email: 'your-email@domain.com',
        requested_codes: 1,
      });

      if (drop.event_id) {
        await poapApi.createMintRequest({
          event_id: drop.event_id,
          requested_codes: 1,
          secret_code: drop.secret_code,
        });
        alert('Report submitted successfully!');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error('Unknown error:', error);
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Report Environmental Issue</h1>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  );
}
