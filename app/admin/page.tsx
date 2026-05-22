'use client'

import { useAuth } from '@/lib/auth'
import { useState, useEffect } from 'react'
import { getUsers, getStats, banUser, unbanUser, giveReport } from '@/lib/api'

export default function AdminPanel() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [complaints, setComplaints] = useState([])

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <div className="text-center py-20">Доступ запрещен</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Админ панель</h1>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Всего пользователей</h3>
          <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Всего объявлений</h3>
          <p className="text-3xl font-bold">{stats.totalAds || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Жалоб в обработке</h3>
          <p className="text-3xl font-bold text-red-600">{stats.pendingComplaints || 0}</p>
        </div>
      </div>

      {/* Управление пользователями */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Пользователи</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Имя</th>
                <th className="text-left py-2">Телефон</th>
                <th className="text-left py-2">Роль</th>
                <th className="text-left py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u[0]} className="border-b">
                  <td className="py-2">{u[0]}</td>
                  <td>{u[1]}</td>
                  <td>{u[3]}</td>
                  <td>{u[5]}</td>
                  <td className="space-x-2">
                    <button onClick={() => banUser(u[0])} className="text-red-600">Забанить</button>
                    <button onClick={() => unbanUser(u[0])} className="text-green-600">Разбанить</button>
                    {user.role === 'admin' && (
                      <button onClick={() => giveReport(u[0])} className="text-yellow-600">Репорт</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Жалобы */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Жалобы</h2>
        {complaints.map((c: any) => (
          <div key={c[0]} className="border rounded-lg p-4 mb-3">
            <p><strong>От пользователя:</strong> {c[1]}</p>
            <p><strong>На объявление:</strong> {c[2]}</p>
            <p><strong>Причина:</strong> {c[3]}</p>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 bg-red-600 text-white rounded">Отклонить</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded">Принять</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
