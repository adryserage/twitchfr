import pool from '../lib/db';

export interface Streamer {
    id: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
    isLive: boolean;
    title?: string;
    gameName?: string;
    viewerCount?: number;
    startedAt?: string;
    lastLiveCheck?: Date;
}

export class StreamerService {
    private static LIVE_STATUS_THRESHOLD_MINUTES = 5;

    async upsertStreamer(streamer: Streamer): Promise<void> {
        const query = `
            INSERT INTO streamers (
                id, login, display_name, profile_image_url, 
                is_live, title, game_name, viewer_count, started_at,
                last_live_check
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET
                login = EXCLUDED.login,
                display_name = EXCLUDED.display_name,
                profile_image_url = EXCLUDED.profile_image_url,
                is_live = EXCLUDED.is_live,
                title = EXCLUDED.title,
                game_name = EXCLUDED.game_name,
                viewer_count = EXCLUDED.viewer_count,
                started_at = EXCLUDED.started_at,
                last_live_check = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
        `;

        const values = [
            streamer.id,
            streamer.login,
            streamer.displayName,
            streamer.profileImageUrl,
            streamer.isLive,
            streamer.title,
            streamer.gameName,
            streamer.viewerCount,
            streamer.startedAt
        ];

        try {
            await pool.query(query, values);
        } catch (error) {
            console.error('Error upserting streamer:', error);
            throw error;
        }
    }

    async updateLiveStatus(streamerId: string, isLive: boolean): Promise<void> {
        const query = `
            UPDATE streamers 
            SET is_live = $1, 
                last_live_check = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
        `;

        try {
            await pool.query(query, [isLive, streamerId]);
        } catch (error) {
            console.error('Error updating streamer live status:', error);
            throw error;
        }
    }

    async getStreamersNeedingLiveUpdate(): Promise<Streamer[]> {
        const query = `
            SELECT * FROM streamers 
            WHERE last_live_check < NOW() - INTERVAL '${StreamerService.LIVE_STATUS_THRESHOLD_MINUTES} minutes'
            ORDER BY last_live_check ASC
        `;

        try {
            const result = await pool.query(query);
            return result.rows.map(this.mapRowToStreamer);
        } catch (error) {
            console.error('Error fetching streamers needing live update:', error);
            throw error;
        }
    }

    async getStreamers(): Promise<Streamer[]> {
        try {
            const result = await pool.query(`
                SELECT * FROM streamers 
                ORDER BY is_live DESC, viewer_count DESC NULLS LAST
            `);
            return result.rows.map(this.mapRowToStreamer);
        } catch (error) {
            console.error('Error fetching streamers:', error);
            throw error;
        }
    }

    async getStreamerById(id: string): Promise<Streamer | null> {
        try {
            const result = await pool.query('SELECT * FROM streamers WHERE id = $1', [id]);
            if (result.rows.length === 0) return null;
            return this.mapRowToStreamer(result.rows[0]);
        } catch (error) {
            console.error('Error fetching streamer by id:', error);
            throw error;
        }
    }

    async deleteStreamer(streamerId: string): Promise<void> {
        const query = `DELETE FROM streamers WHERE id = $1`;
        
        try {
            await pool.query(query, [streamerId]);
        } catch (error) {
            console.error('Error deleting streamer:', error);
            throw error;
        }
    }

    private mapRowToStreamer(row: {
        id: string;
        login: string;
        display_name: string;
        profile_image_url: string;
        is_live: boolean;
        title?: string;
        game_name?: string;
        viewer_count?: number;
        started_at?: string;
        last_live_check?: Date;
    }): Streamer {
        return {
            id: row.id,
            login: row.login,
            displayName: row.display_name,
            profileImageUrl: row.profile_image_url,
            isLive: row.is_live,
            title: row.title,
            gameName: row.game_name,
            viewerCount: row.viewer_count,
            startedAt: row.started_at,
            lastLiveCheck: row.last_live_check
        };
    }
}
