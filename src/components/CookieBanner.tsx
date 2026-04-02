'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('kgv_cookie_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('kgv_cookie_consent', 'all')
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('kgv_cookie_consent', 'essential')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] p-6 md:p-8 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-headline font-bold text-slate-800 mb-2">Wir respektieren Ihre Privatsphäre</h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Wir verwenden auf unserer Website ausschließlich technisch notwendige (essenzielle) Cookies, um die reibungslose Funktion der Seite zu gewährleisten. 
            Weitere Informationen finden Sie in unserer <a href="/datenschutz" className="text-[#3c6a00] font-bold hover:underline">Datenschutzerklärung</a>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={acceptEssential}
            className="px-6 py-3 font-bold rounded-xl whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            Nur essenzielle akzeptieren
          </button>
          <button 
            onClick={acceptAll}
            className="px-6 py-3 font-bold rounded-xl whitespace-nowrap bg-gradient-to-br from-[#3c6a00] to-[#00473d] text-white hover:opacity-90 shadow-md transition-opacity"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
