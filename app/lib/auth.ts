'use client'

import { useEffect, useState } from 'react'

export interface AuthUser {
  id: string
  name: string
  username: string
  phone: string
  role: string
  banned: boolean
  rating: number
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем сессию при загрузке
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const login = async (telegramUser: any, phone: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...telegramUser, phone }),
    })
    
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      return true
    }
    return false
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return { user, loading, login, logout }
}
