import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import db from '@/lib/db'
import AdminSidebarLinks from '@/components/AdminSidebarLinks'
import AdminMobileNav from '@/components/AdminMobileNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  // If not logged in, show ONLY the login form - nothing else
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0d2818] to-[#0a1f1a] flex items-center justify-center p-4">
        {children}
      </div>
    )
  }

  let openRequests = 0
  let pendingPhotos = 0
  try {
    const res = await db.execute("SELECT count(*) as c FROM contacts WHERE status IN ('neu', 'wartet_auf_admin')")
    openRequests = (res.rows[0] as any).c
    const photosRes = await db.execute("SELECT count(*) as c FROM photos WHERE status = 'pending'")
    pendingPhotos = (photosRes.rows[0] as any).c
  } catch(e) {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-50 flex overflow-x-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-72 bg-gradient-to-b from-[#0a1f1a] to-[#0d2818] text-white flex-col shadow-2xl relative overflow-hidden sticky top-0 h-screen shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3c6a00] via-emerald-400 to-[#3c6a00]" />
        
        <div className="p-6 pb-4">
          <Link href="/admin" className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3c6a00] to-emerald-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="text-white text-lg">🌿</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">KGV Admin</h2>
              <p className="text-xs text-emerald-400/70 font-medium">Verwaltungspanel</p>
            </div>
          </Link>
        </div>

        <AdminSidebarLinks openRequests={openRequests} pendingPhotos={pendingPhotos} />

        <div className="p-4 border-t border-white/5 mt-4">
          <Link href="/" className="text-emerald-400/60 hover:text-emerald-300 flex items-center gap-2 text-sm transition-colors px-2 py-2">
            <span className="text-sm">🌐</span> Zur Webseite →
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative">
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/80 px-4 sm:px-8 lg:px-10 py-3 sm:py-4 flex justify-between items-center z-40 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            {/* Burger Menu for Mobile */}
            <AdminMobileNav 
              openRequests={openRequests} 
              pendingPhotos={pendingPhotos} 
              userName={user.username} 
            />
            
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">Verwaltung</h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">KGV-Hohefeld e.V. · Admin-Bereich</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex bg-gradient-to-r from-[#3c6a00]/10 to-emerald-50 text-[#3c6a00] px-4 py-2 rounded-full text-sm font-bold items-center gap-2 border border-[#3c6a00]/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user.username}
            </div>
            
            <form action={async () => {
              'use server'
              const { cookies } = await import('next/headers')
              const cookieStore = await cookies()
              cookieStore.delete('auth_session')
              const { redirect } = await import('next/navigation')
              redirect('/admin/login')
            }}>
              <button 
                type="submit" 
                className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                title="Abmelden"
              >
                <span className="material-symbols-outlined text-lg sm:hidden">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-10 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
