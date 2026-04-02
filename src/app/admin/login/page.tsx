import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

export default async function Login({ searchParams }: { searchParams: { error?: string } }) {
  async function loginAction(formData: FormData) {
    'use server'
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    const user = (await db.execute({ sql: 'SELECT id, password_hash FROM users WHERE username = ?', args: [username] })).rows[0] as any
    
    if (user && user.password_hash === password) {
      const cookieStore = await cookies()
      cookieStore.set('auth_session', user.id.toString(), { httpOnly: true, path: '/' })
      redirect('/admin')
    } else {
      redirect('/admin/login?error=1')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100">
      <div className="mb-8">
        <span className="text-2xl font-black text-[#00473d] tracking-tighter uppercase font-headline">KGV-Hohefeld</span>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Admin Login</h2>
        {searchParams?.error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm font-bold text-center">
            Ungültige Zugangsdaten.
          </div>
        )}
        <form action={loginAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">Benutzername</label>
            <input name="username" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-[#3c6a00] outline-none transition-all" placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">Passwort</label>
            <input name="password" type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-[#3c6a00] outline-none transition-all" placeholder="••••••••" />
          </div>
          <button type="submit" className="bg-[#00473d] text-white font-bold py-4 rounded-lg mt-4 hover:bg-[#3c6a00] transition-colors">Einloggen</button>
        </form>
      </div>
    </div>
  )
}
