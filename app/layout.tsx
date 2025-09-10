import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AppLayout } from '@/components/layout/AppLayout';

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
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
            >
              Skip to main content
            </a>
            
            {/* Main App with Layout */}
            <div id="main-content">
              {children}
            </div>
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