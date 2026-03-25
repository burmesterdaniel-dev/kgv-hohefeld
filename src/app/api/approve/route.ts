import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    db.prepare("UPDATE photos SET status = 'approved' WHERE id = ?").run(id)
    
    return new NextResponse(`
      <html>
        <head>
          <title>Foto freigegeben</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Outfit', sans-serif; text-align: center; padding: 50px; background-color: #E8F5E9; color: #2E7D32; }
            a { color: #D22630; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Erfolg!</h1>
          <p>Das Foto wurde erfolgreich freigegeben und ist nun in der öffentlichen Galerie sichtbar.</p>
          <a href="/galerie">Zur Galerie gehen</a>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 })
  }
}
