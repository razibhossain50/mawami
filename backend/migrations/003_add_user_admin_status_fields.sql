-- Add new fields for user preference and admin status override
ALTER TABLE biodata 
ADD COLUMN IF NOT EXISTS "userWantsActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "adminStatus" biodata_status_enum NULL;

-- Update existing records to have proper default values
UPDATE biodata 
SET "userWantsActive" = true 
WHERE "userWantsActive" IS NULL;

-- For existing active biodatas, set adminStatus to Active to maintain current behavior
UPDATE biodata 
SET "adminStatus" = 'Active' 
WHERE status = 'Active' AND "adminStatus" IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_biodata_user_wants_active ON biodata("userWantsActive");
CREATE INDEX IF NOT EXISTS idx_biodata_admin_status ON biodata("adminStatus");

-- Add comments for documentation
COMMENT ON COLUMN biodata."userWantsActive" IS 'User preference for biodata visibility (true = wants active, false = wants inactive)';
COMMENT ON COLUMN biodata."adminStatus" IS 'Admin override status - when set, this takes precedence over user preference for determining visibility';