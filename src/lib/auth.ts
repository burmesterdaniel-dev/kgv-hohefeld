import { cookies } from 'next/headers'
import db from './db'

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  
  if (!userId) return null
  
  const user = (await db.execute({ sql: 'SELECT id, username FROM users WHERE id = ?', args: [userId] })).rows[0] as any
  return user || null
}
