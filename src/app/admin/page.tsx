import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import Link from 'next/link'
import PushNotificationToggle from '@/components/PushNotificationToggle'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) redirect('/admin/login')

  const openContacts = (await db.execute("SELECT count(*) as c FROM contacts WHERE status IN ('neu', 'wartet_auf_admin')")).rows[0] as unknown as {c: number}
  const pendingPhotos = (await db.execute("SELECT count(*) as c FROM photos WHERE status = 'pending'")).rows[0] as unknown as {c: number}
  const availableGardens = (await db.execute("SELECT count(*) as c FROM gardens WHERE status = 'available'")).rows[0] as unknown as {c: number}
  const totalEvents = (await db.execute("SELECT count(*) as c FROM events")).rows[0] as unknown as {c: number}
  const totalMembers = (await db.execute("SELECT count(*) as c FROM members")).rows[0] as unknown as {c: number}
  const totalGuestbook = (await db.execute("SELECT count(*) as c FROM guestbook")).rows[0] as unknown as {c: number}

  const cards = [
    { title: 'Offene Anfragen', value: openContacts.c, icon: '💬', color: 'from-blue-500 to-blue-600', link: '/admin/kontakte', urgent: openContacts.c > 0 },
    { title: 'Neue Fotos', value: pendingPhotos.c, icon: '🖼️', color: 'from-amber-500 to-orange-500', link: '/admin/fotos', urgent: pendingPhotos.c > 0 },
    { title: 'Freie Gärten', value: availableGardens.c, icon: '🌱', color: 'from-[#3c6a00] to-emerald-600', link: '/admin/gaerten' },
    { title: 'Aktive Events', value: totalEvents.c, icon: '📅', color: 'from-purple-500 to-violet-600', link: '/admin/events' },
    { title: 'Vorstandsmitglieder', value: totalMembers.c, icon: '👥', color: 'from-slate-600 to-slate-700', link: '/admin/mitglieder' },
    { title: 'Gästebuch', value: totalGuestbook.c, icon: '📝', color: 'from-rose-500 to-pink-500', link: '/admin/gaestebuch' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Willkommen zurück, {user.username}! 👋</h2>
          <p className="text-slate-500 mt-1">Hier ist die aktuelle Übersicht Ihres Vereins.</p>
        </div>
        <div className="text-sm text-slate-400 font-medium">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <Link key={i} href={card.link} className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            {card.urgent && (
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            )}
            <div className="p-6 flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                <p className="text-3xl font-black text-slate-800">{card.value}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Schnellzugriff</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/events" className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-[#3c6a00]/5 hover:to-emerald-50 p-4 rounded-xl text-center transition-all group border border-slate-200/50">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📅</span>
            <span className="text-sm font-bold text-slate-600">Event anlegen</span>
          </Link>
          <Link href="/admin/fotos" className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-amber-50 hover:to-orange-50 p-4 rounded-xl text-center transition-all group border border-slate-200/50">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🖼️</span>
            <span className="text-sm font-bold text-slate-600">Fotos prüfen</span>
          </Link>
          <Link href="/admin/kontakte" className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 p-4 rounded-xl text-center transition-all group border border-slate-200/50">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💬</span>
            <span className="text-sm font-bold text-slate-600">Anfragen</span>
          </Link>
          <Link href="/admin/gaerten" className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-emerald-50 hover:to-green-50 p-4 rounded-xl text-center transition-all group border border-slate-200/50">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🌱</span>
            <span className="text-sm font-bold text-slate-600">Gärten verwalten</span>
          </Link>
          <Link href="/admin/gaestebuch" className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-rose-50 hover:to-pink-50 p-4 rounded-xl text-center transition-all group border border-slate-200/50">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📝</span>
            <span className="text-sm font-bold text-slate-600">Gästebuch</span>
          </Link>
        </div>
      </div>

      {/* Push Notifications */}
      <PushNotificationToggle />

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#3c6a00]/5 via-emerald-50 to-[#3c6a00]/5 border border-[#3c6a00]/10 text-[#3c6a00] p-5 rounded-2xl flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <p className="font-bold text-sm mb-1">Tipp</p>
          <p className="text-sm opacity-80">Installieren Sie diese App auf dem Home-Bildschirm: Safari → Teilen → &quot;Zum Home-Bildschirm&quot;. Aktivieren Sie Push-Benachrichtigungen um sofort über neue Anfragen informiert zu werden.</p>
        </div>
      </div>
    </div>
  )
}
