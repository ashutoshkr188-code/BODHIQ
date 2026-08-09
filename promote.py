import sqlite3
import uuid

conn = sqlite3.connect("/data/bodhiq.db")
cursor = conn.cursor()
clerk_id = 'user_3HZrXi1YDM43pSFnm0dEQhZBe89'
email = 'ashutoshkr.188@gmail.com'

# Check if exists
cursor.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
row = cursor.fetchone()

if row:
    cursor.execute("UPDATE users SET role = 'admin', updated_at = datetime('now') WHERE clerk_id = ?", (clerk_id,))
else:
    user_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO users (id, clerk_id, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
        (user_id, clerk_id, email, 'admin')
    )
conn.commit()
conn.close()
print("Database updated!")
