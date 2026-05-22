'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void
  }
}

interface TelegramLoginProps {
  onAuth: (user: any, phone: string) => void
}

export default function TelegramLogin({ onAuth }: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Создаем скрипт Telegram
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'baraholka_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '10')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'true')
    
    window.onTelegramAuth = (user) => {
      // Запрашиваем номер телефона
      const phone = prompt('Введите ваш номер телефона в формате +7XXXXXXXXXX:')
      if (!phone) {
        alert('Номер телефона обязателен!')
        return
      }
      if (!phone.startsWith('+7')) {
        alert('Разрешены только российские номера (+7)!')
        return
      }
      onAuth(user, phone)
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }
  }, [onAuth])

  return <div ref={containerRef} />
}
