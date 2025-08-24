-- Create enum type for biodata status
CREATE TYPE biodata_status_enum AS ENUM ('Pending', 'Active', 'Inactive', 'Rejected');

-- Update existing status values to match new enum
UPDATE biodata SET status = 'Pending' WHERE status IS NULL OR status = '';
UPDATE biodata SET status = 'Active' WHERE status = 'active';
UPDATE biodata SET status = 'Inactive' WHERE status = 'inactive' OR status = 'Inactive';
UPDATE biodata SET status = 'Rejected' WHERE status = 'rejected';

-- Alter the status column to use the enum type
ALTER TABLE biodata 
ALTER COLUMN status TYPE biodata_status_enum USING status::biodata_status_enum,
ALTER COLUMN status SET DEFAULT 'Pending',
ALTER COLUMN status SET NOT NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_biodata_status ON biodata(status);