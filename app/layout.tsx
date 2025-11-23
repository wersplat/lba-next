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
                    // Get saved theme preference or fall back to system preference
                    const savedTheme = localStorage.getItem('theme');
                    let theme = 'light';
                    
                    if (savedTheme === 'light' || savedTheme === 'dark') {
                      theme = savedTheme;
                    } else {
                      // Use system preference only if no saved preference exists
                      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    
                    // Apply theme immediately to prevent flash of unstyled content
                    const root = document.documentElement;
                    if (theme === 'dark') {
                      root.classList.add('dark');
                    } else {
                      root.classList.remove('dark');
                    }
                    root.setAttribute('data-theme', theme);
                    
                    // Store the resolved theme for React hydration
                    if (!savedTheme) {
                      localStorage.setItem('theme', theme);
                    }
                  } catch (e) {
                    // Silently fail - default to light mode
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="bg-theme-primary text-theme-primary">
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

