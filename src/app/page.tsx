import Link from 'next/link'
import db from '@/lib/db'

export default function Home() {
  const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC LIMIT 3').all() as any[]

  return (
    <>
      <section className="relative min-h-[870px] flex items-center overflow-hidden mx-4 my-4 rounded-xl">
        <img src="/hero-bg.jpg" alt="KGV Hohefeld Garten" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 mb-6 bg-secondary/90 text-on-primary text-xs font-bold tracking-widest uppercase rounded-full">Bremen-Huchting</span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter mb-6 text-balance">
              Willkommen in der <span className="text-secondary-fixed">grünen Lunge</span> Bremens
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-body leading-relaxed max-w-2xl">
              Kleingartenverein Hohefeld e.V. Bremen – Seit 1952 ein Ort der Gemeinschaft, Ruhe und Natur. Entdecken Sie Ihren persönlichen Rückzugsort im KGV-Hohefeld.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/verkauf" className="bg-gradient-to-br from-secondary to-on-secondary-container text-on-primary px-8 py-4 rounded-DEFAULT font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl flex items-center gap-2">
                Jetzt Garten finden
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/galerie" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-DEFAULT font-bold text-lg hover:bg-white/20 transition-all duration-300">
                Verein entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-tertiary font-headline font-bold text-sm tracking-[0.2em] uppercase mb-2">Aktuelles</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tighter">Das passiert im Hohefeld</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {events.map((ev, i) => (
            <Link href={`/aktuelles/${ev.id}`} key={ev.id} className="md:col-span-4 group relative overflow-hidden rounded-xl bg-surface-container-lowest transition-all duration-500 hover:shadow-2xl cursor-pointer block border border-transparent hover:border-secondary/30 flex flex-col">
              {ev.filepath && (
                <div className="h-48 w-full overflow-hidden bg-slate-100">
                  <img src={ev.filepath} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col justify-start">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${i===0 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : i===1 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'}`}>
                    {ev.date_string}
                  </span>
                </div>
                <h4 className="text-xl font-headline font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{ev.title}</h4>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                  <div className="overflow-hidden">
                    <p className="text-sm text-on-surface-variant pt-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{ev.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {events.length === 0 && <p className="col-span-12 text-center text-on-surface-variant font-medium py-12">Derzeit keine aktuellen Meldungen.</p>}
        </div>
      </section>
      
      <section className="bg-surface-container-low py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <img src="/geschichte.jpg" alt="Kleingartenidylle" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
            <div className="absolute inset-0 border-8 border-white/20 rounded-3xl"></div>
          </div>
          <div>
            <h2 className="text-tertiary font-headline font-bold text-sm tracking-[0.2em] uppercase mb-4">Unsere Geschichte</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tighter mb-8">Über 100 Jahre Leidenschaft für das Grün</h3>
            <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
              <p>Der Kleingartenverein Hohefeld e.V. ist tief in der Geschichte Bremens verwurzelt. Gegründet 1952 als Zufluchtsort für Stadtbewohner, hat sich unser Verein zu einer lebendigen Gemeinschaft in Bremen-Huchting entwickelt.</p>
              <p>Heute pflegen wir auf unserem weitläufigen Gelände mit 142 Parzellen nicht nur Obst und Gemüse, sondern vor allem die gute Nachbarschaft.</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-8 border-t border-outline-variant/30 pt-10">
              <div>
                <p className="text-3xl font-headline font-black text-secondary">142</p>
                <p className="text-sm text-on-surface-variant uppercase tracking-wider font-bold">Parzellen</p>
              </div>
              <div>
                <p className="text-3xl font-headline font-black text-secondary">3,4ha</p>
                <p className="text-sm text-on-surface-variant uppercase tracking-wider font-bold">Gesamtfläche</p>
              </div>
              <div>
                <p className="text-3xl font-headline font-black text-secondary">1952</p>
                <p className="text-sm text-on-surface-variant uppercase tracking-wider font-bold">Gegründet</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
