import { NextRequest, NextResponse } from 'next/server'
import { users, ads, complaints, reports } from '@/lib/storage'

function hasAccess(userId: string | undefined) {
  const user = users.find(u => u.id === userId)
  return user && (user.role === 'owner' || user.role === 'admin' || user.role === 'moderator')
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  
  if (!hasAccess(userId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 })
  }
  
  return NextResponse.json({
    totalUsers: users.length,
    totalAds: ads.length,
    totalComplaints: complaints.length,
    totalReports: reports.length,
  })
}
