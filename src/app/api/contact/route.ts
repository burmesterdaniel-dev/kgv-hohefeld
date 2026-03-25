import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    
    // Save to DB
    const insert = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)')
    insert.run(name, email, message)

    // Simulate Email to Admin
    console.log('\n--- NEUE E-MAIL (SIMULATION) ---')
    console.log(`An: vorstand@kgv-hohefeld.de`)
    console.log(`Betreff: Neue Kontaktanfrage / Support-Ticket von ${name}`)
    console.log(`\nEs liegt eine neue Kontaktanfrage vor. Bitte loggen Sie sich ins Administration-Dashboard ein, um die Anfrage zu beantworten:`)
    console.log(`http://localhost:3001/admin/kontakte`)
    console.log('--------------------------------\n')

    return NextResponse.json({ success: true, message: 'Ihre Anfrage wurde erfolgreich gesendet.' })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ error: 'Fehler beim Senden der Anfrage.' }, { status: 500 })
  }
}
