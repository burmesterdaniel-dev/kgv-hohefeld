import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const entries = (await db.execute('SELECT * FROM guestbook ORDER BY id DESC')).rows
    return NextResponse.json({ entries })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, message } = await req.json()
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 })
    }
    
    const info = await db.execute({ sql: 'INSERT INTO guestbook (name, message) VALUES (?, ?)', args: [name, message] })
    const entry = (await db.execute({ sql: 'SELECT * FROM guestbook WHERE id = ?', args: [info.lastInsertRowid!.toString()] })).rows[0]
    
    return NextResponse.json({ entry })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
