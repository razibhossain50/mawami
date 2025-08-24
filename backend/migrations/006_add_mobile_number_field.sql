-- Add mobile number field to User table and update authentication system
-- This migration converts from email-based to mobile-based authentication

-- Add mobile column to user table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(15);

-- Make email nullable since Google users might not have mobile initially
ALTER TABLE "user" 
ALTER COLUMN "email" DROP NOT NULL;

-- Create unique constraint for mobile numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_mobile_unique 
ON "user"("mobile") 
WHERE "mobile" IS NOT NULL;

-- Create index for mobile number lookups
CREATE INDEX IF NOT EXISTS idx_user_mobile ON "user"("mobile");

-- Update existing users with dummy mobile numbers (for development/testing)
-- Note: In production, you would need to collect real mobile numbers from users
UPDATE "user" 
SET "mobile" = CASE 
    WHEN "email" = 'razibmahmud50@gmail.com' THEN '01700000000'
    WHEN "email" = 'admin@example.com' THEN '01900000000'
    WHEN "email" = 'user@example.com' THEN '01800000000'
    ELSE '0170000' || LPAD(id::text, 4, '0') -- Generate unique mobile for other users
END
WHERE "mobile" IS NULL AND "googleId" IS NULL; -- Only update non-Google users

-- Make mobile NOT NULL for non-Google users
-- Google users can have NULL mobile initially
ALTER TABLE "user" 
ADD CONSTRAINT check_mobile_or_google 
CHECK (("mobile" IS NOT NULL) OR ("googleId" IS NOT NULL));

-- Drop the old unique constraint on email if it exists
-- (Keep email field for Google users but make it non-unique)
DROP INDEX IF EXISTS "UQ_user_email";