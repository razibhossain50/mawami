-- Check if the biodata table exists and what columns it has
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'biodata' 
ORDER BY ordinal_position;

-- Check if there are any biodatas in the table
SELECT COUNT(*) as total_biodatas FROM biodata;

-- Check the first few biodatas to see their structure
SELECT id, "fullName", status, "biodataApprovalStatus", "biodataVisibilityStatus", "completedSteps"
FROM biodata 
LIMIT 5;