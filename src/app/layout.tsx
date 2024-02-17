import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

import ModalProvider from '@/providers/modal-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme-providers';

import './globals.css';
//import '@/utils/vlc-bookmark-builder';

const font = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plura',
  description: 'All in one Agency Solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='scrollbar-thumb-rounded-full scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50 scrollbar-track-primary/10'
      suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <ModalProvider>
            {children}

            <Toaster />

            <SonnerToaster position='bottom-left' />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
