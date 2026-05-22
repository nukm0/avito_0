'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    TelegramLoginWidget: any
  }
}

export default function TelegramLogin() {
  const router = useRouter()

  useEffect(() => {
    // Загружаем скрипт Telegram
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth`)
    script.setAttribute('data-request-access', 'write')
    document.getElementById('telegram-login')?.appendChild(script)
  }, [])

  return <div id="telegram-login" />
}
