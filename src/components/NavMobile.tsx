'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/aktuelles', label: 'Aktuelles' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/vorstand', label: 'Vorstand' },
  { href: '/verkauf', label: 'Garten-Börse' },
  { href: '/gaestebuch', label: 'Besucherbuch' },
]

export default function NavMobile() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Schließe Menü bei Route-Wechsel
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Verhindere Scrollen wenn Menü offen
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Navigation öffnen"
        aria-expanded={open}
        className="text-slate-700 hover:text-[#3c6a00] transition-colors p-2 rounded-lg hover:bg-slate-100"
      >
        <span className="material-symbols-outlined text-[28px]">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed top-0 left-0 w-[100dvw] h-[100dvh] bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-80 max-w-[100dvw] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <span className="font-headline font-bold text-lg text-[#3c6a00]">Menü</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Menü schließen"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col py-4 flex-1">
          {links.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`px-8 py-4 font-headline font-semibold text-base transition-colors flex items-center gap-3 ${
                  isActive
                    ? 'text-[#3c6a00] bg-[#3c6a00]/5 border-r-4 border-[#3c6a00]'
                    : 'text-slate-700 hover:text-[#3c6a00] hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <Link
            href="/kontakt"
            className="w-full block text-center bg-gradient-to-br from-[#3c6a00] to-[#00473d] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Pachtanfrage
          </Link>
        </div>
      </div>
    </div>
  )
}
