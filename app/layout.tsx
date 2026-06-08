import './globals.css';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/bottom-nav';
import { LanguageProvider } from '@/context/LanguageContext';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LEDGER — Know Your Finance',
  description: 'Compare 100+ Indian financial products anonymously — loans, deposits, and welfare schemes at your fingertips.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LEDGER',
  },
  openGraph: {
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#070A12" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LEDGER" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-body bg-[#070A12] min-h-screen`}>
        <LanguageProvider>
          <div className="relative flex flex-col min-h-screen max-w-md mx-auto">
            <main className="flex-1 overflow-y-auto scrollbar-hidden pb-24">
              {children}
            </main>
            <BottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
