import db from '@/lib/db'
import RichTextEditor from '@/components/RichTextEditor'
import ImageUpload from '@/components/ImageUpload'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminMitglieder() {
  const members = (await db.execute('SELECT * FROM members ORDER BY id ASC')).rows as any[]

  async function addMember(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const description = formData.get('description') as string
    const imagesRaw = formData.get('images') as string
    
    let filepath = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=crop'
    if (imagesRaw) {
      try {
        const parsed = JSON.parse(imagesRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          filepath = JSON.stringify(parsed)
        }
      } catch {
        // Single data URL
        if (imagesRaw.startsWith('data:')) {
          filepath = imagesRaw
        }
      }
    }
    
    await db.execute({ sql: 'INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)', args: [name, role, filepath, description] })
    revalidatePath('/admin/mitglieder')
    revalidatePath('/vorstand')
  }

  async function deleteMember(formData: FormData) {
    'use server'
    const id = formData.get('id')
    await db.execute({ sql: 'DELETE FROM members WHERE id = ?', args: [id as string] })
    revalidatePath('/admin/mitglieder')
    revalidatePath('/vorstand')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Vorstand & Mitglieder</h2>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Neues Mitglied hinzufügen</h3>
        <form action={addMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name (z.B. Erika Musterfrau)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="role" placeholder="Funktion (z.B. Kassiererin)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <ImageUpload name="images" label="Porträt(s) (Max. 4 MB pro Datei)" multiple />
          <RichTextEditor name="description" placeholder="Beschreibung..." />
          <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 md:col-span-2 shadow-md">Mitglied speichern</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.map(m => {
          let mainImage = m.filepath;
          try {
            const arr = JSON.parse(m.filepath);
            if (Array.isArray(arr) && arr.length > 0) mainImage = arr[0];
          } catch (e) {}

          return (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-100 relative">
              <img src={mainImage} alt={m.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h4 className="text-white font-bold text-xl">{m.name}</h4>
                <p className="text-white/80 text-sm font-medium">{m.role}</p>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 flex-1">{m.description}</p>
              <form action={deleteMember}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="w-full text-red-600 font-bold text-sm bg-red-50 py-2.5 rounded-lg hover:bg-red-100 transition-colors">Mitglied entfernen</button>
              </form>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  )
}
