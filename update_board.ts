import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd()) // Loads .env.local and .env
import db from './src/lib/db'

async function run() {
  console.log('Clearing old members...')
  await db.execute('DELETE FROM members')

  const members = [
    { role: '1. Vorsitzender', name: 'Zoltan Wellbrock', description: 'Leitung des Vorstands und rechtliche Vertretung des Vereins nach außen.', filepath: '' },
    { role: '2. Vorsitzende', name: 'Valentina Fuks', description: 'Stellvertretende Leitung und organisatorische Unterstützung.', filepath: '' },
    { role: '1. Kassiererin', name: 'Valentina Tebelius', description: 'Verwaltung der Finanzen und Pachtangelegenheiten.', filepath: '' },
    { role: '1. Schriftführerin', name: 'Anna Fusikova', description: 'Dokumentation und Protokollierung aller Vorstandssitzungen.', filepath: '' },
    { role: '2. Schriftführerin', name: 'Britta Schulze', description: 'Unterstützung in der vereinsinternen Kommunikation.', filepath: '' }
  ]

  for (const m of members) {
    await db.execute({
      sql: 'INSERT INTO members (name, role, description, filepath) VALUES (?, ?, ?, ?)',
      args: [m.name, m.role, m.description, m.filepath]
    })
    console.log('Added:', m.name)
  }
  
  console.log('Done!')
}

run()
