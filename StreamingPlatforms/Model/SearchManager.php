<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\Controller\Application;
use Vigas\StreamingPlatforms\Model\StreamsManager;
use Vigas\StreamingPlatforms\Model\GamesManager;

/**
* Class SearchManager.
* Query a research to streaming platforms and manage them
*/
class SearchManager
{
    /**
    * @var Class GamesManager $games_mngr contains a GamesManager object
    */
    protected $games_mngr;
    
    /**
    * @var Class SreamsManager $streams_mngr contains a StreamsManager object
    */
    protected $streams_mngr;
    
    /**
    * @var array $streamer_name contains offline streamers
    */
    protected $streamer_name=[];

    use CurlRequest;

    /**
    * Create games and streams manager
    */
    public function __construct()
    {
        $this->games_mngr = new GamesManager();
        $this->streams_mngr = new StreamsManager();
    }
    
    /**
    * Get games, streams and offline streamers from Twitch, and pass them to buildGame or buildStream method
    * @param string $query the keyword(s) entered by user
    */
    public function twitchSearch($query)
    {
        $streams=$this->curlRequest('https://api.twitch.tv/kraken/search/streams?q='.urlencode($query).'&limit=50', null, array('Client-ID: '.Application::TWITCH_APP['client_id']));
        $games=$this->curlRequest('https://api.twitch.tv/kraken/search/games?q='.urlencode($query).'&type=suggest&live=true',null,  array('Client-ID: '.Application::TWITCH_APP['client_id']));
        $offline_streamer=$this->curlRequest('https://api.twitch.tv/kraken/users/'.urlencode($query), null, array('Client-ID: '.Application::TWITCH_APP['client_id']));

        $decode_streams = json_decode($streams, true);
        if(isset($decode_streams["_total"]) && $decode_streams["_total"]!=0)
        {
            $API_streams = $decode_streams["streams"];
            foreach($API_streams as $stream)
            {
                if(stristr($stream["channel"]["name"], $query) || stristr($stream["game"], $query))
                {
                    $this->streams_mngr->buildStream($this->streams_mngr->getMediaId(), $stream["game"], $stream["viewers"], $stream["channel"]["broadcaster_language"], $stream["channel"]["name"], "https://player.twitch.tv/?channel=".$stream["channel"]["name"], "https://www.twitch.tv/".$stream["channel"]["name"]."/chat?popout=", $stream["preview"]["large"], $stream["channel"]["status"], $stream["channel"]["display_name"], "Twitch");
                }

            }
        }

        $decode_games = json_decode($games, true);
        if(!empty($decode_games["games"]))
        {
            $API_games = $decode_games["games"];
            foreach($API_games as $game)
        {
                $this->games_mngr->buildGame($this->games_mngr->getMediaId(), $game["name"], "", $game["box"]["large"],"Twitch");
            }
        }

        $decode_offline_streamer = json_decode($offline_streamer, true);
        if(isset($decode_offline_streamer["display_name"]))
        {
            array_push($this->streamer_name,array("name"=>$decode_offline_streamer["display_name"], "profile_link"=>"https://www.twitch.tv/".$decode_offline_streamer["display_name"], "source"=>"Twitch"));
        }
    }

    /**
    * Get games, streams and offline streamers from Smashcast, and pass them to buildGame or buildStream method
    * @param string $query the keyword(s) entered by user
    */
    public function smashcastSearch($query)
    {
        $streams=$this->curlRequest('https://api.smashcast.tv/media/live/list?search='.$query.'&limit=50');
        $games=$this->curlRequest('https://api.smashcast.tv/games?q='.$query.'&limit=50&liveonly=true');
        $offline_streamer=$this->curlRequest('https://api.smashcast.tv/media/live/'.$query);

        $decode_streams = json_decode($streams, true);
        if(isset($decode_streams["livestream"]))
        {
            $API_streams = $decode_streams["livestream"];
            foreach($API_streams as $stream)
            {
                $this->streams_mngr->buildStream($this->streams_mngr->getMediaId(), $stream["category_name"], $stream["media_views"], "", $stream["media_user_name"], "https://www.smashcast.tv/embed/".$stream["media_name"],"https://www.smashcast.tv/embedchat/".$stream["media_name"], "https://edge.sf.hitbox.tv/static/img/media/live/".$stream["media_name"]."_large_000.jpg", $stream["media_status"], $stream["media_display_name"], "Smashcast");
            }
        }

        $decode_games = json_decode($games, true);
        if(isset($decode_games["categories"]))
        {
            $API_games = $decode_games["categories"];
            foreach($API_games as $game)
            {
                $this->games_mngr->buildGame($this->games_mngr->getMediaId(), $game["category_name"], intval($game["category_viewers"]), "https://static-cdn.jtvnw.net/ttv-boxart/".str_replace(" ","%20",$game["category_name"])."-272x380.jpg","Smashcast");
            }
        }

        $decode_offline_streamer = json_decode($offline_streamer, true);
        if(isset($decode_offline_streamer["livestream"]))
        {
            $stream=$decode_offline_streamer["livestream"][0];
            if($stream["media_is_live"]==0)
            {
                array_push($this->streamer_name,array("name"=>$stream["media_user_name"], "profile_link"=>"https://www.smashcast.tv/".$stream["media_name"],"source"=>"Smashcast"));
            }
        }
    }

    /**
    * @return Class StreamsManager $streams_mngr returns a streams manager
    */
    public function getStreamsMngr()
    {
        return $this->streams_mngr;
    }

    /**
    * @return Class GamesManager $games_mngr returns a games manager
    */
    public function getGamesMngr()
    {
        return $this->games_mngr;
    }

    /**
    * @return array $streamer_name returns an array with offline streamers name
    */
    public function getStreamerName()
    {
        return $this->streamer_name;
    }
	
}
