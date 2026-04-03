import Link from 'next/link'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Aktuelles & Termine - KGV Hohefeld'
}

export default async function Aktuelles() {
  const events = (await db.execute('SELECT * FROM events ORDER BY created_at DESC')).rows as any[]

  return (
    <div className="max-w-7xl mx-auto px-8 mb-24" style={{paddingTop: '2rem'}}>
      <h1 className="fade-in text-5xl font-extrabold text-[#00473d] mb-6">Aktuelles & Termine</h1>
      <p style={{marginBottom: '3rem'}} className="fade-in text-lg text-gray-600 max-w-2xl">Bleiben Sie auf dem Laufenden über die neuesten Ereignisse in unserem Verein.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {events.map((ev, i) => (
          <div key={ev.id} className={`fade-in bg-white rounded-xl shadow-sm border-t-4 flex flex-col h-full overflow-hidden ${i % 3 === 0 ? 'border-green-700' : i % 3 === 1 ? 'border-red-700' : 'border-[#00473d]'}`}>
            {ev.filepath && (
              <div className="w-full h-48 bg-slate-100 shrink-0">
                <img src={ev.filepath} alt={ev.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{ev.title}</h3>
              <p className="text-gray-500 text-sm mb-4 font-bold tracking-wide">📅 {ev.date_string}</p>
              <p className="text-gray-700 leading-relaxed line-clamp-3 mb-6 flex-1">{ev.description}</p>
              <Link href={`/aktuelles/${ev.id}`} className="mt-auto pt-4 border-t border-slate-100 font-bold text-[#00473d] flex items-center gap-2 hover:text-[#3c6a00] transition-colors group">
                Ganzer Beitrag <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="col-span-3 text-center text-gray-500 py-10">Aktuell keine Termine.</p>}
      </div>
      
      <Link href="/" className="font-bold text-white bg-[#00473d] px-8 py-4 rounded-lg hover:bg-[#3c6a00] transition-colors inline-block mt-8">Zurück zur Startseite</Link>
    </div>
  )
}
