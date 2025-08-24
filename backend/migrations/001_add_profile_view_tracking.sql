-- Add profile view tracking fields to biodata table
ALTER TABLE biodata 
ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create profile_views table
CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    "biodataId" INTEGER NOT NULL,
    "viewerId" INTEGER NULL,
    "ipAddress" VARCHAR(45) NULL,
    "userAgent" TEXT NULL,
    "viewedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("biodataId") REFERENCES biodata(id) ON DELETE CASCADE,
    FOREIGN KEY ("viewerId") REFERENCES "user"(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_biodata_id ON profile_views("biodataId");
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON profile_views("viewerId");
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views("viewedAt");
CREATE INDEX IF NOT EXISTS idx_profile_views_ip_address ON profile_views("ipAddress");

-- Update existing biodata records to have default timestamps
UPDATE biodata 
SET "createdAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP 
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;