import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const tablePromises = [
      db.execute('DELETE FROM events WHERE id NOT IN (SELECT MIN(id) FROM events GROUP BY title, date_string)'),
      db.execute('DELETE FROM gardens WHERE id NOT IN (SELECT MIN(id) FROM gardens GROUP BY title, area)'),
      db.execute('DELETE FROM photos WHERE id NOT IN (SELECT MIN(id) FROM photos GROUP BY filepath)'),
      db.execute('DELETE FROM guestbook WHERE id NOT IN (SELECT MIN(id) FROM guestbook GROUP BY author, text)')
    ];

    await Promise.all(tablePromises);

    return NextResponse.json({ success: true, message: 'All duplicate seed data removed across tables' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
