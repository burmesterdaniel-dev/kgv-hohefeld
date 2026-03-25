'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamischer Import ohne SSR, da React Quill das window/document Objekt benötigt
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  name: string
  placeholder?: string
  defaultValue?: string
}

export default function RichTextEditor({ name, placeholder, defaultValue = '' }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  }

  return (
    <div className="md:col-span-2 lg:col-span-3">
      {/* Verborgenes Feld, damit das Formular den Inhalt per FormData normal übertragen kann */}
      <input type="hidden" name={name} value={value} />
      
      {mounted ? (
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            modules={modules}
            className="h-64 mb-12 custom-quill" // margin-bottom wg. Quill Toolbar/Content Overflow
          />
        </div>
      ) : (
        <div className="h-[256px] w-full border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
          Lade Editor...
        </div>
      )}
    </div>
  )
}
