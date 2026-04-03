'use client'

import { useState } from 'react'

interface RichTextEditorProps {
  name: string
  placeholder?: string
  defaultValue?: string
}

export default function RichTextEditor({ name, placeholder, defaultValue = '' }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="md:col-span-2 lg:col-span-3">
      <input type="hidden" name={name} value={value} />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="w-full rounded-lg border border-slate-300 p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y bg-white"
      />
      <p className="text-xs text-slate-400 mt-1">HTML-Tags wie &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt; werden unterstützt.</p>
    </div>
  )
}
