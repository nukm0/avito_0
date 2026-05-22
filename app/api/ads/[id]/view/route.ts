import { NextRequest, NextResponse } from 'next/server'
import { ads, updateAd, users, updateUser } from '@/lib/storage'

// Отметить просмотр объявления
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { userId } = body
  
  const ad = ads.find(a => a.id === params.id)
  if (!ad) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  // Увеличиваем счетчик просмотров
  updateAd(params.id, { views: (ad.views || 0) + 1 })
  
  // Добавляем в историю пользователя
  if (userId) {
    const user = users.find(u => u.id === userId)
    if (user && !user.historyViews.includes(params.id)) {
      updateUser(userId, { 
        historyViews: [...user.historyViews, params.id] 
      })
    }
  }
  
  return NextResponse.json({ success: true })
}
