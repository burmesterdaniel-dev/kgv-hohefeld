'use client'

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

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-8 font-headline tracking-tight">
      {links.map(({ href, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`transition-all duration-300 hover:scale-105 pb-1 font-bold ${
              isActive
                ? 'text-[#3c6a00] border-b-2 border-[#3c6a00]'
                : 'text-slate-600 hover:text-[#00473d] border-b-2 border-transparent'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
