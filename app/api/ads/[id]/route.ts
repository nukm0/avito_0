import { NextRequest, NextResponse } from 'next/server'
import { ads, updateAd, users } from '@/lib/storage'

// Получить объявление по ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ad = ads.find(a => a.id === params.id)
  
  if (!ad) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  const seller = users.find(u => u.id === ad.sellerId)
  if (seller?.banned) {
    return NextResponse.json({ error: 'Объявление скрыто' }, { status: 403 })
  }
  
  return NextResponse.json(ad)
}

// Обновить объявление
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.cookies.get('userId')?.value
  const ad = ads.find(a => a.id === params.id)
  
  if (!ad) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  if (userId !== ad.sellerId) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  updateAd(params.id, body)
  
  return NextResponse.json({ success: true })
}

// Удалить объявление
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.cookies.get('userId')?.value
  const adIndex = ads.findIndex(a => a.id === params.id)
  
  if (adIndex === -1) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  const ad = ads[adIndex]
  if (userId !== ad.sellerId) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  ads.splice(adIndex, 1)
  return NextResponse.json({ success: true })
}
