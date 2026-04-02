import { NextResponse } from 'next/server'
import db from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    const filepath = path.join(uploadDir, filename)
    fs.writeFileSync(filepath, buffer)

    const publicPath = `/uploads/${filename}`

    // Save to DB as pending
    const info = await db.execute({ sql: 'INSERT INTO photos (filename, filepath, status) VALUES (?, ?, ?)', args: [filename, publicPath, 'pending'] })
    const photoId = info.lastInsertRowid

    // Mock Email Send
    console.log(`\n============================`)
    console.log(`[MOCK EMAIL] To: vorstand@kgv-hohefeld.de`)
    console.log(`Betreff: Neues Foto zur Freigabe`)
    console.log(`Ein neues Foto wurde hochgeladen.`)
    console.log(`Bitte loggen Sie sich in das Admin-Dashboard ein, um es zu prüfen:`)
    console.log(`http://localhost:3001/admin/fotos`)
    console.log(`============================\n`)

    return NextResponse.json({ success: true, photoId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
