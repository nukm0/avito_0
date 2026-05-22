'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import AdCard from '@/components/AdCard'
import { useAuth } from '@/lib/auth'
import { Package, Eye, Star, Clock } from 'lucide-react'

interface Ad {
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

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [myAds, setMyAds] = useState<Ad[]>([])
  const [historyAds, setHistoryAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    Promise.all([
      fetch(`/api/users/${user.id}/ads`).then(res => res.json()),
      fetch(`/api/users/${user.id}/history`).then(res => res.json()),
    ]).then(([myAdsData, historyData]) => {
      setMyAds(myAdsData)
      setHistoryAds(historyData)
      setLoading(false)
    }).catch(console.error)
  }, [user, router])

  if (!user) return null

  if (loading) {
    return (
      <>
        <Header user={user} onLogin={() => {}} onLogout={logout} />
        <div className="text-center py-20">Загрузка...</div>
      </>
    )
  }

  return (
    <>
      <Header user={user} onLogin={() => {}} onLogout={logout} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Статистика профиля */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="opacity-90 mt-1">@{user.username}</p>
              <p className="text-sm mt-2">📞 {user.phone}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <Star className="inline-block mb-1" size={24} />
              <p className="text-2xl font-bold">{user.rating || 0}</p>
              <p className="text-xs opacity-90">Рейтинг</p>
            </div>
          </div>
        </div>
        
        {/* Карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Package className="text-blue-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{myAds.length}</p>
            <p className="text-gray-500">Моих объявлений</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Eye className="text-green-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{myAds.reduce((sum, ad) => sum + (ad.views || 0), 0)}</p>
            <p className="text-gray-500">Всего просмотров</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Clock className="text-purple-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{historyAds.length}</p>
            <p className="text-gray-500">История просмотров</p>
          </div>
        </div>
        
        {/* Мои объявления */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package size={20} /> Мои объявления
          </h2>
          {myAds.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              У вас пока нет объявлений
              <button 
                onClick={() => router.push('/create-ad')}
                className="block mx-auto mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Создать объявление
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </div>
        
        {/* История просмотров */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Eye size={20} /> История просмотренных объявлений
          </h2>
          {historyAds.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              Вы еще не просматривали объявления
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
