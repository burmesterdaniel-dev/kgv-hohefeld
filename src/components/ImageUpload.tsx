'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  name: string
  label?: string
  multiple?: boolean
  maxSizeMB?: number
}

export default function ImageUpload({ name, label = 'Bild hochladen', multiple = false, maxSizeMB = 10 }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [dataUrls, setDataUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function compressAndConvert(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          // Resize to max 1600px width/height for good quality while keeping size reasonable
          const maxDim = 1600
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim
              width = maxDim
            } else {
              width = (width / height) * maxDim
              height = maxDim
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          // Compress as JPEG at 80% quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(dataUrl)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    setError('')

    try {
      const newPreviews: string[] = []
      const newDataUrls: string[] = []

      for (const file of Array.from(files)) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`${file.name} ist zu groß (max. ${maxSizeMB} MB)`)
          continue
        }
        const dataUrl = await compressAndConvert(file)
        newPreviews.push(dataUrl)
        newDataUrls.push(dataUrl)
      }

      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews])
        setDataUrls(prev => [...prev, ...newDataUrls])
      } else {
        setPreviews(newPreviews.slice(0, 1))
        setDataUrls(newDataUrls.slice(0, 1))
      }
    } catch (err) {
      setError('Fehler beim Verarbeiten der Bilder')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function removeImage(index: number) {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setDataUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Store the data URL(s) in a hidden input for the form submission
  const hiddenValue = multiple ? JSON.stringify(dataUrls) : (dataUrls[0] || '')

  return (
    <div className="md:col-span-2 lg:col-span-3">
      <input type="hidden" name={name} value={hiddenValue} />
      <label className="block text-sm font-bold text-slate-600 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-slate-50"
      />
      
      {loading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
          Bild wird verarbeitet...
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {previews.map((p, i) => (
            <div key={i} className="relative group">
              <img src={p} alt="Vorschau" className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
