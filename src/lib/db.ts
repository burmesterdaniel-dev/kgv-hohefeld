import path from 'path'
import fs from 'fs'

const dbDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'kgv.db')

import { createClient } from '@libsql/client'

// Wir konfigurieren den LibSQL Client
// Wenn TURSO_DATABASE_URL existiert, verbindet er sich zur Cloud.
// Sonst nutzt er die lokale SQLite-Datei für die Entwicklung.
export const dbClient = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${dbPath}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// wrapper object that mocks the previous interface minimally for external files if needed,
// but we will actually refactor external files to use db.execute()
const dbExport = dbClient

// Seeding logic (initialization)
async function initDb() {
  await dbClient.executeMultiple(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date_string TEXT NOT NULL,
      description TEXT NOT NULL,
      filepath TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT 'Allgemeine Anfrage',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'neu',
      token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      filepath TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gardens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      number TEXT NOT NULL,
      area INTEGER NOT NULL,
      price INTEGER NOT NULL,
      condition TEXT NOT NULL,
      equipment TEXT NOT NULL,
      description TEXT NOT NULL,
      filepath TEXT NOT NULL,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  try {
    try {
      await dbClient.execute('ALTER TABLE contacts ADD COLUMN token TEXT')
    } catch(e) {}
    try {
      await dbClient.execute('ALTER TABLE contacts ADD COLUMN subject TEXT DEFAULT \'Allgemeine Anfrage\'')
    } catch(e) {}
    
    const userCountResult = await dbClient.execute('SELECT count(*) as count FROM users')
    const count = userCountResult.rows[0].count as number
    if (count === 0) {
      await dbClient.execute({
        sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        args: ['admin', 'admin123']
      })
    }

    const eventCountResult = await dbClient.execute('SELECT count(*) as count FROM events')
    if ((eventCountResult.rows[0].count as number) === 0) {
      await dbClient.execute({ sql: 'INSERT INTO events (title, date_string, description) VALUES (?, ?, ?)', args: ['Frühjahrsfest 2025', '28. April 2025', 'Wir laden alle Mitglieder und Freunde herzlich zu unserem großen Frühjahrsfest ein. Für Speis und Trank ist gesorgt!'] })
      await dbClient.execute({ sql: 'INSERT INTO events (title, date_string, description) VALUES (?, ?, ?)', args: ['Gemeinschaftlicher Arbeitseinsatz', 'Sa. 22. März, 9 Uhr', 'Zusammen machen wir unsere Anlage wieder fit für den Sommer. Jede helfende Hand wird gebraucht und geschätzt.'] })
      await dbClient.execute({ sql: 'INSERT INTO events (title, date_string, description) VALUES (?, ?, ?)', args: ['Neue Parzellen verfügbar', 'Ab sofort', 'Wir haben aktuell wieder freie Gärten in verschiedenen Größen zu vergeben. Schauen Sie in unserer Garten-Börse vorbei!'] })
    }

    const gardensCountResult = await dbClient.execute('SELECT count(*) as count FROM gardens')
    if ((gardensCountResult.rows[0].count as number) === 0) {
      await dbClient.execute({ sql: 'INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: ['Ruhige Lage', '17', 310, 2400, 'Gut gepflegt', 'Laube, Wasseranschluss', 'Top-Garten in ruhiger Lage mit schöner Laube und Wasseranschluss. Diverse Obstbäume und gepflegte Beete.', 'https://images.unsplash.com/photo-1589923188900-85dae5243404?q=80&w=800&auto=format&fit=crop'] })
      await dbClient.execute({ sql: 'INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: ['Ecklage', '34', 420, 3800, 'Neu renoviert', 'Neulaube 2021, Wasseranschluss', 'Fantastische Ecklage mit Neulaube aus dem Jahr 2021 und Wasseranschluss.', 'https://images.unsplash.com/photo-1598511726623-d05903b6d0c4?q=80&w=800&auto=format&fit=crop'] })
      await dbClient.execute({ sql: 'INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: ['Starterpaket', '58', 240, 1200, 'Renovierungsbedürftig', 'Einfache Laube, Wasseranschluss', 'Perfekt für Einsteiger! Kommt mit einfacher Laube und Wasseranschluss.', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e736?q=80&w=800&auto=format&fit=crop'] })
    }

    const checkZoltan = await dbClient.execute('SELECT count(*) as count FROM members WHERE name LIKE "%Zoltan%"')
    if ((checkZoltan.rows[0].count as number) === 0) {
      await dbClient.execute('DELETE FROM members') // Clear out old dummies
      
      const members = [
        { role: '1. Vorsitzender', name: 'Zoltan Wellbrock', description: 'Leitung des Vorstands und rechtliche Vertretung des Vereins nach außen.', filepath: '' },
        { role: '2. Vorsitzende', name: 'Valentina Fuks', description: 'Stellvertretende Leitung und organisatorische Unterstützung.', filepath: '' },
        { role: '1. Kassiererin', name: 'Valentina Tebelius', description: 'Verwaltung der Finanzen und Pachtangelegenheiten.', filepath: '' },
        { role: '1. Schriftführerin', name: 'Anna Fusikova', description: 'Dokumentation und Protokollierung aller Vorstandssitzungen.', filepath: '' },
        { role: '2. Schriftführerin', name: 'Britta Schulze', description: 'Unterstützung in der vereinsinternen Kommunikation.', filepath: '' }
      ]

      for (const m of members) {
        await dbClient.execute({
          sql: 'INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)',
          args: [m.name, m.role, m.filepath, m.description]
        })
      }
    }

  } catch (e) {
    console.error("Seeding error:", e)
  }
}

// Call init safely
initDb()

export default dbExport
