import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import db from '@/lib/db'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  let openRequests = 0
  let pendingPhotos = 0
  if (user) {
    try {
      const res = await db.execute("SELECT count(*) as c FROM contacts WHERE status IN ('neu', 'wartet_auf_admin')")
      openRequests = (res.rows[0] as any).c
      const photosRes = await db.execute("SELECT count(*) as c FROM photos WHERE status = 'pending'")
      pendingPhotos = (photosRes.rows[0] as any).c
    } catch(e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-50 flex">
      {!user ? (
        <main className="flex-1">{children}</main>
      ) : (
        <>
          <aside className="w-72 bg-gradient-to-b from-[#0a1f1a] to-[#0d2818] text-white flex flex-col shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3c6a00] via-emerald-400 to-[#3c6a00]" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#3c6a00]/5 rounded-full -translate-x-1/4 translate-y-1/2" />

            {/* Logo & Brand */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3c6a00] to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🌿</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold font-headline tracking-tight">KGV Admin</h2>
                  <p className="text-xs text-emerald-400/70 font-medium">Verwaltungspanel</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-0.5 px-3 flex-1">
              <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-4 pb-2">Übersicht</p>
              <Link href="/admin" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">📊</span>
                Dashboard
              </Link>

              <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">Inhalte</p>
              <Link href="/admin/events" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">📅</span>
                Events
              </Link>
              <Link href="/admin/fotos" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🖼️</span>
                Bilder
                {pendingPhotos > 0 && <span className="ml-auto bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{pendingPhotos}</span>}
              </Link>
              <Link href="/admin/mitglieder" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">👥</span>
                Vorstand
              </Link>
              <Link href="/admin/gaerten" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🌱</span>
                Gärten
              </Link>

              <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">Kommunikation</p>
              <Link href="/admin/kontakte" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">💬</span>
                Anfragen
                {openRequests > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{openRequests}</span>}
              </Link>

              <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">System</p>
              <Link href="/admin/users" className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🔐</span>
                Admins
              </Link>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 mt-4">
              <Link href="/" className="text-emerald-400/60 hover:text-emerald-300 flex items-center gap-2 text-sm transition-colors px-2 py-2">
                <span className="text-sm">🌐</span> Zur Webseite →
              </Link>
            </div>
          </aside>
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/80 px-8 lg:px-10 py-4 flex justify-between items-center z-10 shadow-sm">
              <div>
                <h1 className="text-xl font-headline font-bold text-slate-800">Verwaltung</h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">KGV-Hohefeld e.V. · Admin-Bereich</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#3c6a00]/10 to-emerald-50 text-[#3c6a00] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-[#3c6a00]/10">
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
                  <button type="submit" className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
                </form>
              </div>
            </header>
            <div className="p-6 lg:p-10 overflow-y-auto flex-1">
              {children}
            </div>
          </main>
        </>
      )}
    </div>
  )
}
