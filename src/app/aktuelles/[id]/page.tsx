import Link from 'next/link'
import db from '@/lib/db'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const ev = db.prepare('SELECT title FROM events WHERE id = ?').get(resolvedParams.id) as any
  if (!ev) return { title: 'Event nicht gefunden' }
  return { title: `${ev.title} - Aktuelles - KGV Hohefeld` }
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const ev = db.prepare('SELECT * FROM events WHERE id = ?').get(resolvedParams.id) as any
  
  if (!ev) notFound()

  return (
    <div className="max-w-4xl mx-auto px-8 mb-24 mt-12 min-h-[50vh]">
      <Link href="/aktuelles" className="inline-flex items-center gap-2 text-[#3c6a00] font-bold hover:text-[#00473d] mb-12 hover:-translate-x-1 transition-transform">
        <span className="material-symbols-outlined">arrow_back</span>
        Zurück zur Terminübersicht
      </Link>
      
      <article className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border-t-8 border-[#00473d]">
        {ev.filepath && (
          <div className="w-full h-64 md:h-96 mb-12 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <img src={ev.filepath} alt={ev.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="bg-[#00473d]/10 text-[#00473d] font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span> {ev.date_string}
          </span>
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Vereinstermin</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-slate-800 mb-8 leading-tight tracking-tight">{ev.title}</h1>
        
        <div className="prose prose-lg text-slate-700 max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: ev.description }}>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <span className="text-slate-400 text-sm font-medium">Veröffentlicht am {new Date(ev.created_at).toLocaleDateString('de-DE')}</span>
          <Link href={`/kontakt?subject=Frage zu Event: ${ev.title}`} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">mail</span> Fragen zum Event?
          </Link>
        </div>
      </article>
    </div>
  )
}
