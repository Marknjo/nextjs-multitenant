import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-providers';
//import '@/utils/vlc-bookmark-builder';

const font = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
