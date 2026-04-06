'use client'

import { useState, useEffect } from 'react'

type Entry = {
  id: number
  name: string
  message: string
  created_at: string
}

export default function Gaestebuch() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const [contactStatus, setContactStatus] = useState('')

  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        setEntries(data.entries || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const honeypot = (form.querySelector('input[name="website"]') as HTMLInputElement)?.value
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message, website: honeypot || '' })
    })
    if (res.ok) {
      const data = await res.json()
      setEntries([data.entry, ...entries])
      setName('')
      setMessage('')
    }
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContactStatus('Sende Anfrage...')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'),
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      setContactStatus('Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns!')
      ;(e.target as HTMLFormElement).reset()
    } else {
      setContactStatus('Fehler beim Senden.')
    }
  }

  return (
    <>
      <header className="max-w-7xl mx-auto px-8 mb-24">
        <h1 className="font-headline text-6xl md:text-7xl font-extrabold text-primary tracking-tighter leading-none mb-6">
          Austausch &amp; <span className="text-secondary italic">Kontakt.</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          Willkommen in unserem digitalen Vereinsheim. Hier können Sie Grüße hinterlassen oder Fragen an den Vorstand stellen.
        </p>
      </header>
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        
        {/* Guestbook Section */}
        <section className="lg:col-span-7 space-y-12">
          <div className="flex items-end justify-between border-b border-outline-variant/20 pb-4">
            <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>book_5</span>
              Besucherbuch
            </h2>
            <span className="text-sm font-label text-on-surface-variant uppercase tracking-widest">{entries.length} Einträge</span>
          </div>
          
          <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2">
            {loading ? <p>Lade Gästebuch...</p> : null}
            {!loading && entries.length === 0 ? <p>Noch keine Einträge. Machen Sie den Anfang!</p> : null}
            {entries.map((entry, index) => (
              <article key={entry.id} className={`${index % 2 === 0 ? 'bg-surface-container-lowest border-l-4 border-secondary' : 'bg-surface-container-low'} p-8 rounded-lg transition-transform hover:-translate-y-1 duration-300 editorial-shadow`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-primary">{entry.name}</h3>
                    <time className="text-xs font-label text-on-surface-variant/70 uppercase tracking-tighter">
                      {new Date(entry.created_at).toLocaleDateString('de-DE')}
                    </time>
                  </div>
                  <span className="material-symbols-outlined text-secondary/30">format_quote</span>
                </div>
                <p className="text-on-surface leading-relaxed">{entry.message}</p>
              </article>
            ))}
          </div>
          
          <div className="bg-primary p-10 rounded-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">edit_note</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-headline text-2xl font-bold mb-6">Nachricht hinterlassen</h3>
              <form onSubmit={handleGuestbookSubmit} className="space-y-4" autoComplete="off">
                {/* Honeypot */}
                <div style={{position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden'}} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-primary-container/50 border-none rounded-DEFAULT py-4 px-6 text-white placeholder:text-on-primary-container focus:ring-2 focus:ring-secondary transition-all" placeholder="Ihr Name" type="text" />
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-primary-container/50 border-none rounded-DEFAULT py-4 px-6 text-white placeholder:text-on-primary-container focus:ring-2 focus:ring-secondary transition-all" placeholder="Ihre Nachricht..." rows={4}></textarea>
                </div>
                <button type="submit" className="bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-white font-bold py-4 px-10 rounded-DEFAULT transition-all flex items-center gap-2 group">
                  Eintragen <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
                </button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <aside className="lg:col-span-5 space-y-16">
          <section className="space-y-8">
            <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">mail</span> Kontakt
            </h2>
            <div className="bg-surface-container-high p-8 rounded-lg">
              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 gap-6" autoComplete="off">
                {/* Honeypot */}
                <div style={{position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden'}} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Name</label>
                  <input name="name" required className="w-full bg-surface-container-lowest border-none rounded-DEFAULT p-4 focus:ring-2 focus:ring-secondary transition-all shadow-sm" type="text"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">E-Mail</label>
                  <input name="email" required className="w-full bg-surface-container-lowest border-none rounded-DEFAULT p-4 focus:ring-2 focus:ring-secondary transition-all shadow-sm" type="email"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nachricht</label>
                  <textarea name="message" required className="w-full bg-surface-container-lowest border-none rounded-DEFAULT p-4 focus:ring-2 focus:ring-secondary transition-all shadow-sm" rows={5}></textarea>
                </div>
                <button type="submit" className="bg-primary text-white font-bold py-4 px-8 rounded-DEFAULT hover:scale-[1.02] transition-transform">Anfrage absenden</button>
                {contactStatus && <p className="text-secondary font-bold">{contactStatus}</p>}
              </form>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
