'use client'

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankingsDropdownOpen, setRankingsDropdownOpen] = useState(false);
  const [matchesDropdownOpen, setMatchesDropdownOpen] = useState(false);
  const [draftDropdownOpen, setDraftDropdownOpen] = useState(false);

  // Don't render layout for coming-soon page
  if (pathname === '/coming-soon') {
    return <>{children}</>;
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/rules', label: 'Rules' },
    { path: '/rankings', label: 'Rankings' },
    { path: '/matches', label: 'Matches' },
    { path: '/standings', label: 'Standings' },
    { path: '/teams', label: 'Teams' },
    { path: '/statistics', label: 'Statistics' },
    { path: '/media', label: 'Media' },
    { path: '/draft', label: 'Draft' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const isMatchesActive = () => {
    return pathname === '/matches' || pathname === '/matches/combine';
  };

  const isDraftActive = () => {
    return pathname === '/draft-board' || pathname === '/draft-pool' || pathname === '/draft';
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary transition-colors duration-200">
      <header className="bg-theme-primary/95 backdrop-blur-md border-b border-theme sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo/Title */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 min-w-0" aria-label="Legends Basketball Association Home">
              <Image
                src="/lba.webp"
                alt="Legends Basketball Association"
                width={48}
                height={48}
                className="h-12 w-auto flex-shrink-0"
                priority
              />
              <span className="text-lg font-bold bg-gradient-to-r from-legends-purple-600 via-legends-red-600 to-legends-blue-600 dark:from-legends-purple-400 dark:via-legends-red-400 dark:to-legends-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                <span className="lg:hidden">LBA</span>
                <span className="hidden lg:inline">Legends Basketball Association</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 flex-shrink-0 ml-4">
              <SignedIn>
                <ul className="flex items-center gap-2 text-sm" role="list">
                  {navItems.map((item) => {
                    // Special handling for Rankings dropdown
                    if (item.path === '/rankings') {
                      return (
                        <li key={item.path} role="none" className="relative"
                            onMouseEnter={() => setRankingsDropdownOpen(true)}
                            onMouseLeave={() => setRankingsDropdownOpen(false)}>
                          <button
                            className={`px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white whitespace-nowrap flex items-center gap-1 ${
                              isActive(item.path)
                                ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold underline'
                                : 'text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                            }`}
                            aria-expanded={rankingsDropdownOpen}
                            aria-haspopup="true"
                          >
                            {item.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {rankingsDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-theme-primary border border-theme rounded-md shadow-lg py-1 min-w-[160px] z-50">
                              <Link
                                href="/rankings"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/rankings'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setRankingsDropdownOpen(false)}
                              >
                                Player Rankings
                              </Link>
                              <Link
                                href="/rankings/gm"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/rankings/gm'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setRankingsDropdownOpen(false)}
                              >
                                GM Rankings
                              </Link>
                            </div>
                          )}
                        </li>
                      );
                    }
                    // Special handling for Matches dropdown
                    if (item.path === '/matches') {
                      return (
                        <li key={item.path} role="none" className="relative"
                            onMouseEnter={() => setMatchesDropdownOpen(true)}
                            onMouseLeave={() => setMatchesDropdownOpen(false)}>
                          <button
                            className={`px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white whitespace-nowrap flex items-center gap-1 ${
                              isMatchesActive()
                                ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold underline'
                                : 'text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                            }`}
                            aria-expanded={matchesDropdownOpen}
                            aria-haspopup="true"
                          >
                            {item.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {matchesDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-theme-primary border border-theme rounded-md shadow-lg py-1 min-w-[160px] z-50">
                              <Link
                                href="/matches"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/matches'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setMatchesDropdownOpen(false)}
                              >
                                League Matches
                              </Link>
                              <Link
                                href="/matches/combine"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/matches/combine'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setMatchesDropdownOpen(false)}
                              >
                                Combine Matches
                              </Link>
                            </div>
                          )}
                        </li>
                      );
                    }
                    // Special handling for Draft dropdown
                    if (item.path === '/draft') {
                      return (
                        <li key={item.path} role="none" className="relative"
                            onMouseEnter={() => setDraftDropdownOpen(true)}
                            onMouseLeave={() => setDraftDropdownOpen(false)}>
                          <button
                            className={`px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white whitespace-nowrap flex items-center gap-1 ${
                              isDraftActive()
                                ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold underline'
                                : 'text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                            }`}
                            aria-expanded={draftDropdownOpen}
                            aria-haspopup="true"
                          >
                            {item.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {draftDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-theme-primary border border-theme rounded-md shadow-lg py-1 min-w-[160px] z-50">
                              <Link
                                href="/draft-board"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/draft-board'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setDraftDropdownOpen(false)}
                              >
                                Draft Board
                              </Link>
                              <Link
                                href="/draft-pool"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/draft-pool'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setDraftDropdownOpen(false)}
                              >
                                Draft Pool
                              </Link>
                              <Link
                                href="/draft"
                                className={`block px-3 py-2 text-sm transition ${
                                  pathname === '/draft'
                                    ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                    : 'text-theme-primary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                                }`}
                                onClick={() => setDraftDropdownOpen(false)}
                              >
                                Live Draft
                              </Link>
                            </div>
                          )}
                        </li>
                      );
                    }
                    // Regular navigation items
                    return (
                      <li key={item.path} role="none">
                        <Link
                          href={item.path}
                          className={`px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white whitespace-nowrap ${
                            isActive(item.path)
                              ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold underline'
                              : 'text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
                          }`}
                          aria-current={isActive(item.path) ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </SignedIn>
              
              {/* Auth Section */}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-theme">
                <ThemeToggle />
                <SignedOut>
                  <SignInButton mode="modal">
                    <span className="px-3 py-1 text-sm text-legends-purple-600 dark:text-legends-purple-400 hover:text-legends-purple-800 dark:hover:text-legends-purple-300 transition-colors cursor-pointer">
                      Sign In
                    </span>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <span className="px-3 py-1 text-sm text-legends-purple-600 dark:text-legends-purple-400 hover:text-legends-purple-800 dark:hover:text-legends-purple-300 transition-colors cursor-pointer">
                      Sign Up
                    </span>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <span className="px-3 py-1 text-sm text-legends-purple-600 dark:text-legends-purple-400 mr-2 cursor-pointer">
                    Sign In
                  </span>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <button
                id="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-theme-primary hover:text-gray-900 dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white rounded p-1"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="lg:hidden mt-4 pb-2" role="menu">
              <SignedIn>
                <ul className="space-y-1" role="list">
                  {navItems.map((item) => {
                    // Special handling for Rankings dropdown on mobile
                    if (item.path === '/rankings') {
                      return (
                        <li key={item.path} role="none">
                          <button
                            onClick={() => setRankingsDropdownOpen(!rankingsDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded bg-theme-hover text-theme-primary focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white"
                            aria-expanded={rankingsDropdownOpen}
                            aria-haspopup="true"
                          >
                            <span className={isActive(item.path) ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold' : ''}>
                              {item.label}
                            </span>
                            <svg className={`w-4 h-4 transition-transform ${rankingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {rankingsDropdownOpen && (
                            <ul className="mt-1 space-y-1 pl-4" role="list">
                              <li role="none">
                                <Link
                                  href="/rankings"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setRankingsDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/rankings'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  Player Rankings
                                </Link>
                              </li>
                              <li role="none">
                                <Link
                                  href="/rankings/gm"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setRankingsDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/rankings/gm'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  GM Rankings
                                </Link>
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    }
                    // Special handling for Matches dropdown on mobile
                    if (item.path === '/matches') {
                      return (
                        <li key={item.path} role="none">
                          <button
                            onClick={() => setMatchesDropdownOpen(!matchesDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded bg-theme-hover text-theme-primary focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white"
                            aria-expanded={matchesDropdownOpen}
                            aria-haspopup="true"
                          >
                            <span className={isMatchesActive() ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold' : ''}>
                              {item.label}
                            </span>
                            <svg className={`w-4 h-4 transition-transform ${matchesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {matchesDropdownOpen && (
                            <ul className="mt-1 space-y-1 pl-4" role="list">
                              <li role="none">
                                <Link
                                  href="/matches"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMatchesDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/matches'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  League Matches
                                </Link>
                              </li>
                              <li role="none">
                                <Link
                                  href="/matches/combine"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMatchesDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/matches/combine'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  Combine Matches
                                </Link>
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    }
                    // Special handling for Draft dropdown on mobile
                    if (item.path === '/draft') {
                      return (
                        <li key={item.path} role="none">
                          <button
                            onClick={() => setDraftDropdownOpen(!draftDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded bg-theme-hover text-theme-primary focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white"
                            aria-expanded={draftDropdownOpen}
                            aria-haspopup="true"
                          >
                            <span className={isDraftActive() ? 'text-legends-purple-600 dark:text-legends-purple-400 font-semibold' : ''}>
                              {item.label}
                            </span>
                            <svg className={`w-4 h-4 transition-transform ${draftDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {draftDropdownOpen && (
                            <ul className="mt-1 space-y-1 pl-4" role="list">
                              <li role="none">
                                <Link
                                  href="/draft-board"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setDraftDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/draft-board'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  Draft Board
                                </Link>
                              </li>
                              <li role="none">
                                <Link
                                  href="/draft-pool"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setDraftDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/draft-pool'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  Draft Pool
                                </Link>
                              </li>
                              <li role="none">
                                <Link
                                  href="/draft"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setDraftDropdownOpen(false);
                                  }}
                                  className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                                    pathname === '/draft'
                                      ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400 font-semibold'
                                      : 'text-theme-primary'
                                  }`}
                                  role="menuitem"
                                >
                                  Live Draft
                                </Link>
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    }
                    // Regular navigation items
                    return (
                      <li key={item.path} role="none">
                        <Link
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-label={`Navigate to ${item.label} page`}
                          className={`block px-3 py-2 rounded bg-theme-hover focus:outline-none focus:ring-2 focus:ring-legends-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-white ${
                            isActive(item.path)
                              ? 'bg-theme-tertiary text-legends-purple-600 dark:text-legends-purple-400'
                              : 'text-theme-primary'
                          }`}
                          aria-current={isActive(item.path) ? 'page' : undefined}
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </SignedIn>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow bg-theme-primary transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      <footer className="bg-theme-primary border-t border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-theme-secondary">
            &copy; {new Date().getFullYear()} Legends Basketball Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
