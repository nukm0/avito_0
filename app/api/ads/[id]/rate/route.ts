import { NextRequest, NextResponse } from 'next/server'
import { ads, updateAd } from '@/lib/storage'

// Оценить объявление
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { rating } = body
  
  const ad = ads.find(a => a.id === params.id)
  if (!ad) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  // Обновляем рейтинг (среднее арифметическое)
  const newRating = Math.round(((ad.rating || 0) + rating) / 2)
  updateAd(params.id, { rating: newRating })
  
  return NextResponse.json({ success: true })
}
