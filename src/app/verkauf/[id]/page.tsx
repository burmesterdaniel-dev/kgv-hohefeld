import Link from 'next/link'
import db from '@/lib/db'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const g = db.prepare('SELECT title, number FROM gardens WHERE id = ?').get(resolvedParams.id) as any
  if (!g) return { title: 'Garten nicht gefunden' }
  return { title: `Parzelle ${g.number}: ${g.title} - KGV Hohefeld` }
}

export default async function GartenDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const garden = db.prepare('SELECT * FROM gardens WHERE id = ?').get(resolvedParams.id) as any
  
  if (!garden) notFound()

  let images = [garden.filepath]
  try {
    const parsed = JSON.parse(garden.filepath)
    if (Array.isArray(parsed) && parsed.length > 0) images = parsed
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-8 mb-24">
      <Link href="/verkauf" className="inline-flex items-center gap-2 text-[#3c6a00] font-bold hover:text-[#00473d] mb-8 hover:-translate-x-1 transition-transform">
        <span className="material-symbols-outlined">arrow_back</span>
        Zurück zur Übersicht
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="h-64 md:h-96 relative bg-slate-100">
          <img src={images[0]} alt={garden.title} className="w-full h-full object-cover" />
          {garden.status === 'reserved' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-amber-500 text-white font-black px-8 py-3 rounded-xl shadow-2xl text-3xl rotate-[-12deg] tracking-widest uppercase border-4 border-white">RESERVIERT</span>
            </div>
          )}
        </div>
        
        <div className="p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="inline-block px-5 py-2 rounded-full bg-[#00473d]/10 text-[#00473d] font-bold tracking-widest uppercase mb-6 text-sm">Parzelle {garden.number}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-slate-800 mb-6 leading-tight tracking-tighter">{garden.title}</h1>
            </div>
            
            <div className="prose prose-lg text-slate-600 max-w-none mb-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Beschreibung</h3>
              <div dangerouslySetInnerHTML={{ __html: garden.description }} />
            </div>

            {images.length > 1 && (
              <div className="mt-16 pt-12 border-t border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Weitere Impressionen</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <div key={img} className="aspect-square rounded-xl overflow-hidden shadow-md bg-slate-100">
                      <img src={img} alt={`Garten ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200 tracking-tight">Daten & Fakten</h3>
              
              <ul className="space-y-6 mb-8">
                <li className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <span className="flex items-center gap-3 text-slate-600 font-medium"><span className="material-symbols-outlined text-slate-400">square_foot</span> Fläche</span>
                  <span className="font-black text-lg text-[#00473d]">{garden.area} m²</span>
                </li>
                <li className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <span className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider"><span className="material-symbols-outlined text-[18px]">handyman</span> Zustand</span>
                  <span className="font-bold text-slate-800">{garden.condition}</span>
                </li>
                <li className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <span className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider"><span className="material-symbols-outlined text-[18px]">house</span> Ausstattung</span>
                  <span className="font-bold text-slate-800">{garden.equipment}</span>
                </li>
              </ul>
              
              <div className="pt-6 border-t border-slate-200 mb-8 flex flex-col items-center">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Ablösesumme / Kaufpreis</span>
                <span className="text-5xl font-black text-[#3c6a00]">{garden.price} €</span>
              </div>
              
              {garden.status === 'available' ? (
                <Link href={`/kontakt?subject=Kaufinteresse an Parzelle ${garden.number} - ${garden.title}`} className="w-full flex items-center justify-center gap-2 py-4 bg-[#00473d] text-white font-bold text-lg rounded-xl hover:bg-[#3c6a00] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 relative overflow-hidden group">
                  <span className="relative z-10">Anfrage stellen</span>
                  <span className="material-symbols-outlined relative z-10 text-xl group-hover:translate-x-1 transition-transform">mail</span>
                </Link>
              ) : (
                <button disabled className="w-full py-4 bg-slate-200 text-slate-500 font-bold text-lg rounded-xl cursor-not-allowed border-2 border-slate-300">
                  Zurzeit reserviert
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
