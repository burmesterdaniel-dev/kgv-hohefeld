import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { sendPushToAll } from '@/lib/push'
import { rateLimit, getClientIp, isHoneypotTriggered } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)

    // Rate limit: max 3 contact requests per IP per minute
    const { allowed } = rateLimit(ip, 3, 60_000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Honeypot check — bots fill hidden fields, real users don't
    if (isHoneypotTriggered(body)) {
      // Pretend success so bots don't adapt
      return NextResponse.json({ success: true, message: 'Ihre Anfrage wurde erfolgreich gesendet.' })
    }

    const { name, email, subject, message } = body
    
    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alle Pflichtfelder müssen ausgefüllt werden.' }, { status: 400 })
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 })
    }

    // Reject suspiciously short or long messages
    if (message.length < 10) {
      return NextResponse.json({ error: 'Ihre Nachricht ist zu kurz. Bitte beschreiben Sie Ihr Anliegen.' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Ihre Nachricht ist zu lang (max. 5000 Zeichen).' }, { status: 400 })
    }

    const safeSubject = subject || 'Allgemeine Anfrage'
    const token = uuidv4()
    
    // Save to DB
    await db.execute({ sql: 'INSERT INTO contacts (name, email, subject, message, token) VALUES (?, ?, ?, ?, ?)', args: [name as string, email as string, safeSubject, message as string, token] })

    const contactInfo = await db.execute({ sql: 'SELECT id FROM contacts WHERE token = ?', args: [token] })
    const contactId = contactInfo.rows[0].id

    await db.execute({ sql: 'INSERT INTO ticket_messages (contact_id, sender, message) VALUES (?, ?, ?)', args: [contactId as number, 'user', message as string] })

    // Simulate Email to Admin
    console.log('\n--- NEUE E-MAIL (SIMULATION) ---')
    console.log(`An: webmaster@kgv-hohefeld.de`)
    console.log(`Betreff: Neue Kontaktanfrage / Support-Ticket von ${name}`)
    console.log(`\nEs liegt eine neue Kontaktanfrage vor. Bitte loggen Sie sich ins Administration-Dashboard ein, um die Anfrage zu beantworten:`)
    console.log(`http://localhost:3001/admin/kontakte`)
    console.log('--------------------------------\n')

    // Send push notification to all admin subscribers
    try {
      await sendPushToAll(
        '📩 Neue Anfrage von ' + name,
        `${safeSubject}: "${(message as string).slice(0, 80)}..."`,
        '/admin/kontakte'
      )
    } catch(e) { console.error('Push failed:', e) }

    return NextResponse.json({ success: true, message: 'Ihre Anfrage wurde erfolgreich gesendet.' })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ error: 'Fehler beim Senden der Anfrage.' }, { status: 500 })
  }
}
