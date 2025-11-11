'use client';

import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-legends-blue-900 transition-colors duration-200 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/lba.webp"
            alt="Legends Basketball Association"
            width={120}
            height={120}
            className="h-24 w-auto"
            priority
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-legends-purple-600 via-legends-red-600 to-legends-blue-600 dark:from-legends-purple-400 dark:via-legends-red-400 dark:to-legends-blue-400 bg-clip-text text-transparent">
            Legends Basketball Association
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            Coming Soon
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-xl text-gray-600 dark:text-neutral-300">
            The premier competitive basketball league is preparing something amazing.
          </p>
          <p className="text-lg text-gray-500 dark:text-neutral-400">
            We're working hard to bring you the best basketball experience. Stay tuned for updates!
          </p>
        </div>

        {/* Decorative Element */}
        <div className="pt-8">
          <div className="text-6xl">🏀</div>
        </div>
      </div>

      {/* Subtle Login Link */}
      <div className="mt-auto mb-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors underline-offset-4 hover:underline">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <span className="text-xs text-gray-400 dark:text-neutral-500">
            Signed In
          </span>
        </SignedIn>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-gray-200 dark:border-legends-blue-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Legends Basketball Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

