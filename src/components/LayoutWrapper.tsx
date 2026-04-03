'use client'

import { usePathname } from 'next/navigation'

export default function LayoutWrapper({ children, navbar, footer }: { 
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  
  if (isAdmin) {
    // On admin pages: no nav, no footer, no padding
    return <>{children}</>
  }
  
  return (
    <>
      {navbar}
      <main className="pt-36 md:pt-48 lg:pt-56">
        {children}
      </main>
      {footer}
    </>
  )
}
