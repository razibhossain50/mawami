-- Simple fix for mobile number constraints
-- Just make mobile nullable and remove problematic constraints

-- Drop any existing problematic constraints
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS check_mobile_or_google;
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS check_user_identity;

-- Drop and recreate indexes safely
DROP INDEX IF EXISTS idx_user_mobile_unique;
DROP INDEX IF EXISTS idx_user_mobile;

-- Make sure mobile column is nullable
ALTER TABLE "user" ALTER COLUMN "mobile" DROP NOT NULL;

-- Create a simple unique index for mobile numbers (allowing nulls)
CREATE UNIQUE INDEX idx_user_mobile_unique 
ON "user"("mobile") 
WHERE "mobile" IS NOT NULL;

-- Create a simple index for mobile lookups
CREATE INDEX idx_user_mobile ON "user"("mobile") WHERE "mobile" IS NOT NULL;

-- No constraints for now - we'll handle validation in the application layer