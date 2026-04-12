#!/usr/bin/env python3
"""
One-time script to run admin setup migration and configure admin user.
Run this once on Railway: railway run python setup_admin.py
"""
import os
import sys
from sqlalchemy import create_engine, text

def main():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)
    
    print("Connecting to database...")
    engine = create_engine(database_url)
    
    try:
        with engine.connect() as conn:
            print("Running migration: Adding admin columns...")
            
            # Add columns if they don't exist
            conn.execute(text("""
                ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NULL
            """))
            conn.execute(text("""
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL
            """))
            conn.execute(text("""
                ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' NOT NULL
            """))
            
            print("Creating indexes...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_users_is_admin ON users (is_admin)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_users_role ON users (role)
            """))
            
            print("Making khash@khash.com an admin...")
            result = conn.execute(text("""
                UPDATE users 
                SET is_admin = TRUE, role = 'admin' 
                WHERE email = 'khash@khash.com'
                RETURNING email, is_admin, role
            """))
            
            conn.commit()
            
            updated_user = result.fetchone()
            if updated_user:
                print(f"\n✅ SUCCESS! Admin user configured:")
                print(f"   Email: {updated_user[0]}")
                print(f"   Is Admin: {updated_user[1]}")
                print(f"   Role: {updated_user[2]}")
            else:
                print("\n⚠️  WARNING: User khash@khash.com not found in database")
                print("   Make sure you've logged in at least once before running this script")
            
            print("\n✅ Migration completed successfully!")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        sys.exit(1)
    finally:
        engine.dispose()

if __name__ == "__main__":
    main()
