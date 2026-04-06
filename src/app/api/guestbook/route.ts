import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { rateLimit, getClientIp, isHoneypotTriggered } from '@/lib/rate-limit'

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
    const ip = getClientIp(req)

    // Rate limit: max 5 guestbook entries per IP per minute
    const { allowed } = rateLimit(ip, 5, 60_000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Zu viele Einträge. Bitte warten Sie einen Moment.' },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Honeypot check
    if (isHoneypotTriggered(body)) {
      // Fake success for bots
      return NextResponse.json({ entry: { id: 0, name: body.name, message: body.message, created_at: new Date().toISOString() } })
    }

    const { name, message } = body
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 })
    }

    // Reject very short messages (likely spam)
    if (name.length < 2 || message.length < 3) {
      return NextResponse.json({ error: 'Name oder Nachricht zu kurz.' }, { status: 400 })
    }

    // Reject excessively long content
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: 'Eingabe zu lang.' }, { status: 400 })
    }
    
    const info = await db.execute({ sql: 'INSERT INTO guestbook (name, message) VALUES (?, ?)', args: [name, message] })
    const entry = (await db.execute({ sql: 'SELECT * FROM guestbook WHERE id = ?', args: [info.lastInsertRowid!.toString()] })).rows[0]
    
    return NextResponse.json({ entry })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
