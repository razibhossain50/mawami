-- Migration: Switch from username-based to email-based authentication
-- This migration ensures all users have email addresses and makes email required

-- Step 1: Update existing users without email to have a default email based on username
UPDATE "user" 
SET email = COALESCE(email, username || '@example.com')
WHERE email IS NULL OR email = '';

-- Step 2: Make email column NOT NULL (it's already unique)
ALTER TABLE "user" 
ALTER COLUMN email SET NOT NULL;

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"("email");

-- Step 4: Update test accounts to use proper email addresses
UPDATE "user" 
SET email = 'razibmahmud50@gmail.com'
WHERE username = 'superadmin' OR email = 'razibmahmud50@gmail.com';

UPDATE "user" 
SET email = 'user@example.com'
WHERE username = 'testuser1' OR email = 'user@example.com';

UPDATE "user" 
SET email = 'testadmin@example.com'
WHERE username = 'testadmin' OR email = 'admin@example.com';

-- Step 5: Remove any duplicate emails that might have been created
WITH duplicates AS (
  SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY "createdAt" ASC) as rn
  FROM "user"
)
DELETE FROM "user" 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

COMMIT;