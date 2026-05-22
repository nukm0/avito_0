import { NextRequest, NextResponse } from 'next/server'
import { users, updateUser } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const adminId = req.cookies.get('userId')?.value
  const admin = users.find(u => u.id === adminId)
  
  // Только владелец может менять роли
  if (!admin || admin.role !== 'owner') {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  const { userId, role } = body
  
  const user = users.find(u => u.id === userId)
  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  }
  
  // Нельзя изменить роль владельца
  if (user.role === 'owner') {
    return NextResponse.json({ error: 'Нельзя изменить роль владельца' }, { status: 403 })
  }
  
  updateUser(userId, { role })
  
  return NextResponse.json({ success: true })
}
