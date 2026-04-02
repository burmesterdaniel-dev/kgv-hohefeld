import os

replacements = {
    "src/lib/auth.ts": [
        ("db.prepare('SELECT id, username FROM users WHERE id = ?').get(userId)", "(await db.execute({ sql: 'SELECT id, username FROM users WHERE id = ?', args: [userId] })).rows[0]")
    ],
    "src/app/vorstand/page.tsx": [
        ("export default function Vorstand(", "export default async function Vorstand("),
        ("db.prepare('SELECT * FROM members ORDER BY id ASC').all()", "(await db.execute('SELECT * FROM members ORDER BY id ASC')).rows")
    ],
    "src/app/page.tsx": [
        ("export default function Home(", "export default async function Home("),
        ("db.prepare('SELECT * FROM events ORDER BY created_at DESC LIMIT 3').all()", "(await db.execute('SELECT * FROM events ORDER BY created_at DESC LIMIT 3')).rows")
    ],
    "src/app/verkauf/page.tsx": [
        ("export default function Verkauf(", "export default async function Verkauf("),
        ("db.prepare('SELECT * FROM gardens WHERE status != \\'sold\\' ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM gardens WHERE status != \\'sold\\' ORDER BY created_at DESC')).rows")
    ],
    "src/app/verkauf/[id]/page.tsx": [
        ("db.prepare('SELECT title, number FROM gardens WHERE id = ?').get(resolvedParams.id)", "(await db.execute({ sql: 'SELECT title, number FROM gardens WHERE id = ?', args: [resolvedParams.id] })).rows[0]"),
        ("db.prepare('SELECT * FROM gardens WHERE id = ?').get(resolvedParams.id)", "(await db.execute({ sql: 'SELECT * FROM gardens WHERE id = ?', args: [resolvedParams.id] })).rows[0]")
    ],
    "src/app/api/guestbook/route.ts": [
        ("db.prepare('SELECT * FROM guestbook ORDER BY id DESC').all()", "(await db.execute('SELECT * FROM guestbook ORDER BY id DESC')).rows"),
        ("db.prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)').run(name, message)", "await db.execute({ sql: 'INSERT INTO guestbook (name, message) VALUES (?, ?)', args: [name, message] })"),
        ("db.prepare('SELECT * FROM guestbook WHERE id = ?').get(info.lastInsertRowid)", "(await db.execute({ sql: 'SELECT * FROM guestbook WHERE id = ?', args: [info.lastInsertRowid.toString()] })).rows[0]")
    ],
    "src/app/api/upload/route.ts": [
        ("db.prepare('INSERT INTO photos (filename, filepath, status) VALUES (?, ?, ?)').run(filename, publicPath, 'pending')", "await db.execute({ sql: 'INSERT INTO photos (filename, filepath, status) VALUES (?, ?, ?)', args: [filename, publicPath, 'pending'] })")
    ],
    "src/app/api/photos/route.ts": [
        ("db.prepare('SELECT id, filepath FROM photos WHERE status = ? ORDER BY id DESC').all('approved')", "(await db.execute({ sql: 'SELECT id, filepath FROM photos WHERE status = ? ORDER BY id DESC', args: ['approved'] })).rows")
    ],
    "src/app/api/contact/route.ts": [
        ("const insert = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)')\n    insert.run(body.name, body.email, body.message)", "await db.execute({ sql: 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', args: [body.name, body.email, body.message] })")
    ],
    "src/app/api/approve/route.ts": [
        ("db.prepare(\"UPDATE photos SET status = 'approved' WHERE id = ?\").run(id)", "await db.execute({ sql: \"UPDATE photos SET status = 'approved' WHERE id = ?\", args: [id] })")
    ],
    "src/app/aktuelles/page.tsx": [
        ("export default function Aktuelles(", "export default async function Aktuelles("),
        ("db.prepare('SELECT * FROM events ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM events ORDER BY created_at DESC')).rows")
    ],
    "src/app/aktuelles/[id]/page.tsx": [
        ("db.prepare('SELECT title FROM events WHERE id = ?').get(resolvedParams.id)", "(await db.execute({ sql: 'SELECT title FROM events WHERE id = ?', args: [resolvedParams.id] })).rows[0]"),
        ("db.prepare('SELECT * FROM events WHERE id = ?').get(resolvedParams.id)", "(await db.execute({ sql: 'SELECT * FROM events WHERE id = ?', args: [resolvedParams.id] })).rows[0]")
    ],
    "src/app/admin/gaerten/page.tsx": [
        ("export default function AdminGaerten(", "export default async function AdminGaerten("),
        ("db.prepare('SELECT * FROM gardens ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM gardens ORDER BY created_at DESC')).rows"),
        ("db.prepare('INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(title, number, area, price, condition, equipment, description, filepath)", "await db.execute({ sql: 'INSERT INTO gardens (title, number, area, price, condition, equipment, description, filepath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: [title, number, area, price, condition, equipment, description, filepath] })"),
        ("db.prepare('UPDATE gardens SET status = ? WHERE id = ?').run(status, id)", "await db.execute({ sql: 'UPDATE gardens SET status = ? WHERE id = ?', args: [status, id] })"),
        ("db.prepare('DELETE FROM gardens WHERE id = ?').run(id)", "await db.execute({ sql: 'DELETE FROM gardens WHERE id = ?', args: [id] })")
    ],
    "src/app/admin/page.tsx": [
        ("export default function AdminDashboard(", "export default async function AdminDashboard("),
        ("db.prepare(\"SELECT count(*) as c FROM contacts WHERE status = 'neu'\").get()", "(await db.execute(\"SELECT count(*) as c FROM contacts WHERE status = 'neu'\")).rows[0]"),
        ("db.prepare(\"SELECT count(*) as c FROM photos WHERE status = 'pending'\").get()", "(await db.execute(\"SELECT count(*) as c FROM photos WHERE status = 'pending'\")).rows[0]"),
        ("db.prepare(\"SELECT count(*) as c FROM gardens WHERE status = 'available'\").get()", "(await db.execute(\"SELECT count(*) as c FROM gardens WHERE status = 'available'\")).rows[0]"),
        ("db.prepare(\"SELECT count(*) as c FROM events\").get()", "(await db.execute(\"SELECT count(*) as c FROM events\")).rows[0]")
    ],
    "src/app/admin/users/page.tsx": [
        ("export default function AdminUsers(", "export default async function AdminUsers("),
        ("db.prepare('SELECT * FROM users ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM users ORDER BY created_at DESC')).rows"),
        ("db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, pw)", "await db.execute({ sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)', args: [username, pw] })"),
        ("db.prepare('DELETE FROM users WHERE id = ?').run(formData.get('id'))", "await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [formData.get('id')] })")
    ],
    "src/app/admin/login/page.tsx": [
        ("export default function Login(", "export default async function Login("),
        ("db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(username)", "(await db.execute({ sql: 'SELECT id, password_hash FROM users WHERE username = ?', args: [username] })).rows[0]")
    ],
    "src/app/admin/mitglieder/page.tsx": [
        ("export default function AdminMitglieder(", "export default async function AdminMitglieder("),
        ("db.prepare('SELECT * FROM members ORDER BY id ASC').all()", "(await db.execute('SELECT * FROM members ORDER BY id ASC')).rows"),
        ("db.prepare('INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)').run(name, role, filepath, description)", "await db.execute({ sql: 'INSERT INTO members (name, role, filepath, description) VALUES (?, ?, ?, ?)', args: [name, role, filepath, description] })"),
        ("db.prepare('DELETE FROM members WHERE id = ?').run(id)", "await db.execute({ sql: 'DELETE FROM members WHERE id = ?', args: [id] })")
    ],
    "src/app/admin/kontakte/page.tsx": [
        ("export default function AdminKontakte(", "export default async function AdminKontakte("),
        ("db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM contacts ORDER BY created_at DESC')).rows"),
        ("db.prepare(\"UPDATE contacts SET status = 'beantwortet' WHERE id = ?\").run(formData.get('id'))", "await db.execute({ sql: \"UPDATE contacts SET status = 'beantwortet' WHERE id = ?\", args: [formData.get('id')] })"),
        ("db.prepare(\"DELETE FROM contacts WHERE id = ?\").run(formData.get('id'))", "await db.execute({ sql: \"DELETE FROM contacts WHERE id = ?\", args: [formData.get('id')] })")
    ],
    "src/app/admin/fotos/page.tsx": [
        ("export default function AdminFotos(", "export default async function AdminFotos("),
        ("db.prepare('SELECT * FROM photos ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM photos ORDER BY created_at DESC')).rows"),
        ("db.prepare(\"UPDATE photos SET status = 'approved' WHERE id = ?\").run(formData.get('id'))", "await db.execute({ sql: \"UPDATE photos SET status = 'approved' WHERE id = ?\", args: [formData.get('id')] })"),
        ("db.prepare(\"DELETE FROM photos WHERE id = ?\").run(formData.get('id'))", "await db.execute({ sql: \"DELETE FROM photos WHERE id = ?\", args: [formData.get('id')] })")
    ],
    "src/app/admin/events/page.tsx": [
        ("export default function AdminEvents(", "export default async function AdminEvents("),
        ("db.prepare('SELECT * FROM events ORDER BY created_at DESC').all()", "(await db.execute('SELECT * FROM events ORDER BY created_at DESC')).rows"),
        ("db.prepare('INSERT INTO events (title, date_string, description, filepath) VALUES (?, ?, ?, ?)').run(title, date_string, description, filepath)", "await db.execute({ sql: 'INSERT INTO events (title, date_string, description, filepath) VALUES (?, ?, ?, ?)', args: [title, date_string, description, filepath] })"),
        ("db.prepare('DELETE FROM events WHERE id = ?').run(id)", "await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id] })")
    ]
}

def clean_file(path_part):
    full_path = os.path.join("c:\\Users\\danie\\OneDrive\\Downloads\\kgv", path_part.replace("/", "\\"))
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        return
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for orig, rep in replacements[path_part]:
        if orig in content:
            content = content.replace(orig, rep)
            print(f"Replaced in {path_part}")
        else:
            print(f"Warning: could not find {orig} in {path_part}")

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

for path_part in replacements.keys():
    clean_file(path_part)
