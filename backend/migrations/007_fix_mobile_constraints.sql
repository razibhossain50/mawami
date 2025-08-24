-- Fix mobile number constraints and handle existing data
-- This migration corrects issues from the previous mobile number migration

-- First, drop the problematic constraint if it exists
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS check_mobile_or_google;

-- Drop the unique constraint on mobile temporarily to fix data
DROP INDEX IF EXISTS idx_user_mobile_unique;

-- Remove duplicate users (keep the one with the lowest ID)
DELETE FROM "user" 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM "user" 
  GROUP BY email
) AND email IS NOT NULL;

-- Update existing users to have proper mobile numbers or handle Google users
-- For users with Gmail addresses, treat them as Google users if they don't have googleId
UPDATE "user" 
SET "googleId" = 'migrated_google_user_' || id::text
WHERE "googleId" IS NULL 
  AND "email" LIKE '%@gmail.com';

-- For regular users without mobile, assign temporary mobile numbers
UPDATE "user" 
SET "mobile" = '0170000' || LPAD(id::text, 4, '0')
WHERE "mobile" IS NULL 
  AND "googleId" IS NULL 
  AND "email" NOT LIKE '%@gmail.com'
  AND "role" = 'user';

-- Ensure admin accounts have proper email addresses and mobile numbers
UPDATE "user" 
SET 
  "email" = CASE 
    WHEN "role" = 'superadmin' AND ("email" IS NULL OR "email" NOT LIKE '%@example.com') THEN 'razibmahmud50@gmail.com'
    WHEN "role" = 'admin' AND ("email" IS NULL OR "email" NOT LIKE '%@example.com') THEN 'admin@example.com'
    ELSE "email"
  END,
  "mobile" = CASE 
    WHEN "mobile" IS NULL AND "role" = 'superadmin' THEN '01700000000'
    WHEN "mobile" IS NULL AND "role" = 'admin' THEN '01900000000'
    ELSE "mobile"
  END
WHERE "role" IN ('admin', 'superadmin');

-- Recreate the unique constraint for mobile numbers (allowing nulls)
CREATE UNIQUE INDEX idx_user_mobile_unique 
ON "user"("mobile") 
WHERE "mobile" IS NOT NULL;

-- Create a flexible constraint: users must have either mobile OR googleId
-- (Admin users will have both email and mobile after the updates above)
ALTER TABLE "user" 
ADD CONSTRAINT check_user_identity 
CHECK (
  ("mobile" IS NOT NULL) OR 
  ("googleId" IS NOT NULL)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_mobile ON "user"("mobile") WHERE "mobile" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"("email") WHERE "email" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "user"("googleId") WHERE "googleId" IS NOT NULL;