import Link from 'next/link'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Garten-Börse - KGV Hohefeld'
}

export default async function Verkauf() {
  const gardens = (await db.execute('SELECT * FROM gardens WHERE status != \'sold\' ORDER BY created_at DESC')).rows as any[]
  
  return (
    <>
      <header className="max-w-7xl mx-auto px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-widest uppercase mb-4">Verfügbare Parzellen</span>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold text-primary tracking-tighter mb-6 leading-tight">
              Ihre grüne Oase <br/>im <span className="text-secondary italic">Hohefeld</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
              Entdecken Sie unsere aktuell freien Kleingärten. Werden Sie Teil unserer Gemeinschaft und gestalten Sie Ihr eigenes Stück Bremer Natur in Bremens grüner Lunge.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <div className="p-6 bg-surface-container-low rounded-xl flex flex-col gap-4 border-l-4 border-secondary">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
                <span className="font-bold">Saison {new Date().getFullYear()}</span>
              </div>
              <p className="text-sm text-on-surface-variant">Derzeit {gardens.length === 1 ? 'ist 1 Garten' : `sind ${gardens.length} Gärten`} für neue Pächter auf dem Markt.</p>
            </div>
          </div>
        </div>
      </header>
      
      <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
        {gardens.map((g) => {
          let mainImage = g.filepath;
          try {
            const arr = JSON.parse(g.filepath);
            if (Array.isArray(arr) && arr.length > 0) mainImage = arr[0];
          } catch {}
          return (
          <div key={g.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col">
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={mainImage} alt={g.title} />
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">Parzelle {g.number}</div>
              <div className="absolute bottom-4 right-4 glass-morphism bg-white/70 backdrop-blur-md px-4 py-2 rounded-lg text-primary font-black shadow-md">{g.area} m²</div>
              {g.status === 'reserved' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-amber-500 text-white font-black px-6 py-2 rounded-lg shadow-xl text-xl rotate-[-12deg] tracking-wider uppercase border-2 border-white">RESERVIERT</span>
                </div>
              )}
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-headline font-bold text-primary mb-2 line-clamp-1">{g.title}</h3>
                <div className="text-on-surface-variant line-clamp-2 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: g.description }} />
              </div>
              <div className="flex items-center justify-between mt-auto mb-6 pt-6 border-t border-surface-container">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Ablöse</span>
                  <span className="text-2xl font-black text-secondary">{g.price} €</span>
                </div>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" title={g.equipment}>house</span>
                  <span className="material-symbols-outlined text-on-surface-variant" title={g.condition}>handyman</span>
                </div>
              </div>
              <Link href={`/verkauf/${g.id}`} className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 group-hover:verdant-gradient shadow-sm">
                Details ansehen <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
          );
        })}

        {gardens.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">nature_people</span>
            <h3 className="text-xl font-bold text-primary mb-2">Aktuell keine freien Parzellen</h3>
            <p className="text-on-surface-variant max-w-lg mx-auto">Derzeit sind alle unsere Gärten verpachtet. Schauen Sie gerne in ein paar Wochen wieder vorbei oder schreiben Sie uns über uns Kontaktformular.</p>
          </div>
        )}
      </section>
    </>
  )
}
