import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const photos = db.prepare('SELECT id, filepath FROM photos WHERE status = ? ORDER BY id DESC').all('approved')
    return NextResponse.json({ photos })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}
