import { NextRequest, NextResponse } from 'next/server'
import { ads, addAd, users } from '@/lib/storage'

// Получить все объявления
export async function GET() {
  // Показываем только не забаненных продавцов
  const activeAds = ads.filter(ad => {
    const seller = users.find(u => u.id === ad.sellerId)
    return seller && !seller.banned
  })
  return NextResponse.json(activeAds)
}

// Создать объявление
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, price, imageUrl, sellerId, sellerName } = body
    
    // Проверяем авторизацию через cookie
    const userId = req.cookies.get('userId')?.value
    if (!userId || userId !== sellerId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    const user = users.find(u => u.id === sellerId)
    if (user?.banned) {
      return NextResponse.json({ error: 'Ваш аккаунт заблокирован' }, { status: 403 })
    }
    
    const newAd = {
      id: Date.now().toString(),
      title,
      description,
      price: Number(price),
      imageUrl: imageUrl || '',
      sellerId,
      sellerName,
      createdAt: new Date().toISOString(),
      views: 0,
      rating: 0,
      complaints: 0,
    }
    
    addAd(newAd)
    return NextResponse.json(newAd, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка создания' }, { status: 500 })
  }
}
