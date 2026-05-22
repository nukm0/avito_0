'use client'

import Link from 'next/link'
import { Eye, ThumbsUp, AlertTriangle } from 'lucide-react'

interface AdCardProps {
  ad: {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string
    sellerId: string
    sellerName: string
    views: number
    rating: number
  }
  onComplaint?: (adId: string) => void
}

export default function AdCard({ ad, onComplaint }: AdCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 bg-gray-200 relative">
        {ad.imageUrl ? (
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            Нет фото
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{ad.title}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{ad.description}</p>
        <p className="text-2xl font-bold text-green-600 mb-3">{ad.price.toLocaleString()} ₽</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Eye size={14} /> {ad.views || 0}</span>
          <span className="flex items-center gap-1"><ThumbsUp size={14} /> {ad.rating || 0}</span>
          <span className="text-gray-400">👤 {ad.sellerName}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/ad/${ad.id}`} className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Подробнее
          </Link>
          <button 
            onClick={() => onComplaint?.(ad.id)}
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
            title="Пожаловаться"
          >
            <AlertTriangle size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
