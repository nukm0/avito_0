import { NextRequest, NextResponse } from 'next/server'
import { users, updateUser } from '@/lib/storage'

function hasAccess(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin' || user.role === 'moderator')
}

export async function POST(req: NextRequest) {
  const adminId = req.cookies.get('userId')?.value
  
  if (!hasAccess(adminId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  const { userId, ban } = body
  
  const user = users.find(u => u.id === userId)
  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  }
  
  // Нельзя забанить владельца
  if (user.role === 'owner') {
    return NextResponse.json({ error: 'Нельзя забанить владельца' }, { status: 403 })
  }
  
  updateUser(userId, { banned: ban })
  
  return NextResponse.json({ success: true })
}
