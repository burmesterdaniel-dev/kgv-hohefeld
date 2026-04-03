'use client'

import { useState, useEffect } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BK8y5hs_ev2TuKciYGhzusV55X3NTrlPa5UjekYOdbONeaK8oFRH6uzB2rgj0yuzC8nb58m9RKPIJHE1bya4et0'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkSupport()
  }, [])

  async function checkSupport() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      
      // Register service worker
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        const sub = await reg.pushManager.getSubscription()
        setIsSubscribed(!!sub)
      } catch (e) {
        console.error('SW registration error:', e)
      }
    }
    setIsLoading(false)
  }

  async function subscribe() {
    setIsLoading(true)
    setError('')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError('Benachrichtigungen wurden blockiert. Bitte erlauben Sie sie in den Browser-Einstellungen.')
        setIsLoading(false)
        return
      }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })

      setIsSubscribed(true)
    } catch (e: any) {
      setError('Fehler beim Aktivieren: ' + e.message)
      console.error(e)
    }
    setIsLoading(false)
  }

  async function unsubscribe() {
    setIsLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
      }
      setIsSubscribed(false)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  if (!isSupported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <span className="text-xl">📱</span>
        <div>
          <p className="font-bold text-sm text-amber-800 mb-1">Push-Benachrichtigungen</p>
          <p className="text-xs text-amber-600">Installieren Sie die App über "Zum Home-Bildschirm" um Push-Benachrichtigungen zu aktivieren (iOS 16.4+)</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-5 flex items-center justify-between border transition-colors ${isSubscribed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{isSubscribed ? '🔔' : '🔕'}</span>
        <div>
          <p className="font-bold text-sm text-slate-800 mb-0.5">Push-Benachrichtigungen</p>
          <p className="text-xs text-slate-500">
            {isSubscribed 
              ? 'Sie werden bei neuen Anfragen und Fotos benachrichtigt' 
              : 'Aktivieren, um bei neuen Anfragen sofort informiert zu werden'}
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
      <button
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={isLoading}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 ${
          isSubscribed 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-[#3c6a00] text-white hover:bg-[#2d5000]'
        }`}
      >
        {isLoading ? '...' : isSubscribed ? 'Deaktivieren' : 'Aktivieren'}
      </button>
    </div>
  )
}
