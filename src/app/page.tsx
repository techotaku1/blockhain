'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useUser, SignInButton } from '@clerk/nextjs';

import type { PoapDrop, ApiResponse } from '~/lib/poap/types';

export default function Home() {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoapDrop | null>(null);
  const [error, setError] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      event.preventDefault();
      return;
    }

    const file = event.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
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
        throw new Error(
          typeof responseData.error === 'string'
            ? responseData.error
            : 'Failed to create POAP'
        );
      }

      if (responseData.data) {
        setResult(responseData.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Move file input outside of form to prevent native browser upload
  const FileUploadArea = () => (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="file-upload"
        disabled={!isSignedIn}
      />
      <label
        htmlFor="file-upload"
        className={`flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          !isSignedIn
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <svg
          className={`mb-3 h-10 w-10 ${
            !isSignedIn ? 'text-gray-300' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {!isSignedIn ? (
          <>
            <p className="mb-2 text-sm font-semibold text-gray-400">
              Sign in required
            </p>
            <p className="text-xs text-gray-400">
              Please sign in to upload images and create POAPs
            </p>
            <SignInButton>
              <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Sign In to Continue
              </button>
            </SignInButton>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Click to upload image
            </p>
            <p className="text-xs text-gray-500">PNG or JPG (MAX. 800x800px)</p>
          </>
        )}
      </label>
    </div>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Environmental Reports
        </h1>

        {!isSignedIn ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              🌟 Create Your Environmental POAP
            </h2>
            <p className="mb-6 text-gray-600">
              Sign in to start creating POAPs for your environmental
              contributions
            </p>
            <SignInButton>
              <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-600">
                Create a POAP
              </h2>
              <p className="mt-2 text-gray-600">
                Issue a POAP for your environmental contribution
              </p>
            </div>

            <div className="space-y-6">
              <FileUploadArea />

              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !imageFile || !isSignedIn}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {!isSignedIn
                  ? 'Sign in to Create POAP'
                  : loading
                    ? 'Creating POAP...'
                    : 'Create POAP'}
              </button>

              {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
              )}
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
        )}
      </div>
    </main>
  );
}
