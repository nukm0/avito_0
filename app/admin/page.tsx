'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'
import { Shield, Users, Package, AlertTriangle, Flag, BarChart3, Ban, Award } from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  username: string
  phone: string
  role: string
  banned: boolean
  rating: number
}

interface Complaint {
  id: string
  adId: string
  fromUserId: string
  reason: string
  status: string
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalAds: number
  totalComplaints: number
  totalReports: number
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalAds: 0, totalComplaints: 0, totalReports: 0 })
  const [activeTab, setActiveTab] = useState<'users' | 'complaints'>('users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    if (user.role !== 'owner' && user.role !== 'admin' && user.role !== 'moderator') {
      router.push('/')
      return
    }

    Promise.all([
      fetch('/api/admin/users').then(res => res.json()),
      fetch('/api/admin/complaints').then(res => res.json()),
      fetch('/api/admin/stats').then(res => res.json()),
    ]).then(([usersData, complaintsData, statsData]) => {
      setUsers(usersData)
      setComplaints(complaintsData)
      setStats(statsData)
      setLoading(false)
    }).catch(console.error)
  }, [user, router])

  const handleBanUser = async (userId: string, ban: boolean) => {
    await fetch('/api/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ban }),
    })
    // Обновляем список
    const updatedUsers = await fetch('/api/admin/users').then(res => res.json())
    setUsers(updatedUsers)
  }

  const handleChangeRole = async (userId: string, role: string) => {
    if (user?.role !== 'owner') {
      alert('Только владелец может менять роли')
      return
    }
    await fetch('/api/admin/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })
    const updatedUsers = await fetch('/api/admin/users').then(res => res.json())
    setUsers(updatedUsers)
  }

  const handleGiveReport = async (userId: string) => {
    if (user?.role !== 'owner' && user?.role !== 'admin') {
      alert('Недостаточно прав')
      return
    }
    const reason = prompt('Причина предупреждения:')
    if (reason) {
      await fetch('/api/admin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason }),
      })
      alert('Предупреждение выдано')
    }
  }

  const handleComplaintAction = async (complaintId: string, action: 'approve' | 'reject') => {
    await fetch(`/api/admin/complaints/${complaintId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const updatedComplaints = await fetch('/api/admin/complaints').then(res => res.json())
    setComplaints(updatedComplaints)
  }

  if (loading) {
    return (
      <>
        <Header user={user} onLogin={() => {}} onLogout={logout} />
        <div className="text-center py-20">Загрузка...</div>
      </>
    )
  }

  const isOwner = user?.role === 'owner'
  const isAdmin = user?.role === 'admin' || isOwner
  const isModerator = user?.role === 'moderator' || isAdmin

  return (
    <>
      <Header user={user} onLogin={() => {}} onLogout={logout} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-purple-600" /> Админ панель
          </h1>
          <div className="text-sm text-gray-500">
            Ваша роль: <span className="font-semibold capitalize">{user?.role}</span>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <Users className="text-blue-600 mb-2" size={24} />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Пользователей</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <Package className="text-green-600 mb-2" size={24} />
            <p className="text-2xl font-bold">{stats.totalAds}</p>
            <p className="text-sm text-gray-500">Объявлений</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <Flag className="text-red-600 mb-2" size={24} />
            <p className="text-2xl font-bold">{stats.totalComplaints}</p>
            <p className="text-sm text-gray-500">Жалоб</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <AlertTriangle className="text-yellow-600 mb-2" size={24} />
            <p className="text-2xl font-bold">{stats.totalReports}</p>
            <p className="text-sm text-gray-500">Предупреждений</p>
          </div>
        </div>
        
        {/* Табы */}
        <div className="flex gap-2 border-b mb-6">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={16} className="inline mr-1" /> Пользователи
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'complaints' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Flag size={16} className="inline mr-1" /> Жалобы ({complaints.filter(c => c.status === 'pending').length})
          </button>
        </div>
        
        {/* Пользователи */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4">Пользователь</th>
                    <th className="text-left p-4">Телефон</th>
                    <th className="text-left p-4">Роль</th>
                    <th className="text-left p-4">Рейтинг</th>
                    <th className="text-left p-4">Статус</th>
                    <th className="text-left p-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-sm text-gray-500">@{u.username}</div>
                        </div>
                      </td>
                      <td className="p-4">{u.phone}</td>
                      <td className="p-4">
                        {isOwner ? (
                          <select 
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="user">Пользователь</option>
                            <option value="moderator">Модератор</option>
                            <option value="admin">Админ</option>
                            <option value="owner">Владелец</option>
                          </select>
                        ) : (
                          <span className="capitalize">{u.role}</span>
                        )}
                      </td>
                      <td className="p-4">⭐ {u.rating}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.banned ? 'Забанен' : 'Активен'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={() => handleBanUser(u.id, !u.banned)}
                            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${u.banned ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                          >
                            <Ban size={14} /> {u.banned ? 'Разбанить' : 'Забанить'}
                          </button>
                          {isAdmin && (
                            <button 
                              onClick={() => handleGiveReport(u.id)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm flex items-center gap-1"
                            >
                              <AlertTriangle size={14} /> Репорт
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Жалобы */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Нет жалоб
              </div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-semibold">Жалоба на объявление #{c.adId}</p>
                      <p className="text-sm text-gray-500 mt-1">От пользователя: {c.fromUserId}</p>
                      <p className="text-sm mt-2">Причина: {c.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : c.status === 'approved' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {c.status === 'pending' ? 'На рассмотрении' : c.status === 'approved' ? 'Одобрена' : 'Отклонена'}
                      </span>
                      {c.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleComplaintAction(c.id, 'approve')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                          >
                            Принять
                          </button>
                          <button 
                            onClick={() => handleComplaintAction(c.id, 'reject')}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  )
}
