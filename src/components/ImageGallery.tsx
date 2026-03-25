'use client'

import { useState, useEffect, useCallback } from 'react'

export default function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (openIdx === null) return
    if (e.key === 'Escape') setOpenIdx(null)
    if (e.key === 'ArrowRight') setOpenIdx((prev) => (prev! + 1) % images.length)
    if (e.key === 'ArrowLeft') setOpenIdx((prev) => (prev! - 1 + images.length) % images.length)
  }, [openIdx, images.length])

  useEffect(() => {
    if (openIdx !== null) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openIdx, handleKeyDown])

  if (images.length <= 1) return null;

  return (
    <div className="mt-16 pt-12 border-t border-slate-100">
      <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Weitere Impressionen</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div 
            key={img} 
            className="aspect-square rounded-xl overflow-hidden shadow-md bg-slate-100 cursor-pointer group" 
            onClick={() => setOpenIdx(i)}
          >
            <div className="w-full h-full relative">
              <img src={img} alt={`${title} - Foto ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity text-4xl">zoom_in</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 min-h-screen backdrop-blur-sm" onClick={() => setOpenIdx(null)}>
          
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <img 
            src={images[openIdx]} 
            alt={`${title} - Foto groß`} 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl relative z-[105]" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          <div className="mt-6 text-white/50 text-sm tracking-widest uppercase font-bold relative z-[105]">
            Bild {openIdx + 1} von {images.length}
          </div>

          <button 
            className="absolute left-2 md:left-8 inset-y-0 my-auto text-white/50 hover:text-white h-24 w-12 flex items-center justify-center bg-black/30 hover:bg-black/70 rounded-xl transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setOpenIdx((openIdx - 1 + images.length) % images.length); }}
          >
            <span className="material-symbols-outlined text-5xl">chevron_left</span>
          </button>
          <button 
            className="absolute right-2 md:right-8 inset-y-0 my-auto text-white/50 hover:text-white h-24 w-12 flex items-center justify-center bg-black/30 hover:bg-black/70 rounded-xl transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setOpenIdx((openIdx + 1) % images.length); }}
          >
            <span className="material-symbols-outlined text-5xl">chevron_right</span>
          </button>

        </div>
      )}
    </div>
  )
}
