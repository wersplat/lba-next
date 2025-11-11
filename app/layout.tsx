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
        </head>
        <body className="bg-white dark:bg-legends-blue-900 transition-colors duration-200">
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

