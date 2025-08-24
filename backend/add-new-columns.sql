-- Add new columns for the two-column biodata status system
-- This script is safe to run multiple times (uses IF NOT EXISTS)

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE biodata_approval_status_enum AS ENUM ('pending', 'approved', 'rejected', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns if they don't exist
ALTER TABLE biodata 
ADD COLUMN IF NOT EXISTS "biodataApprovalStatus" biodata_approval_status_enum DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "biodataVisibilityStatus" biodata_visibility_status_enum DEFAULT 'active';

-- Migrate existing data from old status column to new approval status column
UPDATE biodata 
SET "biodataApprovalStatus" = CASE 
    WHEN status = 'Active' THEN 'approved'::biodata_approval_status_enum
    WHEN status = 'Pending' THEN 'pending'::biodata_approval_status_enum
    WHEN status = 'Rejected' THEN 'rejected'::biodata_approval_status_enum
    WHEN status = 'Inactive' THEN 'inactive'::biodata_approval_status_enum
    ELSE 'pending'::biodata_approval_status_enum
END
WHERE "biodataApprovalStatus" IS NULL OR "biodataApprovalStatus" = 'pending';

-- Set default visibility status for existing records
UPDATE biodata 
SET "biodataVisibilityStatus" = 'active'::biodata_visibility_status_enum
WHERE "biodataVisibilityStatus" IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_biodata_approval_status ON biodata("biodataApprovalStatus");
CREATE INDEX IF NOT EXISTS idx_biodata_visibility_status ON biodata("biodataVisibilityStatus");

-- Create composite index for public queries (approved + active)
CREATE INDEX IF NOT EXISTS idx_biodata_public_visibility 
ON biodata("biodataApprovalStatus", "biodataVisibilityStatus") 
WHERE "biodataApprovalStatus" = 'approved' AND "biodataVisibilityStatus" = 'active';

-- Show results
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as total_biodatas, 
       COUNT(CASE WHEN "biodataApprovalStatus" = 'approved' THEN 1 END) as approved_biodatas,
       COUNT(CASE WHEN "biodataApprovalStatus" = 'pending' THEN 1 END) as pending_biodatas
FROM biodata;