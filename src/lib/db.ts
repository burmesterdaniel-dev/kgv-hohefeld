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

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      keys_p256dh TEXT NOT NULL,
      keys_auth TEXT NOT NULL,
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
  } catch (e) {
    console.error("Initialization error:", e)
  }
}

// Call init safely (skip during build to avoid SQLITE_BUSY locks)
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  initDb()
}

export default dbExport
