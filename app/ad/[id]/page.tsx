'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAdById, purchaseAd } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export default function AdPage() {
  const { id } = useParams()
  const [ad, setAd] = useState<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    getAdById(id as string).then(setAd)
  }, [id])

  if (!ad) return <div className="text-center py-20">Загрузка...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-96 bg-gray-200">
            <img src={ad[4]} alt={ad[1]} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{ad[1]}</h1>
            <p className="text-gray-600 mb-4">{ad[2]}</p>
            <p className="text-3xl font-bold text-green-600 mb-6">{ad[3]} ₽</p>
            
            <div className="space-y-3 mb-6">
              <p><strong>Продавец:</strong> {ad[6]}</p>
              <p><strong>Рейтинг:</strong> ⭐ {ad[8] || 0}</p>
              <p><strong>Просмотров:</strong> 👁️ {ad[9] || 0}</p>
            </div>

            <button
              onClick={() => purchaseAd(ad[0], user?.id)}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Приобрести товар
            </button>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50">
                👍 Оценить
              </button>
              <button className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                📋 Пожаловаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
