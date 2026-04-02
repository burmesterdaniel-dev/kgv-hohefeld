import { NextResponse } from 'next/server'
import db from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { filename, base64Data } = await req.json()
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`

    // Save Base64 string directly in DB as pending instead of public file path
    const info = await db.execute({ 
      sql: 'INSERT INTO photos (filename, filepath, status) VALUES (?, ?, ?)', 
      args: [safeFilename, base64Data, 'pending'] 
    })

    const photoId = info.lastInsertRowid?.toString()

    console.log(`\n============================`)
    console.log(`[MOCK EMAIL] To: vorstand@kgv-hohefeld.test.de`)
    console.log(`FOTO ID: ${photoId}`)
    console.log(`============================\n`)

    return NextResponse.json({ success: true, photoId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
