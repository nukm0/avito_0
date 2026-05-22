'use client'

import { useAuth } from '@/lib/auth'
import { useState, useEffect } from 'react'
import { getUserAds, getUserHistory } from '@/lib/api'
import AdCard from '@/components/AdCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [myAds, setMyAds] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (user) {
      getUserAds(user.id).then(setMyAds)
      getUserHistory(user.id).then(setHistory)
    }
  }, [user])

  if (!user) {
    return <div className="text-center py-20">Войдите через Telegram</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{user.first_name}</h1>
        <p className="text-gray-600">ID: {user.id}</p>
        <p className="text-gray-600">Рейтинг: ⭐ {user.rating || 0}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Мои объявления</h2>
          <div className="space-y-4">
            {myAds.map((ad: any) => (
              <AdCard key={ad[0]} ad={ad} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">История просмотров</h2>
          <div className="space-y-4">
            {history.map((ad: any) => (
              <AdCard key={ad[0]} ad={ad} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
