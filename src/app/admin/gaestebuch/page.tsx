import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import ConfirmButton from '@/components/ConfirmButton'

export const dynamic = 'force-dynamic'

export default async function AdminGaestebuch() {
  const entries = (await db.execute('SELECT * FROM guestbook ORDER BY id DESC')).rows as any[]

  async function deleteEntry(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.execute({ sql: 'DELETE FROM guestbook WHERE id = ?', args: [id] })
    revalidatePath('/admin/gaestebuch')
  }

  async function deleteAllEntries() {
    'use server'
    await db.execute('DELETE FROM guestbook')
    revalidatePath('/admin/gaestebuch')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gästebuch verwalten</h2>
          <p className="text-slate-500 text-sm mt-1">{entries.length} Einträge insgesamt</p>
        </div>
        {entries.length > 0 && (
          <ConfirmButton
            action={deleteAllEntries}
            confirmMessage="Wirklich ALLE Gästebuch-Einträge löschen? Diese Aktion kann nicht rückgängig gemacht werden."
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-200"
          >
            🗑️ Alle löschen
          </ConfirmButton>
        )}
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-slate-800">{entry.name}</h3>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(entry.created_at).toLocaleString('de-DE', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.message}</p>
            </div>
            <form action={deleteEntry} className="flex-shrink-0">
              <input type="hidden" name="id" value={entry.id} />
              <button 
                type="submit"
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all group"
                title="Eintrag löschen"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </form>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <span className="text-4xl block mb-4">📝</span>
            <p className="text-slate-500 font-medium">Keine Gästebuch-Einträge vorhanden.</p>
            <p className="text-slate-400 text-sm mt-1">Neue Einträge erscheinen hier automatisch.</p>
          </div>
        )}
      </div>
    </div>
  )
}
