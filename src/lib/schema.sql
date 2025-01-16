-- Drop existing table if it exists
DROP TABLE IF EXISTS streamers;

-- Create streamers table with only static columns
CREATE TABLE streamers (
    id VARCHAR(50) PRIMARY KEY,
    login VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    profile_image_url TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_live_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
