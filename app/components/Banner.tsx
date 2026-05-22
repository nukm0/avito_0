'use client'

import Link from 'next/link'

interface BannerProps {
  title: string
  link: string
}

export default function Banner({ title, link }: BannerProps) {
  return (
    <Link href={link} target="_blank">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 rounded-xl mb-6 hover:opacity-90 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg">
        <h3 className="text-xl font-bold text-center">{title}</h3>
        <p className="text-center text-sm mt-2 opacity-90">Нажмите для перехода →</p>
      </div>
    </Link>
  )
}
