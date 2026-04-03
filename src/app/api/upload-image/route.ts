import { NextResponse } from 'next/server'

// Upload images and return base64 data URLs
// This API route handles the file processing to avoid Server Action size limits
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ urls: [] })
    }

    const urls: string[] = []
    
    for (const file of files) {
      if (file && file.size > 0) {
        // Limit file size to 5MB
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: `Datei ${file.name} ist zu groß (max. 5 MB)` }, { status: 400 })
        }
        
        const buffer = Buffer.from(await file.arrayBuffer())
        const base64 = buffer.toString('base64')
        const mimeType = file.type || 'image/jpeg'
        urls.push(`data:${mimeType};base64,${base64}`)
      }
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }
}
