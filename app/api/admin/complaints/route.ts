import { NextRequest, NextResponse } from 'next/server'
import { users, complaints } from '@/lib/storage'

function hasAccess(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin' || user.role === 'moderator')
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  
  if (!hasAccess(userId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  return NextResponse.json(complaints)
}

// Создать жалобу (доступно всем)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { adId, reason, fromUserId } = body
  
  const newComplaint = {
    id: Date.now().toString(),
    adId,
    fromUserId,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  
  complaints.push(newComplaint)
  return NextResponse.json(newComplaint, { status: 201 })
}
