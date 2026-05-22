import { NextRequest, NextResponse } from 'next/server'
import { users, ads } from '@/lib/storage'

// Получить историю просмотров пользователя
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = users.find(u => u.id === params.id)
  
  if (!user) {
    return NextResponse.json([])
  }
  
  const historyAds = ads.filter(ad => user.historyViews.includes(ad.id))
  return NextResponse.json(historyAds)
}
