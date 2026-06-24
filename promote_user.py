import os
import sys
import urllib.request
import json
import sqlite3

def load_env(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key_val = line.split('=', 1)
                    if len(key_val) == 2:
                        env_vars[key_val[0].strip()] = key_val[1].strip()
    return env_vars

def update_local_db(clerk_user_id):
    # Try to find the database file
    db_paths = [
        os.path.join('backend', 'bodhiq.db'),
        'bodhiq.db',
        os.path.join(os.path.dirname(__file__), 'backend', 'bodhiq.db'),
        os.path.join(os.path.dirname(__file__), 'bodhiq.db')
    ]
    
    db_path = None
    for path in db_paths:
        if os.path.exists(path):
            db_path = path
            break
            
    if not db_path:
        print("[WARNING] Local database bodhiq.db not found. Role updated only in Clerk.")
        return False
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, role FROM users WHERE clerk_id = ?", (clerk_user_id,))
        row = cursor.fetchone()
        
        if row:
            # Update existing user
            cursor.execute("UPDATE users SET role = 'admin' WHERE clerk_id = ?", (clerk_user_id,))
            conn.commit()
            print(f"[SUCCESS] Updated user role to 'admin' in local database ({db_path}).")
        else:
            # Insert new user with admin role
            import uuid
            from datetime import datetime
            user_id = str(uuid.uuid4())
            created_at = datetime.utcnow().isoformat()
            # Try to get email if possible, else empty
            cursor.execute(
                "INSERT INTO users (id, clerk_id, email, role, created_at) VALUES (?, ?, ?, ?, ?)",
                (user_id, clerk_user_id, "", "admin", created_at)
            )
            conn.commit()
            print(f"[SUCCESS] Created new admin user in local database ({db_path}).")
            
        conn.close()
        return True
    except Exception as e:
        print(f"[WARNING] Failed to update local database: {e}")
        return False

def main():
    print("====================================================")
    print("         BODHIQ CLERK USER ROLE PROMOTER")
    print("====================================================")
    print()

    # Load environment variables
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    env_path = os.path.join(backend_dir, '.env')
    if not os.path.exists(env_path):
        env_path = '.env'
        if not os.path.exists(env_path):
            env_path = os.path.join('backend', '.env')

    env_vars = load_env(env_path)
    clerk_secret = env_vars.get('CLERK_SECRET_KEY')

    if not clerk_secret:
        print("[ERROR] CLERK_SECRET_KEY not found in backend/.env")
        print("Please configure CLERK_SECRET_KEY first.")
        input("Press Enter to exit...")
        sys.exit(1)

    print(f"[INFO] Loaded CLERK_SECRET_KEY from: {env_path}")
    print()
    print("Please enter your Clerk User ID.")
    print("You can find this in your Clerk Dashboard or your account profile page.")
    print("It usually starts with 'user_'.")
    print()
    
    clerk_user_id = input("Clerk User ID: ").strip()
    if not clerk_user_id:
        print("[ERROR] User ID cannot be empty.")
        input("Press Enter to exit...")
        sys.exit(1)

    print()
    print(f"[INFO] Promoting user {clerk_user_id} to admin in Clerk...")

    # Build request
    url = f"https://api.clerk.com/v1/users/{clerk_user_id}/metadata"
    data = json.dumps({
        "public_metadata": {
            "role": "admin"
        }
    }).encode('utf-8')

    req = urllib.request.Request(
        url, 
        data=data, 
        headers={
            'Authorization': f'Bearer {clerk_secret}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    clerk_ok = False
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print("[SUCCESS] User successfully promoted to Admin in Clerk!")
            clerk_ok = True
    except Exception as e:
        print(f"[ERROR] Failed to update Clerk metadata: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

    # Update the local SQLite database role as well
    db_ok = update_local_db(clerk_user_id)

    if clerk_ok or db_ok:
        print()
        print("====================================================")
        print("[SUCCESS] Promotion process completed!")
        print("====================================================")
        print("IMPORTANT: Please log out of the website and log back in")
        print("to refresh your session token and apply the changes.")
        print("====================================================")
    
    print()
    input("Press Enter to exit...")

if __name__ == '__main__':
    main()
