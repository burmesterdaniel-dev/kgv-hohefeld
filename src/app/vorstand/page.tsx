import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Unser Vorstand - KGV Hohefeld'
}

export default async function Vorstand() {
  const members = (await db.execute('SELECT * FROM members ORDER BY id ASC')).rows as any[]

  return (
    <div className="max-w-7xl mx-auto px-8 mb-24" style={{paddingTop: '2rem'}}>
      <h1 className="text-5xl font-extrabold text-[#00473d] mb-6">Unser Vorstand</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">Lernen Sie das Team hinter dem KGV-Hohefeld e.V. kennen. Wir engagieren uns ehrenamtlich für die Belange aller Vereinsmitglieder.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map(m => {
          let mainImage = m.filepath;
          try {
            const arr = JSON.parse(m.filepath);
            if (Array.isArray(arr) && arr.length > 0) mainImage = arr[0];
          } catch {}
          return (
          <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
            <div className="h-72 overflow-hidden bg-slate-100">
              <img src={mainImage} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#00473d] mb-1">{m.name}</h3>
              <p className="font-bold text-[#3c6a00] uppercase tracking-wider text-xs mb-4">{m.role}</p>
              <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: m.description }} />
            </div>
          </div>
          );
        })}
        {members.length === 0 && <p className="col-span-3 text-center text-gray-500 py-12 border border-dashed rounded-xl border-slate-300">Derzeit sind keine Vorstandsmitglieder hinterlegt.</p>}
      </div>
    </div>
  )
}
