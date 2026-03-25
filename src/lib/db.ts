import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'kgv.db')
const db = new Database(dbPath)

db.exec(`
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
    password_hash TEXT NOT NULL, -- Für Einfachheit in diesem Projekt Klartext/einfacher Hash
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date_string TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'neu',
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

// Seeding logic
try {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number }
  if (userCount.count === 0) {
    // Standard admin password: 'admin'
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', 'admin123')
  }

  const eventCount = db.prepare('SELECT count(*) as count FROM events').get() as { count: number }
  if (eventCount.count === 0) {
    const insertEvent = db.prepare('INSERT INTO events (title, date_string, description) VALUES (?, ?, ?)')
    insertEvent.run('Frühjahrsfest 2025', '28. April 2025', 'Wir laden alle Mitglieder und Freunde herzlich zu unserem großen Frühjahrsfest ein. Für Speis und Trank ist gesorgt!')
    insertEvent.run('Gemeinschaftlicher Arbeitseinsatz', 'Sa. 22. März, 9 Uhr', 'Zusammen machen wir unsere Anlage wieder fit für den Sommer. Jede helfende Hand wird gebraucht und geschätzt.')
    insertEvent.run('Neue Parzellen verfügbar', 'Ab sofort', 'Wir haben aktuell wieder freie Gärten in verschiedenen Größen zu vergeben. Schauen Sie in unserer Garten-Börse vorbei!')
  }

  const gardensCount = db.prepare('SELECT count(*) as count FROM gardens').get() as { count: number }
  if (gardensCount.count === 0) {
    const insertGarden = db.prepare('INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    insertGarden.run('Ruhige Lage', '17', 310, 2400, 'Gut gepflegt', 'Laube, Wasseranschluss', 'Top-Garten in ruhiger Lage mit schöner Laube und Wasseranschluss. Diverse Obstbäume und gepflegte Beete.', 'https://images.unsplash.com/photo-1589923188900-85dae5243404?q=80&w=800&auto=format&fit=crop')
    insertGarden.run('Ecklage', '34', 420, 3800, 'Neu renoviert', 'Neulaube 2021, Wasseranschluss', 'Fantastische Ecklage mit Neulaube aus dem Jahr 2021 und Wasseranschluss.', 'https://images.unsplash.com/photo-1598511726623-d05903b6d0c4?q=80&w=800&auto=format&fit=crop')
    insertGarden.run('Starterpaket', '58', 240, 1200, 'Renovierungsbedürftig', 'Einfache Laube, Wasseranschluss', 'Perfekt für Einsteiger! Kommt mit einfacher Laube und Wasseranschluss.', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e736?q=80&w=800&auto=format&fit=crop')
  }

  const membersCount = db.prepare('SELECT count(*) as count FROM members').get() as { count: number }
  if (membersCount.count === 0) {
    const insertMember = db.prepare('INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)')
    insertMember.run('Klaus Meier', '1. Vorsitzender', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop', 'Klaus ist seit 20 Jahren im Verein und organisiert unsere Vereinsfeste.')
    insertMember.run('Sabine Schmidt', '2. Vorsitzende / Kassenwartin', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=crop', 'Sabine kümmert sich um die Finanzen und die Gärtenvergabe.')
    insertMember.run('Dieter Krause', 'Schriftführer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop', 'Dieter dokumentiert unsere Versammlungen und verwaltet die Website.')
  }

  // Migration for new column
  try {
    db.exec("ALTER TABLE events ADD COLUMN filepath TEXT DEFAULT ''")
  } catch(e) {
    // column already exists
  }
} catch (e) {
  console.error("Seeding error:", e)
}

export default db
