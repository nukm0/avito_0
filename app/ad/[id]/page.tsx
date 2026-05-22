'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'
import { Eye, ThumbsUp, AlertTriangle, ShoppingBag, ArrowLeft } from 'lucide-react'

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

export default function AdPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    fetch(`/api/ads/${id}`)
      .then(res => res.json())
      .then(data => {
        setAd(data)
        setLoading(false)
        // Отмечаем просмотр
        if (user) {
          fetch(`/api/ads/${id}/view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          })
        }
      })
      .catch(console.error)
  }, [id, user])

  const handleRate = async (value: number) => {
    if (!user) {
      alert('Войдите чтобы оценить')
      return
    }
    setRating(value)
    await fetch(`/api/ads/${id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: value, userId: user.id }),
    })
    alert('Спасибо за оценку!')
  }

  const handleComplaint = async () => {
    if (!user) {
      alert('Войдите чтобы пожаловаться')
      return
    }
    const reason = prompt('Укажите причину жалобы:')
    if (reason) {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: id, reason, fromUserId: user.id }),
      })
      alert('Жалоба отправлена модератору')
    }
  }

  const handlePurchase = () => {
    if (!user) {
      alert('Войдите чтобы приобрести товар')
      return
    }
    // Переход на профиль продавца
    router.push(`/profile/${ad?.sellerId}`)
  }

  if (loading) {
    return (
      <>
        <Header user={user} onLogin={() => {}} onLogout={logout} />
        <div className="text-center py-20">Загрузка...</div>
      </>
    )
  }

  if (!ad) {
    return (
      <>
        <Header user={user} onLogin={() => {}} onLogout={logout} />
        <div className="text-center py-20">Объявление не найдено</div>
      </>
    )
  }

  return (
    <>
      <Header user={user} onLogin={() => {}} onLogout={logout} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={20} /> Назад
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Фото */}
            <div className="md:w-1/2 h-96 bg-gray-100">
              {ad.imageUrl ? (
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Нет фото
                </div>
              )}
            </div>
            
            {/* Информация */}
            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
              <p className="text-gray-500 text-sm mb-4">Продавец: {ad.sellerName}</p>
              <p className="text-3xl font-bold text-green-600 mb-4">{ad.price.toLocaleString()} ₽</p>
              
              <div className="flex gap-4 mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye size={16} /> {ad.views || 0} просмотров</span>
                <span className="flex items-center gap-1"><ThumbsUp size={16} /> {ad.rating || 0} оценок</span>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold mb-2">Описание:</h3>
                <p className="text-gray-700">{ad.description}</p>
              </div>
              
              {/* Кнопки действий */}
              <div className="space-y-3">
                <button 
                  onClick={handlePurchase}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <ShoppingBag size={20} /> Приобрести товар
                </button>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRate(5)}
                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1"
                  >
                    <ThumbsUp size={16} /> Оценить
                  </button>
                  <button 
                    onClick={handleComplaint}
                    className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1"
                  >
                    <AlertTriangle size={16} /> Пожаловаться
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
