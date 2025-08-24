-- Create new enum types for the cleaner two-column approach
CREATE TYPE biodata_approval_status_enum AS ENUM ('pending', 'approved', 'rejected', 'inactive');
CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');

-- Add new columns with proper defaults
ALTER TABLE biodata 
ADD COLUMN IF NOT EXISTS "biodataApprovalStatus" biodata_approval_status_enum DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "biodataVisibilityStatus" biodata_visibility_status_enum DEFAULT 'active';

-- Migrate existing data from old status system to new two-column system
-- Map old status values to new approval status
UPDATE biodata 
SET "biodataApprovalStatus" = CASE 
    WHEN status = 'Pending' THEN 'pending'::biodata_approval_status_enum
    WHEN status = 'Active' THEN 'approved'::biodata_approval_status_enum
    WHEN status = 'Rejected' THEN 'rejected'::biodata_approval_status_enum
    WHEN status = 'Inactive' THEN 'inactive'::biodata_approval_status_enum
    ELSE 'pending'::biodata_approval_status_enum
END;

-- Set visibility status based on old userWantsActive field (if it exists)
UPDATE biodata 
SET "biodataVisibilityStatus" = CASE 
    WHEN "userWantsActive" = false THEN 'inactive'::biodata_visibility_status_enum
    ELSE 'active'::biodata_visibility_status_enum
END
WHERE "userWantsActive" IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_biodata_approval_status ON biodata("biodataApprovalStatus");
CREATE INDEX IF NOT EXISTS idx_biodata_visibility_status ON biodata("biodataVisibilityStatus");

-- Create composite index for public queries (approved + active)
CREATE INDEX IF NOT EXISTS idx_biodata_public_visibility 
ON biodata("biodataApprovalStatus", "biodataVisibilityStatus") 
WHERE "biodataApprovalStatus" = 'approved' AND "biodataVisibilityStatus" = 'active';

-- Add comments for documentation
COMMENT ON COLUMN biodata."biodataApprovalStatus" IS 'Admin approval status: pending, approved, rejected, inactive';
COMMENT ON COLUMN biodata."biodataVisibilityStatus" IS 'User visibility preference: active (visible), inactive (hidden)';

-- Clean up old columns (optional - uncomment if you want to remove old columns)
-- ALTER TABLE biodata DROP COLUMN IF EXISTS "userWantsActive";
-- ALTER TABLE biodata DROP COLUMN IF EXISTS "adminStatus";