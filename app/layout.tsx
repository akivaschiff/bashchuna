import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'בשכונה - המלצות על ספקים בגבעות עדן',
  description: 'מצא ודרג ספקים מקומיים בגבעות עדן - פלטפורמה לשיתוף המלצות על בעלי מקצוע ושירותים בשכונה',
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
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className="font-sans bg-neutral-50 min-h-screen">
        <Header />
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
      </body>
    </html>
  )
}
