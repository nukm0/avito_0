import { NextRequest, NextResponse } from 'next/server'
import { banners, addBanner, users } from '@/lib/storage'

// Получить активные баннеры
export async function GET() {
  const activeBanners = banners.filter(b => b.active)
  return NextResponse.json(activeBanners)
}

// Создать баннер (только для админов)
export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  const user = users.find(u => u.id === userId)
  
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  const { title, link } = body
  
  const newBanner = {
    id: Date.now().toString(),
    title,
    link,
    active: true,
  }
  
  addBanner(newBanner)
  return NextResponse.json(newBanner, { status: 201 })
}
