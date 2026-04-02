'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Photo = {
  id: number
  filepath: string
}

export default function Galerie() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => setPhotos(data.photos || []))
      .catch(console.error)
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setStatus('Lade hoch...')
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        const base64Data = canvas.toDataURL('image/webp', 0.8)
        
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, base64Data })
          })

          if (res.ok) {
            setStatus('Danke! Ihr Foto ruht nun zur kurzen Prüfung beim Vorstand.')
            setFile(null)
            ;(e.target as HTMLFormElement).reset()
          } else {
            setStatus('Fehler beim Upload. Bitte versuchen Sie es erneut.')
          }
        } catch(err) {
          setStatus('Fehler beim Upload. Bitte versuchen Sie es erneut.')
        }
      }
    }
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-8 mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tighter">Bildergalerie</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Ein Blick in unsere grüne Oase. Entdecken Sie die Vielfalt unserer Gärten, die Pracht der jahreszeitlichen Blüten und die lebendige Gemeinschaft im KGV-Hohefeld.
        </p>
      </section>
      
      <section className="max-w-7xl mx-auto px-8 mb-16 flex flex-col md:flex-row gap-8 items-start">
        <form onSubmit={handleUpload} className="bg-surface-container-low p-6 rounded-xl border-l-4 border-secondary max-w-xl flex flex-col gap-4">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary">info</span>
            <div>
              <p className="text-on-surface font-semibold mb-1">So funktioniert der Upload:</p>
              <p className="text-sm text-on-surface-variant leading-snug">
                Laden Sie Ihr Foto hoch, wir prüfen es kurz und stellen es dann online!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input required type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20" />
            <button type="submit" className="bg-secondary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-[1.02] transition-all">Hochladen</button>
          </div>
          {status && <p className="text-sm font-bold text-primary">{status}</p>}
        </form>
      </section>
      
      <div className="max-w-7xl mx-auto px-8 mb-24">
        <div className="columns-3 sm:columns-4 md:columns-5 lg:columns-7 xl:columns-8 gap-3 space-y-3">
        {photos.length === 0 ? <p className="text-on-surface-variant">Noch keine freigegebenen Fotos vorhanden.</p> : null}
        {photos.map(photo => (
          <div key={photo.id} className="relative group overflow-hidden rounded-md bg-surface-container cursor-pointer shadow-sm hover:shadow-md transition-all break-inside-avoid" onClick={() => setSelectedPhoto(photo)}>
            <img src={photo.filepath} alt="Gartenfoto Vorschau" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
            </div>
          </div>
        ))}
        </div>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <img src={selectedPhoto.filepath} alt="Großansicht" className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
