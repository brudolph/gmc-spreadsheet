import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ApolloWrapper } from '@/lib/apollo-provider';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Green Mountain Wholesale',
  description: 'Wholesale cannabis product ordering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <ApolloWrapper>
          <CartProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          </CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
