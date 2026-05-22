'use client'

import Link from 'next/link'
import { Eye, ThumbsUp, AlertTriangle } from 'lucide-react'

export default function AdCard({ ad }: { ad: any }) {
  const [id, title, description, price, imageUrl, sellerId, sellerName, createdAt, rating, views] = ad

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <p className="text-2xl font-bold text-green-600 mb-3">{price} ₽</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Eye size={16} /> {views || 0}</span>
          <span className="flex items-center gap-1"><ThumbsUp size={16} /> {rating || 0}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/ad/${id}`} className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Подробнее
          </Link>
          <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
            <AlertTriangle size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
