'use client'

import { useState, useEffect } from 'react'

export default function Kontakt() {
  const [status, setStatus] = useState('')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('subject')) {
      setSubject(params.get('subject') as string)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('Sende Anfrage...')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setStatus('Vielen Dank! Ihre Anfrage wurde erfolgreich an den Vorstand gesendet.')
        ;(e.target as HTMLFormElement).reset()
      } else {
        setStatus('Fehler beim Senden der Anfrage. Bitte probieren Sie es später erneut.')
      }
    } catch(err) {
      setStatus('Ein Netzwerkfehler ist aufgetreten.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-8 mb-24" style={{paddingTop: '2rem'}}>
      <h1 className="text-5xl font-extrabold text-[#00473d] mb-6">Kontakt</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">Haben Sie Fragen, Anliegen oder möchten Sie sich für eine freie Parzelle bewerben? Wenden Sie sich gerne an den Vorstand. Wir helfen Ihnen weiter!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="card p-8 bg-white rounded-xl shadow-md border-t-4 border-[#3c6a00]">
          <h2 className="text-2xl font-bold text-[#00473d] mb-6">Nachricht senden</h2>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#191c1a'}}>Name</label>
              <input name="name" required type="text" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} />
            </div>
            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#191c1a'}}>E-Mail Adresse</label>
              <input name="email" required type="email" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} />
            </div>
            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#191c1a'}}>Betreff / Worum geht es?</label>
              <input name="subject" required type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="z. B. Allgemeine Anfrage" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} />
            </div>
            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#191c1a'}}>Ihre Nachricht</label>
              <textarea name="message" required rows={5} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical'}}></textarea>
            </div>
            <button type="submit" className="bg-[#3c6a00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#00473d] transition-colors shadow-md mt-4">Nachricht Senden</button>
            
            {status && (
              <div style={{
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: 'rgba(60, 106, 0, 0.1)', 
                color: '#00473d', 
                borderRadius: '8px',
                fontWeight: 600
              }}>
                {status}
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-[#f7faf5] p-8 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#00473d] mb-4">Vereinsdaten & Kontakt</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#3c6a00]">business</span>
                <div>
                  <strong>KGV-Hohe-Feld-Huchting e.V.</strong><br/>
                  Kleingartenverein Hohe-Feld-Huchting e.V. Bremen
                </div>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#3c6a00]">location_on</span>
                <div>
                  An der Leeuwarder Straße<br/>
                  28259 Bremen
                </div>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#3c6a00]">mail</span>
                <a href="mailto:webmaster@kgv-hohefeld.de" className="hover:text-[#3c6a00] transition-colors">webmaster@kgv-hohefeld.de</a>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#3c6a00]">call</span>
                <span>0421 – 123 456 78</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#f7faf5] p-8 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#00473d] mb-4">Sprechzeiten (Saison)</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-[#3c6a00]">schedule</span>
                <span>Samstag: 10:00 – 12:00 Uhr</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-[#3c6a00]">schedule</span>
                <span>Sonntag: 10:00 – 12:00 Uhr</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">Besuchen Sie uns doch einfach im Vereinshaus!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
