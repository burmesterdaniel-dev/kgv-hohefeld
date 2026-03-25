import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {!user ? (
        <main className="flex-1">{children}</main>
      ) : (
        <>
          <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6">
              <h2 className="text-xl font-bold font-headline mb-4">KGV Admin</h2>
            </div>
            <nav className="flex flex-col gap-1 font-medium px-4">
              <Link href="/admin" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Dashboard</Link>
              <Link href="/admin/events" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Events</Link>
              <Link href="/admin/fotos" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Bilder</Link>
              <Link href="/admin/kontakte" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Kontakte</Link>
              <Link href="/admin/mitglieder" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Vorstand</Link>
              <Link href="/admin/gaerten" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Gärten</Link>
              <Link href="/admin/users" className="px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">Admins</Link>
            </nav>
            <div className="mt-auto p-8">
              <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">public</span> Zur Webseite
              </Link>
            </div>
          </aside>
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="bg-white border-b border-slate-200 px-10 py-5 flex justify-between items-center z-10">
              <h1 className="text-2xl font-headline font-bold text-slate-800">Verwaltung</h1>
              <div className="flex items-center gap-4">
                <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">person</span> {user.username}
                </span>
                <form action={async () => {
                  'use server'
                  const { cookies } = await import('next/headers')
                  const cookieStore = await cookies()
                  cookieStore.delete('auth_session')
                  const { redirect } = await import('next/navigation')
                  redirect('/admin/login')
                }}>
                  <button type="submit" className="text-sm font-bold text-red-600 hover:text-red-800">Logout</button>
                </form>
              </div>
            </header>
            <div className="p-10 overflow-y-auto flex-1">
              {children}
            </div>
          </main>
        </>
      )}
    </div>
  )
}
