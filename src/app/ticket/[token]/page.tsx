import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Optional: Metadata can be set here if needed
export const metadata = {
  title: 'Ihr Support-Ticket | KGV Hohefeld',
}

export default async function TicketPage({ params }: { params: { token: string } }) {
  const resolvedParams = await params
  const { token } = resolvedParams

  if (!token) return notFound()

  // Fetch ticket contact info
  const contactInfoResp = await db.execute({ sql: 'SELECT * FROM contacts WHERE token = ?', args: [token] })
  const contact = contactInfoResp.rows[0] as any

  if (!contact) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Ticket nicht gefunden</h2>
        <p className="text-slate-500 mb-8 max-w-md">Dieses Support-Ticket konnte nicht gefunden werden oder der Link ist ungültig.</p>
        <Link href="/kontakt" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">Zurück zum Kontakt</Link>
      </div>
    )
  }

  // Fetch messages thread
  let thread: any[] = []
  try {
    const threadResp = await db.execute({ sql: 'SELECT * FROM ticket_messages WHERE contact_id = ? ORDER BY created_at ASC', args: [contact.id] })
    thread = threadResp.rows
  } catch(e) {}

  async function sendUserReply(formData: FormData) {
    'use server'
    const replyText = formData.get('replyText') as string
    
    // Insert user reply
    await db.execute({ sql: 'INSERT INTO ticket_messages (contact_id, sender, message) VALUES (?, ?, ?)', args: [contact.id, 'user', replyText] })
    
    // Update ticket status so admin sees it
    await db.execute({ sql: "UPDATE contacts SET status = 'wartet_auf_admin' WHERE id = ?", args: [contact.id] })
    
    revalidatePath(`/ticket/${token}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Support-Ticket</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Info */}
          <div className="bg-slate-50 border-b border-slate-100 p-6 md:px-8 md:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold text-lg text-slate-800">{contact.name}</p>
              {contact.subject && contact.subject !== 'Allgemeine Anfrage' && (
                <p className="text-sm font-bold text-primary mt-0.5">{contact.subject}</p>
              )}
              <p className="text-slate-500 text-sm mt-1">Ticket erstellt am {new Date(contact.created_at).toLocaleDateString('de-DE')}</p>
            </div>
            <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${contact.status === 'beantwortet' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
              {contact.status === 'beantwortet' ? 'Vorstand hat geantwortet' : 'Wartet auf Bearbeitung'}
            </span>
          </div>

          {/* Chat History */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            
            {/* The initial request starts the history */}
            <div className="max-w-[85%] self-end">
              <p className="text-xs mb-1 font-bold text-slate-400 text-right pr-2">Ihre ursprüngliche Anfrage</p>
              <div className="p-4 rounded-2xl shadow-sm bg-slate-100 text-slate-700 rounded-tr-none border border-slate-200">
                <p className="whitespace-pre-wrap leading-relaxed">{contact.message}</p>
              </div>
            </div>

            {/* Render actual thread messages */}
            {thread.map((msg) => {
              const isUser = msg.sender === 'user'
              return (
                <div key={msg.id} className={`max-w-[85%] ${isUser ? 'self-end bg-slate-100 text-slate-700 rounded-tr-none border border-slate-200' : 'self-start bg-primary text-white rounded-tl-none border-transparent'} p-4 rounded-2xl shadow-sm`}>
                  <p className={`text-xs mb-1 font-bold ${isUser ? 'text-slate-400' : 'text-primary-100/70'}`}>
                    {isUser ? 'Sie' : 'Vorstand (KGV Hohefeld)'} • {new Date(msg.created_at).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              )
            })}
          </div>

          {/* Reply Form */}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">reply</span>
              Neue Nachricht schreiben
            </h3>
            <form action={sendUserReply} className="flex flex-col gap-4">
              <textarea 
                name="replyText" 
                required 
                rows={3} 
                placeholder="Tippen Sie hier Ihre Rückmeldung an den Vorstand..." 
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-4 bg-white" 
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-md hover:scale-[1.02] transition-transform self-end"
              >
                Absenden
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  )
}
