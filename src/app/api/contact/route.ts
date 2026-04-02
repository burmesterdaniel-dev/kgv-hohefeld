import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()
    const safeSubject = subject || 'Allgemeine Anfrage'
    const token = uuidv4()
    
    // Save to DB
    await db.execute({ sql: 'INSERT INTO contacts (name, email, subject, message, token) VALUES (?, ?, ?, ?, ?)', args: [name as string, email as string, safeSubject, message as string, token] })

    const contactInfo = await db.execute({ sql: 'SELECT id FROM contacts WHERE token = ?', args: [token] })
    const contactId = contactInfo.rows[0].id

    await db.execute({ sql: 'INSERT INTO ticket_messages (contact_id, sender, message) VALUES (?, ?, ?)', args: [contactId as number, 'user', message as string] })

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
