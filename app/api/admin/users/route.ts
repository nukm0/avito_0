import { NextRequest, NextResponse } from 'next/server'
import { users, ads } from '@/lib/storage'

// Проверка прав админа
function isAdmin(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin' || user.role === 'moderator')
}

// Получить всех пользователей (только для админов)
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  
  if (!isAdmin(userId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  // Возвращаем всех пользователей без паролей
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    phone: u.phone,
    role: u.role,
    banned: u.banned,
    rating: u.rating,
    createdAt: u.createdAt,
  }))
  
  return NextResponse.json(safeUsers)
}
