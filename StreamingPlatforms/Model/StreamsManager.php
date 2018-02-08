<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\StreamingPlatforms\Model\Stream as Stream;
use Vigas\StreamingPlatforms\Model\MediasManager;

/**
 * Class StreamsManager extends MediasManager.
 * Get streams from streaming platforms and manage them
 */
class StreamsManager extends MediasManager
{	
    
    
    /**
    * Get streams from Twitch (top or followed), and pass them to buildStream method
    * @param string $url Twitch API url to send the request to
    * @param string|null $post_data post data to send
    * @param string|null $http_header http header to set
    */
    public function getTwitchStreams($url, $post_data=null, $http_header=null)
    {
        $response=$this->curlRequest($url, $post_data, $http_header);
        $decode_flux = json_decode($response, true);
        if($decode_flux["_total"]!=0)
        {
            $API_streams = $decode_flux["streams"];
            foreach($API_streams as $stream)
            {
                $this->buildStream($this->media_id, $stream["game"], $stream["viewers"], $stream["channel"]["broadcaster_language"], $stream["channel"]["name"], "https://player.twitch.tv/?channel=".$stream["channel"]["name"], "https://www.twitch.tv/".$stream["channel"]["name"]."/chat?popout=", $stream["preview"]["large"], $stream["channel"]["status"], $stream["channel"]["display_name"], "Twitch");
            }
        }
    }

    /**
    * Get top streams from Smashcast, and pass them to buildStream method
    * @param string $url Hibox API url to send the request to
    * @param string|null $post_data post data to send
    * @param string|null $http_header http header to set
    */
    public function getSmashcastStreams($url, $post_data=null, $http_header=null)
    {
        $response=$this->curlRequest($url, $post_data, $http_header);

        $decode_flux = json_decode($response, true);
        if(isset($decode_flux["livestream"]))
        {
            $API_streams = $decode_flux["livestream"];
            foreach($API_streams as $stream)
            {
                $this->buildStream($this->media_id, $stream["category_name"], $stream["media_views"], "", $stream["media_user_name"], "https://www.smashcast.tv/embed/".$stream["media_name"]."?autoplay=true","https://www.smashcast.tv/embedchat/".$stream["media_name"], "https://edge.sf.hitbox.tv/static/img/media/live/".$stream["media_name"]."_large_000.jpg", $stream["media_status"], $stream["media_display_name"], "Smashcast");
            }
        }	
    }

    /**
    * Get followed streams from Smashcast, and pass them to buildStream method
    * @param string $username Smashcast username
    */
    public function getSmashcastFollowedStreams($username)
    {
        $response=$this->curlRequest('https://api.smashcast.tv/following/user?user_name='.$username);

        $decode_flux = json_decode($response, true);
        if(isset($decode_flux["following"]))
        {
            $API_following = $decode_flux["following"];
            foreach($API_following as $following)
            {
                $response=$this->curlRequest('https://api.smashcast.tv/media/live/'.$following['user_name']);
                $decode_flux = json_decode($response, true);
                if(isset($decode_flux["livestream"]))
                {
                    $stream=$decode_flux["livestream"]["0"];
                    $this->buildStream($this->media_id, $stream["category_name"], $stream["media_views"], "", $stream["media_user_name"], "https://www.smashcast.tv/embed/".$stream["media_name"]."?autoplay=true","https://www.smashcast.tv/embedchat/".$stream["media_name"], "https://edge.sf.hitbox.tv/static/img/media/live/".$stream["media_name"]."_large_000.jpg", $stream["media_status"], $stream["media_display_name"], "Smashcast");
                }
            }
        }	
    }

    /**
    * Create a Stream object and pass it to add Stream method
    * @param int $id stream id
    * @param string $game game name
    * @param int $viewers number of viewers watching this stream
    * @param string $channel_language the channel language
    * @param string $channel_name the channel name
    * @param string $stream_url the stream url
    * @param string $chat_url the chat url
    * @param string $preview_url the stream preview url (thumbnail)
    * @param string $status the stream status (title)
    * @param string $channel_display_name the channel display name (streamer name)
    * @param string $source the stream's streaming platform
    */
    public function buildStream($id, $game, $viewers, $channel_language, $channel_name, $stream_url, $chat_url, $preview_url, $status, $channel_display_name, $source)
    {
        $stream = new Stream($id, $game, $viewers, $channel_language, $channel_name, $stream_url, $chat_url, $preview_url, $status, $channel_display_name, $source);
        $this->addMedia($stream);
    }

    /**
    * Build medias_to_display array to pass to the view
    * @param int $limit number of streams to display
    * @param int $offset streams_array key from where to start creating medias_to_display
    */
    public function getStreamsToDisplay(Array $source_array, $limit, $offset)
    {
        $medias_to_display = [];
        foreach($this->medias_array as $stream)
        {
            if (in_array($stream->getSource(), $source_array))
            {
                array_push($medias_to_display, $stream);
            }
        }		
        if(count($medias_to_display)<$offset + $limit)
        {
            $nb_medias_to_display = count($medias_to_display);
        }
        else
        {
            $nb_medias_to_display = $offset + $limit;
        }
        usort($medias_to_display,  array($this, 'oderByViewers'));
        for($i=$offset;$i<$nb_medias_to_display; $i++) 
        {
            array_push($this->medias_to_display, $medias_to_display[$i]);
        }
        return $this->medias_to_display;
    }	
}
