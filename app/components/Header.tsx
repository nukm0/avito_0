'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Shield, PlusCircle } from 'lucide-react'

interface HeaderProps {
  user?: any
  onLogin?: () => void
  onLogout?: () => void
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const pathname = usePathname()
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Барахолка
          </Link>
          
          <nav className="flex gap-4 flex-wrap">
            <Link href="/" className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Home size={18} /> Главная
            </Link>
            
            {user && (
              <>
                <Link href="/dashboard" className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <User size={18} /> Профиль
                </Link>
                <Link href="/create-ad" className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <PlusCircle size={18} /> Подать объявление
                </Link>
              </>
            )}
            
            {user && (user.role === 'owner' || user.role === 'admin' || user.role === 'moderator') && (
              <Link href="/admin" className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${pathname === '/admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Shield size={18} /> Админка
              </Link>
            )}
          </nav>
          
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button onClick={onLogout} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition">
                  Выйти
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Войти через Telegram
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
