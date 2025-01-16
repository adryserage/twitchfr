-- Remove dynamic columns from streamers table
ALTER TABLE streamers
DROP COLUMN IF EXISTS is_live,
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS game_name,
DROP COLUMN IF EXISTS viewer_count,
DROP COLUMN IF EXISTS started_at;
