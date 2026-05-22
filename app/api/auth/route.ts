import { NextRequest, NextResponse } from 'next/server'
import { getSheetData, appendToSheet } from '@/lib/googleSheets'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { id, first_name, username, auth_date, hash, phone } = data

  // Проверка Telegram hash (пропустим для краткости, в реальности нужно)
  
  // Проверка номера телефона (только Россия)
  if (!phone || !phone.startsWith('+7')) {
    return NextResponse.json({ error: 'Разрешены только российские номера (+7)' }, { status: 403 })
  }

  // Получаем всех пользователей
  const users = await getSheetData('users')
  const existingUser = users.find((user: any) => user.id === id.toString())

  if (!existingUser) {
    // Регистрация нового пользователя
    await appendToSheet('users', [
      id.toString(),
      first_name,
      username || '',
      phone,
      new Date().toISOString(),
      'user', // роль: user, moderator, admin
      0, // рейтинг
      '[]' // история просмотров
    ])
  }

  // Создаем сессию
  const sessionToken = Buffer.from(`${id}:${Date.now()}`).toString('base64')
  
  const response = NextResponse.json({ success: true, user: { id, first_name, role: existingUser?.[5] || 'user' } })
  response.cookies.set('session', sessionToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  
  return response
}
