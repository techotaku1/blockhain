'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useUser } from '@clerk/nextjs';

import type { PoapDrop, ApiResponse } from '~/lib/poap/types';

export default function Home() {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoapDrop | null>(null);
  const [error, setError] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Free up memory when the component is unmounted or the file is changed
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async () => {
    if (!isSignedIn || !imageFile) return;

    setLoading(true);
    setError('');

    try {
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });

      const response = await fetch('/api/poap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Environmental Report',
          description: 'Recognition for environmental contribution',
          city: 'Global',
          country: 'World',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          expiry_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          year: new Date().getFullYear(),
          event_url: 'https://your-app.com',
          image: base64Image,
          email: 'your-email@domain.com',
          requested_codes: 1,
        }),
      });

      const responseData = (await response.json()) as ApiResponse<PoapDrop>;

      if (!response.ok || responseData.error) {
        throw new Error(responseData.error?.message ?? 'Failed to create POAP');
      }

      if (responseData.data) {
        setResult(responseData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Ethereum Community Forum
      </h1>

      <div className="grid gap-6">
        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-600">
                Create a POAP
              </h2>
              <p className="mt-2 text-gray-600">
                Issue a POAP for your event or contribution
              </p>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {previewUrl && (
              <div className="mb-4">
                <Image
                  src={previewUrl}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating POAP...' : 'Create POAP'}
            </button>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            {result && (
              <div className="mt-4 rounded-md bg-green-100 p-4 text-green-800">
                POAP created!{' '}
                <a
                  href={`https://your-app.com/poap/${result.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  View POAP
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
