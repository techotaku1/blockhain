'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useUser } from '@clerk/nextjs';

import type { PoapDrop, PoapDropInput } from '~/lib/poap/types';

export default function PoapTestPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoapDrop | null>(null);
  const [error, setError] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleTest = async () => {
    if (!isSignedIn || !imageFile) return;

    setLoading(true);
    setError('');

    try {
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });

      const dropInput: PoapDropInput = {
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
      };

      const response = await fetch('/api/poap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dropInput),
      });

      if (!response.ok) {
        throw new Error('Failed to create POAP');
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-8">
            <h1 className="mb-8 text-center text-3xl font-bold">
              Create Environmental Report POAP
            </h1>

            {!isSignedIn ? (
              <div className="rounded-lg bg-yellow-50 p-6 text-center">
                <p className="text-yellow-700">
                  Please sign in to create a POAP
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block cursor-pointer"
                  >
                    {previewUrl ? (
                      <div className="relative mx-auto h-48 w-48">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        Click to upload image (500x500px recommended)
                      </div>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleTest}
                  disabled={loading || !imageFile}
                  className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? 'Creating POAP...' : 'Create POAP'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error occurred
                    </h3>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 overflow-hidden rounded-lg bg-green-50">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-green-800">
                      {result.name}
                    </h2>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      ID: {result.id}
                    </span>
                  </div>

                  {result.image_url && (
                    <div className="mb-4">
                      <div className="relative mx-auto h-32 w-32">
                        <Image
                          src={result.image_url}
                          alt={result.name}
                          fill
                          className="rounded-full object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <p className="text-gray-700">{result.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium">{result.start_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium">{result.end_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Year</p>
                        <p className="font-medium">{result.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Virtual Event</p>
                        <p className="font-medium">
                          {result.virtual_event ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
