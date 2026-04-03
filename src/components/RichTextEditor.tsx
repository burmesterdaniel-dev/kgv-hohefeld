'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  name: string
  placeholder?: string
  defaultValue?: string
}

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null

  const btnClass = (active: boolean) =>
    `px-2.5 py-1.5 rounded text-sm font-bold transition-colors ${
      active
        ? 'bg-primary text-white'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="flex flex-wrap gap-1.5 p-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Fett">
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Kursiv">
        <em>I</em>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Durchgestrichen">
        <s>S</s>
      </button>
      <span className="w-px bg-slate-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Überschrift">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Unterüberschrift">
        H3
      </button>
      <span className="w-px bg-slate-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Aufzählung">
        • Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Nummerierte Liste">
        1. Liste
      </button>
      <span className="w-px bg-slate-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Zitat">
        ❝ Zitat
      </button>
      <button type="button" onClick={() => {
        const url = window.prompt('Link-URL eingeben:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }} className={btnClass(editor.isActive('link'))} title="Link">
        🔗 Link
      </button>
      <span className="w-px bg-slate-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="px-2.5 py-1.5 rounded text-sm bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Formatierung entfernen">
        ✕ Clear
      </button>
    </div>
  )
}

export default function RichTextEditor({ name, placeholder, defaultValue = '' }: RichTextEditorProps) {
  const [output, setOutput] = useState(defaultValue)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setOutput(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none',
      },
    },
  })

  return (
    <div className="md:col-span-2 lg:col-span-3">
      <input type="hidden" name={name} value={output} />
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
