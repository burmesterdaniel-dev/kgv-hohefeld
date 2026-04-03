import db from '@/lib/db'
import RichTextEditor from '@/components/RichTextEditor'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export default async function AdminEvents() {
  const events = (await db.execute('SELECT * FROM events ORDER BY created_at DESC')).rows as any[]

  async function addEvent(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const date_string = formData.get('date_string') as string
    const description = formData.get('description') as string
    const file = formData.get('filepath') as File | null
    
    let filepath = ''
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      fs.writeFileSync(path.join(uploadDir, filename), buffer)
      filepath = `/uploads/${filename}`
    }

    await db.execute({ sql: 'INSERT INTO events (title, date_string, description, filepath) VALUES (?, ?, ?, ?)', args: [title, date_string, description, filepath] })
    revalidatePath('/admin/events')
    revalidatePath('/')
    revalidatePath('/aktuelles')
  }

  async function deleteEvent(formData: FormData) {
    'use server'
    const id = formData.get('id')
    await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id as string] })
    revalidatePath('/admin/events')
    revalidatePath('/')
    revalidatePath('/aktuelles')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Events verwalten</h2>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Neues Event anlegen</h3>
        <form action={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Titel (z.B. Sommerfest)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <input name="date_string" placeholder="Datum (z.B. Sa. 10. Mai, 15 Uhr)" required className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-600 mb-1">Event-Bild (optional, Max. 10 MB)</label>
            <input type="file" name="filepath" accept="image/*" className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-slate-50" />
          </div>
          <RichTextEditor name="description" placeholder="Beschreibungstext..." />
          <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 md:col-span-2 shadow-md">Event veröffentlichen</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600">Titel</th>
              <th className="p-4 font-bold text-slate-600">Datum</th>
              <th className="p-4 font-bold text-slate-600">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{ev.title}</td>
                <td className="p-4 text-slate-500">{ev.date_string}</td>
                <td className="p-4">
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={ev.id} />
                    <button type="submit" className="text-red-600 font-bold text-sm bg-red-100 py-2 px-4 rounded-md hover:bg-red-200 transition-colors">Löschen</button>
                  </form>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">Keine Events vorhanden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
