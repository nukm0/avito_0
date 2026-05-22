'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import AdCard from '@/components/AdCard'
import Banner from '@/components/Banner'
import TelegramLogin from '@/components/TelegramLogin'
import { useAuth } from '@/lib/auth'

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

interface Banner {
  id: string
  title: string
  link: string
  active: boolean
}

export default function Home() {
  const { user, login, logout } = useAuth()
  const [ads, setAds] = useState<Ad[]>([])
  const [filteredAds, setFilteredAds] = useState<Ad[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Загрузка данных
  useEffect(() => {
    Promise.all([
      fetch('/api/ads').then(res => res.json()),
      fetch('/api/banners').then(res => res.json()),
    ]).then(([adsData, bannersData]) => {
      setAds(adsData)
      setFilteredAds(adsData)
      setBanners(bannersData)
      setLoading(false)
    }).catch(console.error)
  }, [])

  const handleSearch = (query: string, minPrice: number, maxPrice: number) => {
    const filtered = ads.filter(ad => {
      const matchesQuery = query === '' || 
        ad.title.toLowerCase().includes(query.toLowerCase()) ||
        ad.description.toLowerCase().includes(query.toLowerCase())
      const matchesPrice = ad.price >= minPrice && ad.price <= maxPrice
      return matchesQuery && matchesPrice
    })
    setFilteredAds(filtered)
  }

  const handleComplaint = async (adId: string) => {
    if (!user) {
      setShowLogin(true)
      return
    }
    const reason = prompt('Укажите причину жалобы:')
    if (reason) {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, reason, fromUserId: user.id }),
      })
      alert('Жалоба отправлена модератору')
    }
  }

  const handleTelegramAuth = async (telegramUser: any, phone: string) => {
    const success = await login(telegramUser, phone)
    if (success) {
      setShowLogin(false)
      window.location.reload()
    } else {
      alert('Ошибка входа. Проверьте номер телефона (+7)')
    }
  }

  if (loading) {
    return (
      <>
        <Header user={user} onLogin={() => setShowLogin(true)} onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500">Загрузка...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header user={user} onLogin={() => setShowLogin(true)} onLogout={logout} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Баннеры */}
        {banners.filter(b => b.active).map(banner => (
          <Banner key={banner.id} title={banner.title} link={banner.link} />
        ))}
        
        {/* Поиск */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Результаты */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            📦 Объявления ({filteredAds.length})
          </h2>
          {filteredAds.length === 0 && (
            <p className="text-gray-500">Ничего не найдено</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <AdCard key={ad.id} ad={ad} onComplaint={handleComplaint} />
          ))}
        </div>
      </main>
      
      {/* Модалка входа */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Вход через Telegram</h2>
              <p className="text-gray-500 mt-2">Только для номеров РФ (+7)</p>
            </div>
            <TelegramLogin onAuth={handleTelegramAuth} />
            <button 
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}
