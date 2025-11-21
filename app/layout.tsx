import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from './providers'
import Layout from '@/components/Layout'
import '../src/styles/index.css'
import '../src/styles/theme.css'

export const metadata: Metadata = {
  title: 'Legends Basketball Association',
  description: 'The premier competitive basketball league',
  icons: {
    icon: '/lba.webp',
    apple: '/lba.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                    const root = document.documentElement;
                    if (theme === 'dark') {
                      root.classList.add('dark');
                    } else {
                      root.classList.remove('dark');
                    }
                    root.setAttribute('data-theme', theme);
                  } catch (e) {
                    console.error('Theme initialization error:', e);
                  }
                })();
              `,
            }}
          />
          <script
            src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
            async
            defer
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function hideWidget() {
                    // Hide widget if it exists on coming-soon page
                    const widgetContainer = document.querySelector('[data-widgetbot]') || 
                                           document.querySelector('#crate-widget') ||
                                           document.querySelector('.crate-widget');
                    if (widgetContainer) {
                      widgetContainer.style.display = 'none';
                    }
                  }
                  
                  function initCrate() {
                    // Don't show widget on coming-soon page
                    if (typeof window !== 'undefined' && window.location.pathname === '/coming-soon') {
                      hideWidget();
                      return;
                    }
                    if (typeof window !== 'undefined' && window.Crate) {
                      new window.Crate({
                        server: '1437888883177291818', // Legends Basketball Association
                        channel: '1437909389099929654' // #free-agent-chat
                      });
                    } else {
                      setTimeout(initCrate, 100);
                    }
                  }
                  
                  // Check pathname on initial load
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                      if (window.location.pathname === '/coming-soon') {
                        hideWidget();
                      } else {
                        initCrate();
                      }
                    });
                  } else {
                    if (window.location.pathname === '/coming-soon') {
                      hideWidget();
                    } else {
                      initCrate();
                    }
                  }
                  
                  // Listen for route changes (Next.js navigation)
                  if (typeof window !== 'undefined') {
                    const originalPushState = history.pushState;
                    history.pushState = function() {
                      originalPushState.apply(history, arguments);
                      if (window.location.pathname === '/coming-soon') {
                        hideWidget();
                      }
                    };
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="bg-theme-primary text-theme-primary transition-colors duration-200">
          <Providers>
            <Layout>
              {children}
            </Layout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

