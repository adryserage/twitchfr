import { getClient } from "../lib/db";

export interface Streamer {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  addedAt?: Date;
  lastLiveCheck?: Date;
  updatedAt?: Date;
}

interface DbStreamerRow {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  added_at?: Date;
  last_live_check?: Date;
  updated_at?: Date;
}

export class StreamerService {
  private static LIVE_STATUS_THRESHOLD_MINUTES = 5;

  async upsertStreamer(streamer: {
    id: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
  }): Promise<Streamer> {
    const query = `
      INSERT INTO streamers (
        id, login, display_name, profile_image_url
      ) VALUES (
        $1, $2, $3, $4
      )
      ON CONFLICT (id) DO UPDATE
      SET
        login = EXCLUDED.login,
        display_name = EXCLUDED.display_name,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      streamer.id,
      streamer.login,
      streamer.displayName,
      streamer.profileImageUrl,
    ];

    const client = await getClient();
    try {
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateLiveStatus(streamerId: string, isLive: boolean): Promise<void> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const query = `
        UPDATE streamers 
        SET is_live = $1, 
            last_live_check = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;

      await client.query(query, [isLive, streamerId]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error updating streamer live status:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getStreamersNeedingLiveUpdate(): Promise<Streamer[]> {
    const client = await getClient();
    try {
      const query = `
        SELECT * FROM streamers 
        WHERE last_live_check < NOW() - INTERVAL '${StreamerService.LIVE_STATUS_THRESHOLD_MINUTES} minutes'
        ORDER BY last_live_check ASC
      `;

      const result = await client.query(query);
      return result.rows.map(this.mapRowToStreamer);
    } catch (error) {
      console.error("Error fetching streamers needing live update:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getStreamers(): Promise<Streamer[]> {
    const query = `
      SELECT *
      FROM streamers
      ORDER BY updated_at DESC;
    `;

    const client = await getClient();
    try {
      const result = await client.query(query);
      return result.rows.map(row => ({
        id: row.id,
        login: row.login,
        displayName: row.display_name,
        profileImageUrl: row.profile_image_url,
        addedAt: row.added_at,
        lastLiveCheck: row.last_live_check,
        updatedAt: row.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async getStreamerById(id: string): Promise<Streamer | null> {
    const client = await getClient();
    try {
      const result = await client.query("SELECT * FROM streamers WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) return null;
      return this.mapRowToStreamer(result.rows[0]);
    } catch (error) {
      console.error("Error fetching streamer by id:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteStreamer(streamerId: string): Promise<void> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const query = `DELETE FROM streamers WHERE id = $1`;

      await client.query(query, [streamerId]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error deleting streamer:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  private mapRowToStreamer(row: DbStreamerRow): Streamer {
    return {
      id: row.id,
      login: row.login,
      displayName: row.display_name,
      profileImageUrl: row.profile_image_url,
      addedAt: row.added_at,
      lastLiveCheck: row.last_live_check,
      updatedAt: row.updated_at
    };
  }
}
