import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'בשכונה - המלצות על ספקים בשכונה',
  description: 'מצא ודרג ספקים מקומיים בשכונה שלך',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  )
}
