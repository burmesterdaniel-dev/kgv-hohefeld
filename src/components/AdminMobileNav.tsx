'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminSidebarLinks from './AdminSidebarLinks'

interface AdminMobileNavProps {
  openRequests?: number
  pendingPhotos?: number
  userName: string
}

export default function AdminMobileNav({ openRequests = 0, pendingPhotos = 0, userName }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="lg:hidden flex items-center pr-2">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#3c6a00]/10 hover:text-[#3c6a00] transition-all"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
      >
        <span className="material-symbols-outlined text-[28px]">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-gradient-to-b from-[#0a1f1a] to-[#0d2818] text-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out border-r border-[#3c6a00]/20 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3c6a00] via-emerald-400 to-[#3c6a00]" />

        {/* Brand/Logo Section */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3c6a00] to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🌿</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">KGV Admin</h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Navigation</p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 py-4 overflow-y-auto">
          <AdminSidebarLinks 
            openRequests={openRequests} 
            pendingPhotos={pendingPhotos} 
            onClick={() => setOpen(false)} 
          />
        </div>

        {/* Footer info/User info */}
        <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-300">{userName}</span>
          </div>
          
          <Link href="/" className="flex items-center gap-2 text-sm text-emerald-400/80 hover:text-emerald-300 transition-colors">
            <span className="material-symbols-outlined text-[18px]">public</span> 
            Zur Webseite
          </Link>
        </div>
      </div>
    </div>
  )
}
