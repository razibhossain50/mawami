-- Migration to ensure all users have usernames for username-based authentication

-- Create unique index for username if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username_unique 
ON "user"("username") 
WHERE "username" IS NOT NULL;

-- For users without username (Google users), generate username from email
UPDATE "user" 
SET "username" = CASE 
    WHEN "email" IS NOT NULL AND "username" IS NULL THEN 
        CASE 
            WHEN LENGTH(SPLIT_PART("email", '@', 1)) >= 8 THEN SPLIT_PART("email", '@', 1)
            ELSE CONCAT(SPLIT_PART("email", '@', 1), '_', EXTRACT(EPOCH FROM NOW())::INTEGER)
        END
    ELSE "username"
END
WHERE "username" IS NULL AND "email" IS NOT NULL;

-- Ensure all users have a username (fallback for any edge cases)
UPDATE "user" 
SET "username" = CONCAT('user_', "id", '_', EXTRACT(EPOCH FROM NOW())::INTEGER)
WHERE "username" IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"("username");