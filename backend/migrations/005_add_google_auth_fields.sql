-- Add Google authentication fields to User table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "profilePicture" VARCHAR(500);

-- Make password nullable for Google users
ALTER TABLE "user" 
ALTER COLUMN "password" DROP NOT NULL;

-- Create index for Google ID for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "user"("googleId");

-- Create unique constraint for Google ID (but allow nulls)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_google_id_unique 
ON "user"("googleId") 
WHERE "googleId" IS NOT NULL;