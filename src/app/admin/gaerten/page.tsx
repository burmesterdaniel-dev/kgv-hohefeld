import db from '@/lib/db'
import RichTextEditor from '@/components/RichTextEditor'
import ImageUpload from '@/components/ImageUpload'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminGaerten() {
  const gardens = (await db.execute('SELECT * FROM gardens ORDER BY created_at DESC')).rows as any[]
  
  async function addGarden(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const number = formData.get('number') as string
    const area = parseInt(formData.get('area') as string)
    const price = parseInt(formData.get('price') as string)
    const condition = formData.get('condition') as string
    const equipment = formData.get('equipment') as string
    const description = formData.get('description') as string
    const imagesRaw = formData.get('images') as string
    
    let filepath = 'https://images.unsplash.com/photo-1589923188900-85dae5243404?q=80&w=800&auto=format&fit=crop'
    if (imagesRaw) {
      try {
        const parsed = JSON.parse(imagesRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          filepath = JSON.stringify(parsed)
        }
      } catch {
        if (imagesRaw.startsWith('data:')) {
          filepath = imagesRaw
        }
      }
    }
    
    await db.execute({ sql: 'INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: [title, number, area, price, condition, equipment, description, filepath] })
    revalidatePath('/admin/gaerten')
    revalidatePath('/verkauf')
    revalidatePath('/')
  }

  async function setStatus(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const status = formData.get('status')
    await db.execute({ sql: 'UPDATE gardens SET status = ? WHERE id = ?', args: [status as string, id as string] })
    revalidatePath('/admin/gaerten')
    revalidatePath('/verkauf')
    revalidatePath('/')
  }

  async function deleteGarden(formData: FormData) {
    'use server'
    const id = formData.get('id')
    await db.execute({ sql: 'DELETE FROM gardens WHERE id = ?', args: [id as string] })
    revalidatePath('/admin/gaerten')
    revalidatePath('/verkauf')
    revalidatePath('/')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Garten-Börse verwalten</h2>
      
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-10">
        <h3 className="font-bold text-lg mb-6 text-slate-700">Neue Parzelle inserieren</h3>
        <form action={addGarden} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <input name="title" placeholder="Titel (z.B. Ruhige See-Lage)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="number" placeholder="Parzellen-Nr. (z.B. 42)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="area" type="number" placeholder="Fläche in m²" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="price" type="number" placeholder="Preis/Ablöse in €" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="condition" placeholder="Zustand (z.B. Gepflegt)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="equipment" placeholder="Ausstattung (z.B. Steinlaube, Strom)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <ImageUpload name="images" label="Garten-Bilder (Max. 10 MB pro Datei, wird automatisch komprimiert)" multiple />
          <RichTextEditor name="description" placeholder="Ausführliche Beschreibung..." />
          <button type="submit" className="bg-[#3c6a00] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#00473d] transition-colors md:col-span-3 lg:col-span-3 shadow-md">Inserat veröffentlichen</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gardens.map(g => {
          let mainImage = g.filepath;
          try {
            const arr = JSON.parse(g.filepath);
            if (Array.isArray(arr) && arr.length > 0) mainImage = arr[0];
          } catch (e) {}
          
          return (
          <div key={g.id} className={`bg-white rounded-xl border-2 overflow-hidden flex flex-col sm:flex-row shadow-sm ${g.status === 'sold' ? 'border-slate-300 opacity-75' : g.status === 'reserved' ? 'border-amber-400' : 'border-[#3c6a00]/30'}`}>
            <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
              <img src={mainImage} alt={g.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md text-white ${g.status === 'available' ? 'bg-[#3c6a00]' : g.status === 'reserved' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                  {g.status === 'available' ? 'Verfügbar' : g.status === 'reserved' ? 'Reserviert' : 'Verkauft'}
                </span>
              </div>
            </div>
            
            <div className="p-6 w-full sm:w-3/5 flex flex-col">
              <h4 className="font-bold text-xl text-slate-800 mb-1">{g.title} <span className="text-slate-500 font-medium text-base ml-1"># {g.number}</span></h4>
              <p className="text-2xl font-black text-[#00473d] mb-4">{g.price} € <span className="text-sm font-medium text-slate-500 block sm:inline">({g.area} m²)</span></p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <form action={setStatus} className="flex-1 min-w-[100px]">
                  <input type="hidden" name="id" value={g.id} />
                  <input type="hidden" name="status" value={g.status === 'available' ? 'reserved' : g.status === 'reserved' ? 'sold' : 'available'} />
                  <button type="submit" className="w-full bg-slate-100 text-slate-700 font-bold py-2 rounded text-xs hover:bg-slate-200 transition-colors">
                    Mache {g.status === 'available' ? 'Reserviert' : g.status === 'reserved' ? 'Verkauft' : 'Verfügbar'}
                  </button>
                </form>
                <form action={deleteGarden}>
                  <input type="hidden" name="id" value={g.id} />
                  <button type="submit" className="text-red-500 bg-red-50 font-bold text-xs py-2 px-3 rounded hover:bg-red-100 transition-colors">Löschen</button>
                </form>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  )
}
