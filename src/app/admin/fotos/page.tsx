import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminFotos() {
  const photos = (await db.execute('SELECT * FROM photos ORDER BY created_at DESC')).rows as any[]

  async function approve(formData: FormData) {
    'use server'
    await db.execute({ sql: "UPDATE photos SET status = 'approved' WHERE id = ?", args: [formData.get('id') as string] })
    revalidatePath('/admin/fotos')
    revalidatePath('/galerie')
  }

  async function reject(formData: FormData) {
    'use server'
    await db.execute({ sql: "DELETE FROM photos WHERE id = ?", args: [formData.get('id') as string] })
    revalidatePath('/admin/fotos')
    revalidatePath('/galerie')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Galerie-Bilder Freigabe</h2>
      <p className="text-slate-500 mb-8 max-w-2xl">Prüfen Sie hier die von Nutzern hochgeladenen Bilder. Nur freigegebene Bilder erscheinen in der öffentlichen Galerie.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {photos.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <img src={p.filepath} alt="Upload" className="w-full h-48 object-cover bg-slate-100" />
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${p.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>{p.status === 'pending' ? 'Wartet auf Freigabe' : 'Freigegeben'}</span>
                <p className="text-xs text-slate-400 mt-2 font-mono" title={p.filepath}>{p.filename}</p>
              </div>
              <div className="flex gap-3 mt-auto">
                {p.status === 'pending' && (
                  <form action={approve} className="flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="w-full bg-[#3c6a00] text-white font-bold py-2 rounded-lg text-sm hover:bg-[#00473d] transition-colors shadow-sm">Übernehmen</button>
                  </form>
                )}
                <form action={reject} className="flex-1">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="w-full bg-red-50 text-red-700 font-bold py-2 rounded-lg text-sm hover:bg-red-100 transition-colors">Löschen</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <p className="text-slate-500 col-span-3">Noch keine Fotos hochgeladen.</p>
        )}
      </div>
    </div>
  )
}
