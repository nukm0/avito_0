import { NextRequest, NextResponse } from 'next/server'
import { ads } from '@/lib/storage'

// Получить объявления пользователя
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userAds = ads.filter(ad => ad.sellerId === params.id)
  return NextResponse.json(userAds)
}
