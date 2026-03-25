import { cookies } from 'next/headers'
import db from './db'

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  
  if (!userId) return null
  
  const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(userId) as any
  return user || null
}
