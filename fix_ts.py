import os
import re

fixes = {
    "src/app/admin/events/page.tsx": [
        ("args: [id]", "args: [id as string]")
    ],
    "src/app/admin/fotos/page.tsx": [
        ("args: [formData.get('id')]", "args: [formData.get('id') as string]")
    ],
    "src/app/admin/gaerten/page.tsx": [
        ("args: [status, id]", "args: [status as string, id as string]"),
        ("args: [id]", "args: [id as string]")
    ],
    "src/app/admin/kontakte/page.tsx": [
        ("args: [formData.get('id')]", "args: [formData.get('id') as string]")
    ],
    "src/app/admin/mitglieder/page.tsx": [
        ("args: [id]", "args: [id as string]")
    ],
    "src/app/admin/users/page.tsx": [
        ("args: [formData.get('id')]", "args: [formData.get('id') as string]")
    ],
    "src/app/admin/page.tsx": [
        ("as {c: number}", "as unknown as {c: number}")
    ],
    "src/app/api/guestbook/route.ts": [
        ("info.lastInsertRowid.toString()", "info.lastInsertRowid!.toString()")
    ]
}

def clean_file(path_part):
    full_path = os.path.join("c:\\Users\\danie\\OneDrive\\Downloads\\kgv", path_part.replace("/", "\\"))
    if not os.path.exists(full_path):
        return
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for orig, rep in fixes.get(path_part, []):
        content = content.replace(orig, rep)

    if path_part == "src/app/api/contact/route.ts":
        content = re.sub(r"const insert = db\.prepare\('INSERT INTO contacts \(name, email, message\) VALUES \(\?, \?, \?\)'\).*?insert\.run\(body\.name, body\.email, body\.message\)", "await db.execute({ sql: 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', args: [body.name as string, body.email as string, body.message as string] })", content, flags=re.DOTALL)

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

for path_part in fixes.keys():
    clean_file(path_part)
clean_file("src/app/api/contact/route.ts")
