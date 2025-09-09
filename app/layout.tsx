import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ContextViber - AI Context Management Tool',
  description: 'Smart context management solution for developers working with AI assistants. Generate optimized context packages, file trees, and documentation.',
  keywords: 'AI, context management, developer tools, ChatGPT, Claude, Cursor, file tree, token counter',
  authors: [{ name: 'ContextViber Team' }],
  creator: 'ContextViber',
  publisher: 'ContextViber',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contextviber.com',
    siteName: 'ContextViber',
    title: 'ContextViber - AI Context Management Tool',
    description: 'Smart context management solution for developers working with AI assistants',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ContextViber',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContextViber - AI Context Management Tool',
    description: 'Smart context management solution for developers working with AI assistants',
    images: ['/twitter-image.png'],
    creator: '@contextviber',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Skip to main content
            </a>
            
            {/* Main content */}
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            
            {/* Footer (optional) */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-gray-600 text-sm">
                      © 2025 ContextViber. All rights reserved.
                    </p>
                  </div>
                  <div className="flex space-x-6">
                    <a
                      href="/privacy"
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="/docs"
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                    >
                      Documentation
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </ErrorBoundary>
        
        {/* Development mode indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-mono z-50">
            DEV MODE
          </div>
        )}
      </body>
    </html>
  );
}