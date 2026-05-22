import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['cyrillic'] })

export const metadata: Metadata = {
  title: 'Барахолка | Покупка и продажа вещей',
  description: 'Платформа для продажи и покупки новых и бу вещей',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
