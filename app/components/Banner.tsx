'use client'

import Link from 'next/link'

export default function Banner({ title, link }: { title: string; link: string }) {
  return (
    <Link href={link} target="_blank">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl mb-6 hover:opacity-90 transition cursor-pointer">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
    </Link>
  )
}
