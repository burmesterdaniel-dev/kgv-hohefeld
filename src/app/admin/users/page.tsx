import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export default function AdminUsers() {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as any[]

  async function addUser(formData: FormData) {
    'use server'
    const username = formData.get('username') as string
    const pw = formData.get('password') as string
    try {
      db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, pw)
      revalidatePath('/admin/users')
    } catch(e) {} // ignore unique constraint errors in demo
  }

  async function deleteUser(formData: FormData) {
    'use server'
    db.prepare('DELETE FROM users WHERE id = ?').run(formData.get('id'))
    revalidatePath('/admin/users')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Admin-Zugänge verwalten</h2>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Neuen Administrator anlegen</h3>
        <form action={addUser} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wide">Benutzername</label>
            <input name="username" required className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wide">Passwort</label>
            <input type="password" name="password" required className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 w-full md:w-auto shadow-md">Zugang erstellen</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600 text-sm">ID</th>
              <th className="p-4 font-bold text-slate-600 text-sm">Benutzername</th>
              <th className="p-4 font-bold text-slate-600 text-sm">Erstellt am</th>
              <th className="p-4 font-bold text-slate-600 text-sm">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-slate-500">{u.id}</td>
                <td className="p-4 font-bold text-slate-800 flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-sm">shield_person</span> {u.username}</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(u.created_at).toLocaleDateString('de-DE')}</td>
                <td className="p-4">
                  {u.username !== 'admin' && (
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="text-red-500 font-bold text-sm bg-red-50 py-1.5 px-4 rounded-md hover:bg-red-100 transition-colors">Entfernen</button>
                    </form>
                  )}
                  {u.username === 'admin' && <span className="text-xs text-slate-400 font-medium">Primärer Admin (geschützt)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
