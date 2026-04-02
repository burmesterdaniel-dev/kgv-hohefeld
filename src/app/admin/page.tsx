import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) redirect('/admin/login')

  const openContacts = (await db.execute("SELECT count(*) as c FROM contacts WHERE status = 'neu'")).rows[0] as unknown as {c: number}
  const pendingPhotos = (await db.execute("SELECT count(*) as c FROM photos WHERE status = 'pending'")).rows[0] as unknown as {c: number}
  const availableGardens = (await db.execute("SELECT count(*) as c FROM gardens WHERE status = 'available'")).rows[0] as unknown as {c: number}
  const totalEvents = (await db.execute("SELECT count(*) as c FROM events")).rows[0] as unknown as {c: number}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Herzlich Willkommen, {user.username}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Offene Anfragen</h3>
          <p className="text-4xl font-black text-blue-600">{openContacts.c}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Neue Fotos</h3>
          <p className="text-4xl font-black text-amber-500">{pendingPhotos.c}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Freie Gärten</h3>
          <p className="text-4xl font-black text-[#3c6a00]">{availableGardens.c}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Aktive Events</h3>
          <p className="text-4xl font-black text-purple-600">{totalEvents.c}</p>
        </div>
      </div>
      <div className="mt-8 bg-blue-50 text-blue-800 p-6 rounded-xl">
        <p className="font-medium">Nutzen Sie das Menü links, um Inhalte der Webseite (Verkäufe, Events, Mitglieder) zu bearbeiten oder Anfragen & Bilder freizugeben.</p>
      </div>
    </div>
  )
}
