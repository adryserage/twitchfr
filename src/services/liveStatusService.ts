import { StreamerService } from './streamerService';
import { twitchClient } from '@/utils/twitchClient';

export class LiveStatusService {
    private streamerService: StreamerService;
    private updateInterval: NodeJS.Timeout | null = null;
    private isUpdating = false;

    constructor() {
        this.streamerService = new StreamerService();
    }

    startPeriodicUpdates(intervalMs: number = 60000) { // Default to 1 minute
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateLiveStatuses().catch(console.error);
        }, intervalMs);

        // Run first update immediately
        this.updateLiveStatuses().catch(console.error);
    }

    stopPeriodicUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    private async updateLiveStatuses() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            const streamers = await this.streamerService.getStreamersNeedingLiveUpdate();
            if (streamers.length === 0) return;

            // Get Twitch client
            const client = await twitchClient.getClient();
            
            // Update in batches of 100 (Twitch API limit)
            for (let i = 0; i < streamers.length; i += 100) {
                const batch = streamers.slice(i, i + 100);
                const userIds = batch.map(s => s.id);
                
                const streams = await client.streams.getStreamsByUserIds(userIds);
                const liveStreamIds = new Set(streams.map(s => s.userId));

                // Update live status for each streamer in the batch
                await Promise.all(batch.map(streamer => 
                    this.streamerService.updateLiveStatus(
                        streamer.id, 
                        liveStreamIds.has(streamer.id)
                    )
                ));
            }
        } catch (error) {
            console.error('Error updating live statuses:', error);
        } finally {
            this.isUpdating = false;
        }
    }
}
