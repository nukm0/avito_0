import { NextRequest, NextResponse } from 'next/server'
import { users, reports, addReport, updateUser } from '@/lib/storage'

function hasAccess(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin')
}

export async function POST(req: NextRequest) {
  const adminId = req.cookies.get('userId')?.value
  
  if (!hasAccess(adminId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  const { userId, reason } = body
  
  const user = users.find(u => u.id === userId)
  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  }
  
  // Добавляем репорт
  const newReport = {
    id: Date.now().toString(),
    userId,
    reason,
    createdAt: new Date().toISOString(),
  }
  addReport(newReport)
  
  // Понижаем рейтинг
  updateUser(userId, { rating: Math.max(0, (user.rating || 0) - 1) })
  
  return NextResponse.json({ success: true })
}
