import { NextRequest, NextResponse } from 'next/server'
import { users, updateUser } from '@/lib/storage'

// Вход через Telegram
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, first_name, username, phone } = body
    
    // Проверка номера телефона (только Россия)
    if (!phone || !phone.startsWith('+7')) {
      return NextResponse.json({ error: 'Разрешены только российские номера (+7)' }, { status: 403 })
    }
    
    // Ищем пользователя
    let user = users.find(u => u.id === id.toString())
    
    if (!user) {
      // Регистрация нового пользователя
      const newUser = {
        id: id.toString(),
        name: first_name,
        username: username || `user_${id}`,
        phone: phone,
        role: 'user' as const,
        banned: false,
        rating: 0,
        historyViews: [],
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      user = newUser
    }
    
    // Проверка бана
    if (user.banned) {
      return NextResponse.json({ error: 'Ваш аккаунт заблокирован' }, { status: 403 })
    }
    
    // Создаем сессию
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        role: user.role,
        rating: user.rating,
      }
    })
    
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}

// Проверка сессии
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  
  if (!userId) {
    return NextResponse.json({ user: null })
  }
  
  const user = users.find(u => u.id === userId)
  
  if (!user || user.banned) {
    return NextResponse.json({ user: null })
  }
  
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      role: user.role,
      rating: user.rating,
    }
  })
}

// Выход
export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('userId')
  return response
}
