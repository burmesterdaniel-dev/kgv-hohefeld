import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export default async function AdminKontakte() {
  const contacts = (await db.execute('SELECT * FROM contacts ORDER BY created_at DESC')).rows as any[]

  async function markAnswered(formData: FormData) {
    'use server'
    await db.execute({ sql: "UPDATE contacts SET status = 'beantwortet' WHERE id = ?", args: [formData.get('id') as string] })
    revalidatePath('/admin/kontakte')
  }

  async function deleteContact(formData: FormData) {
    'use server'
    await db.execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [formData.get('id') as string] })
    revalidatePath('/admin/kontakte')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Kontaktanfragen aus dem Web</h2>
      <div className="space-y-6">
        {contacts.map(c => (
          <div key={c.id} className={`bg-white p-6 md:p-8 rounded-xl shadow-sm border ${c.status === 'neu' ? 'border-primary border-l-4' : 'border-slate-200'}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">{c.name}</h3>
                <a href={`mailto:${c.email}`} className="text-primary text-sm hover:underline font-medium">{c.email}</a>
                <p className="text-xs text-slate-400 mt-1">{new Date(c.created_at).toLocaleString('de-DE')}</p>
              </div>
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.status === 'neu' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>{c.status === 'neu' ? 'Neue Anfrage' : 'Beantwortet'}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 mb-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{c.message}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {c.status === 'neu' && (
                <form action={markAnswered}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">Als "Beantwortet" markieren</button>
                </form>
              )}
              <a href={`mailto:${c.email}?subject=Ihre Anfrage beim KGV-Hohefeld e.V.`} className="bg-secondary/10 text-secondary px-5 py-2.5 rounded-lg font-bold hover:bg-secondary/20 transition-colors">Per E-Mail Antworten</a>
              <form action={deleteContact} className="md:ml-auto">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg font-bold transition-colors">Anfrage Löschen</button>
              </form>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-slate-500 text-center py-12 bg-white rounded-xl border border-slate-200">Keine Kontaktanfragen vorhanden.</p>
        )}
      </div>
    </div>
  )
}
