'use client'

import { usePathname } from 'next/navigation'

export default function AdminHider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide navbar & footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <>{children}</>
}
