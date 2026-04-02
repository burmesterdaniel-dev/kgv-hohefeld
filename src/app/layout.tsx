import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import NavLinks from '@/components/NavLinks'
import NavMobile from '@/components/NavMobile'
import CookieBanner from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: 'KGV Hohefeld - Schrebergartenverein in Bremen',
  description: 'Offizielle Webseite des Kleingartenvereins Hohefeld in Bremen.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-secondary/30">
        
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 font-headline tracking-tight">
          <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-3 group">
              <img alt="KGV-Hohefeld Logo" src="/logo.png" className="h-20 md:h-28 lg:h-32 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>
            
            <NavLinks />
            <NavMobile />

            <Link href="/kontakt" className="hidden md:block bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-DEFAULT font-bold hover:scale-105 transition-transform duration-300 active:scale-95">
              Pachtanfrage
            </Link>
          </div>
        </nav>

        <main className="pt-36 md:pt-48 lg:pt-56">
          {children}
        </main>

        <footer className="bg-primary text-white w-full py-20 px-8 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <img alt="KGV-Hohefeld Logo" src="/logo.png" className="h-24 w-auto brightness-0 invert" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed antialiased">
                  Ein Teil der grünen Lunge Bremens. Wir fördern das Kleingartenwesen und schützen die Natur in unserer Hansestadt.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors group">
                    <span className="material-symbols-outlined text-sm">share</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors group">
                    <span className="material-symbols-outlined text-sm">camera</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-headline font-bold text-lg mb-6">Navigation</h4>
                <ul className="space-y-4 text-slate-300 text-sm antialiased">
                  <li><Link href="/" className="hover:text-secondary transition-colors">Startseite</Link></li>
                  <li><Link href="/aktuelles" className="hover:text-secondary transition-colors">Aktuelles</Link></li>
                  <li><Link href="/galerie" className="hover:text-secondary transition-colors">Galerie</Link></li>
                  <li><Link href="/vorstand" className="hover:text-secondary transition-colors">Vorstand</Link></li>
                  <li><Link href="/verkauf" className="hover:text-secondary transition-colors">Garten-Börse</Link></li>
                  <li><Link href="/gaestebuch" className="hover:text-secondary transition-colors">Besucherbuch</Link></li>
                  <li><Link href="/kontakt" className="hover:text-secondary transition-colors">Kontakt</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-headline font-bold text-lg mb-6">Rechtliches</h4>
                <ul className="space-y-4 text-slate-300 text-sm antialiased">
                  <li><Link href="/impressum" className="hover:text-secondary transition-colors">Impressum</Link></li>
                  <li><Link href="/datenschutz" className="hover:text-secondary transition-colors">Datenschutz</Link></li>
                  <li><Link href="/admin/login" className="hover:text-secondary transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">admin_panel_settings</span> Vereins-Login (Intern)</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs font-label">
              <p>© {new Date().getFullYear()} KGV-Hohefeld Bremen e.V. Ein Teil der grünen Lunge Bremens.</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">location_on</span> Bremen-Huchting
                </span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span>Tradition seit 1952</span>
              </div>
            </div>
          </div>
        </footer>
        <CookieBanner />
      </body>
    </html>
  )
}
