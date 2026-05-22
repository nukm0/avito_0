import { NextRequest, NextResponse } from 'next/server'
import { users, complaints, ads, updateAd } from '@/lib/storage'

function isAdmin(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin')
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.cookies.get('userId')?.value
  
  if (!isAdmin(userId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  const body = await req.json()
  const { action } = body // 'approve' или 'reject'
  
  const complaintIndex = complaints.findIndex(c => c.id === params.id)
  if (complaintIndex === -1) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  
  const complaint = complaints[complaintIndex]
  
  if (action === 'approve') {
    // Одобряем жалобу - увеличиваем счетчик жалоб у объявления
    const ad = ads.find(a => a.id === complaint.adId)
    if (ad) {
      updateAd(ad.id, { complaints: (ad.complaints || 0) + 1 })
    }
    complaints[complaintIndex].status = 'approved'
  } else if (action === 'reject') {
    complaints[complaintIndex].status = 'rejected'
  }
  
  return NextResponse.json({ success: true })
}
