import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    await db.execute('DELETE FROM members');

    const members = [
      { role: '1. Vorsitzender', name: 'Zoltan Wellbrock', description: 'Leitung des Vorstands und rechtliche Vertretung des Vereins nach außen.', filepath: '' },
      { role: '2. Vorsitzende', name: 'Valentina Fuks', description: 'Stellvertretende Leitung und organisatorische Unterstützung.', filepath: '' },
      { role: '1. Kassiererin', name: 'Valentina Tebelius', description: 'Verwaltung der Finanzen und Pachtangelegenheiten.', filepath: '' },
      { role: '1. Schriftführerin', name: 'Anna Fusikova', description: 'Dokumentation und Protokollierung aller Vorstandssitzungen.', filepath: '' },
      { role: '2. Schriftführerin', name: 'Britta Schulze', description: 'Unterstützung in der vereinsinternen Kommunikation.', filepath: '' }
    ];

    for (const m of members) {
      await db.execute({
        sql: 'INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)',
        args: [m.name, m.role, m.filepath, m.description]
      });
    }

    const check = await db.execute('SELECT * FROM members');

    return NextResponse.json({ success: true, count: check.rows.length, rows: check.rows })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
