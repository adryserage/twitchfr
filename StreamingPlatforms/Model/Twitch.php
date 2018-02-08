<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\StreamingPlatforms\Model\Platform;

/**
* Class Twitch extends Platform
* Gets data from the Twitch API
*/ 
class Twitch extends Platform
{

    /**
    * Get streams from Twitch and add them to streams array
    * @param string $url Twitch API url to send the request to
    * @param string|null $http_header http header to set
	* @return array streams streams retrieved from Twitch
    */
	public function getStreamsFromPlatform($url, $http_header = null)
    {
        $response=$this->curlRequest($url, null, $http_header);
        $decode_flux = json_decode($response, true);
        if($decode_flux["_total"]!=0)
        {
            $API_streams = $decode_flux["streams"];
            foreach($API_streams as $stream)
            {
                $stream = new Stream($stream["_id"], $stream["game"], $stream["viewers"], $stream["channel"]["broadcaster_language"], $stream["channel"]["name"], "https://player.twitch.tv/?channel=".$stream["channel"]["name"], "https://www.twitch.tv/".$stream["channel"]["name"]."/chat?popout=", $stream["preview"]["large"], $stream["channel"]["status"], $stream["channel"]["display_name"], "Twitch");
				array_push($this->streams, $stream);
            }
        }
		return $this->streams;
	}
	
	
	/**
    * Get games from Twitch and add them to streams array
    * @param string $url Twitch API url to send the request to
    * @param string|null $http_header http header to set
	* @return array games games retrieved from Twitch
    */
    public function getGamesFromPlatform($url, $http_header = null)
    {
        $response=$this->curlRequest($url, null, $http_header);
        $decode_flux = json_decode($response, true);
        $API_games = $decode_flux["top"];
        foreach($API_games as $game)
        {
            $game = new Game($game["game"]["_id"], $game["game"]["name"], $game["viewers"], "https://static-cdn.jtvnw.net/ttv-boxart/".str_replace(" ","%20",$game["game"]["name"])."-272x380.jpg","Twitch");
			array_push($this->games, $game);
        }
		return $this->games;
    }
	
	
}
