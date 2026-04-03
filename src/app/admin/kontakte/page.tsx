import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function AdminKontakte() {
  const contacts = (await db.execute('SELECT * FROM contacts ORDER BY created_at DESC')).rows as any[]
  
  let allMessages: any[] = []
  try {
    allMessages = (await db.execute('SELECT * FROM ticket_messages ORDER BY created_at ASC')).rows as any[]
  } catch(e) {
    // If ticket_messages doesnt exist yet, it will be handled gracefully.
  }

  async function sendAdminReply(formData: FormData) {
    'use server'
    const contactId = formData.get('contact_id') as string
    const replyText = formData.get('replyText') as string
    
    // 1. Hole Kontakt info (Email, Token)
    const contactInfoResp = await db.execute({ sql: 'SELECT name, email, token FROM contacts WHERE id = ?', args: [contactId] })
    const contactInfo = contactInfoResp.rows[0]
    
    // 2. Speichere Nachricht
    await db.execute({ sql: 'INSERT INTO ticket_messages (contact_id, sender, message) VALUES (?, ?, ?)', args: [contactId, 'admin', replyText] })
    
    // 3. Setze Status
    await db.execute({ sql: "UPDATE contacts SET status = 'beantwortet' WHERE id = ?", args: [contactId] })
    
    // 4. Sende Email via Resend
    try {
      await resend.emails.send({
        from: `KGV Hohefeld Support <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: contactInfo.email as string,
        subject: 'Antwort auf Ihre Anfrage (KGV Hohefeld)',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #3c6a00;">Neue Nachricht vom Vorstand</h2>
            <p>Hallo ${contactInfo.name},</p>
            <p>Der Vorstand des KGV-Hohefeld e.V. hat auf Ihre Nachricht geantwortet.</p>
            <p>Klicken Sie auf den folgenden Link, um den Chatverlauf zu sehen und direkt zu antworten:</p>
            <br/>
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ticket/${contactInfo.token}" style="background-color: #3c6a00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Zum Ticket-Portal</a>
            </p>
            <br/>
            <p style="font-size: 12px; color: #777;">Dies ist eine automatisch generierte E-Mail. Bitte antworten Sie nicht direkt auf diese E-Mail, sondern verwenden Sie den Link.</p>
          </div>
        `
      })
    } catch(e) {
      console.error('Email send failed', e)
    }

    revalidatePath('/admin/kontakte')
  }

  async function deleteContact(formData: FormData) {
    'use server'
    const contactId = formData.get('contact_id') as string

    await db.execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [contactId] })
    await db.execute({ sql: "DELETE FROM ticket_messages WHERE contact_id = ?", args: [contactId] })
    revalidatePath('/admin/kontakte')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Support Tickets & Kontaktanfragen</h2>
      <div className="space-y-6">
        {contacts.map(c => {
          const thread = allMessages.filter(m => m.contact_id === c.id)
          return (
            <details key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 group overflow-hidden" open={c.status === 'neu' || c.status === 'wartet_auf_admin'}>
              <summary className="p-6 md:p-8 cursor-pointer list-none flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl text-slate-800">{c.name} <span className="text-sm font-normal text-slate-500 block sm:inline">— {c.subject || 'Allgemeine Anfrage'}</span></h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full w-max ${c.status === 'neu' || c.status === 'wartet_auf_admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      {c.status === 'neu' ? 'Neue Anfrage' : c.status === 'wartet_auf_admin' ? 'Neue Antwort vom Nutzer' : 'Beantwortet'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{c.email} • {new Date(c.created_at).toLocaleString('de-DE')}</p>
                </div>
                <div className="text-primary group-open:hidden border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm bg-white">
                  Chat ausklappen
                </div>
              </summary>
              
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50">
                {/* Chat History */}
                <div className="flex flex-col gap-4 mb-6">
                  {thread.length > 0 ? thread.map((msg: any) => (
                    <div key={msg.id} className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.sender === 'admin' ? 'bg-primary text-white self-end rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 self-start rounded-tl-none'}`}>
                      <p className={`text-xs mb-1 font-bold ${msg.sender === 'admin' ? 'text-primary-100/70' : 'text-slate-400'}`}>{msg.sender === 'admin' ? 'Vorstand (Sie)' : c.name} • {new Date(msg.created_at).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  )) : (
                    // Fallback for legacy contact messages before the ticket table existed
                    <div className="max-w-[85%] p-4 rounded-2xl shadow-sm bg-white border border-slate-200 text-slate-700 self-start rounded-tl-none">
                      <p className="text-xs mb-1 font-bold text-slate-400">{c.name} • Initial</p>
                      <p className="whitespace-pre-wrap leading-relaxed">{c.message}</p>
                    </div>
                  )}
                </div>

                {/* Rely Form */}
                <form action={sendAdminReply} className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-4">
                  <input type="hidden" name="contact_id" value={c.id} />
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Antwort an {c.name} senden</label>
                    <textarea name="replyText" required rows={4} placeholder="Tippen Sie hier Ihre Rückmeldung an den Gartennutzer..." className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-4" />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button formAction={deleteContact} className="text-red-500 text-sm hover:underline font-semibold text-left">
                      Gesamtes Ticket löschen
                    </button>
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow hover:scale-[1.02] transition-transform">
                      Antworten & Email senden
                    </button>
                  </div>
                </form>
              </div>
            </details>
          )
        })}
        {contacts.length === 0 && (
          <p className="text-slate-500 text-center py-12 bg-white rounded-xl border border-slate-200">Keine Support-Tickets vorhanden.</p>
        )}
      </div>
    </div>
  )
}
