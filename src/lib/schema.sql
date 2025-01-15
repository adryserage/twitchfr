CREATE TABLE IF NOT EXISTS streamers (
    id VARCHAR(50) PRIMARY KEY,
    login VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    profile_image_url TEXT,
    is_live BOOLEAN DEFAULT false,
    title TEXT,
    game_name VARCHAR(100),
    viewer_count INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    last_live_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
