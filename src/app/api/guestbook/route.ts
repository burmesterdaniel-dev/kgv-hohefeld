import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const entries = db.prepare('SELECT * FROM guestbook ORDER BY id DESC').all()
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
    
    const info = db.prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)').run(name, message)
    const entry = db.prepare('SELECT * FROM guestbook WHERE id = ?').get(info.lastInsertRowid)
    
    return NextResponse.json({ entry })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
