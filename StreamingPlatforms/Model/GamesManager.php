<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\StreamingPlatforms\Model\Game as Game;
use Vigas\StreamingPlatforms\Model\MediasManager;


/**
 * Class GamesManager extends MediasManager.
 * Get games from streaming platforms and manage them
 */
class GamesManager extends MediasManager
{
    use \Vigas\Application\Model\CurlRequest;
    /**
    * Get games from Twitch, and pass them to buildGame method
    * @param string $url Twitch API url to send the request to
    * @param string|null $post_data post data to send
    * @param string|null $http_header http header to set
    */
    public function getTwitchGames($url, $post_data=null, $http_header=null)
    {
        $response=$this->curlRequest($url, $post_data, $http_header);
        $decode_flux = json_decode($response, true);
        $API_games = $decode_flux["top"];

        foreach($API_games as $game)
        {
            $this->buildGame($this->media_id, $game["game"]["name"], $game["viewers"], "https://static-cdn.jtvnw.net/ttv-boxart/".str_replace(" ","%20",$game["game"]["name"])."-272x380.jpg","Twitch");
        }
    }
    
    /**
    * Get games from Smashcast, and pass them to buildGame method
    * @param string $url Smashcast API url to send the request to
    * @param string|null $post_data post data to send
    * @param string|null $http_header http header to set
    */
    public function getSmashcastGames($url, $post_data=null, $http_header=null)
    {	
        $response=$this->curlRequest($url, $post_data, $http_header);
        $decode_flux = json_decode($response, true);
        $API_games = $decode_flux["categories"];

        foreach($API_games as $game)
        {
            $this->buildGame($this->media_id, $game["category_name"], intval($game["category_viewers"]), "https://static-cdn.jtvnw.net/ttv-boxart/".str_replace(" ","%20",$game["category_name"])."-272x380.jpg","Smashcast");
        }
    }
    
    /**
    * Create a Game object and pass it to addMedia method
    * @param int $id game id
    * @param string $game_name game name
    * @param int $viewers number of viewers watching this game
    * @param string $box game boxart's url
    * @param string $source the game's streaming platform
    */
    public function buildGame($id, $game_name, $viewers, $box, $source)
    {
        $game_exists=0;
        if(count($this->medias_array)==0)
        {
            $game = new Game($id, $game_name, $viewers, $box, $source);
            $this->addMedia($game);
        }
        else
        {
            //checking if a game is already in game array (loaded from an other source). If it is, the number of viewers is adedd, if not, the game is added in game array
            foreach($this->medias_array as $game_obj)
            {
                if(strcasecmp($game_obj->getGame(),$game_name)==0)
                {
                    $game_obj->addViewers($viewers);
                    $game_exists=1;
                    if($game_obj->getBox()=="")
                    {
                        $game_obj->setBox($box);
                    }
                }
            }
            if($game_exists==0)
            {
                $game = new Game($id, $game_name, $viewers, $box, $source);
                $this->addMedia($game);
            }
        }
    }

    /**
    * Build medias_to_display array to pass to the view
    * @param int $limit number of games to display
    * @param int $offset games_array key from where to start creating medias_to_display
    */
    public function getGamesToDisplay($limit, $offset)
    {   
        if(count($this->medias_array)<$offset + $limit)
        {
            $nb_medias_to_display = count($this->medias_array);
        }
        else
        {
            $nb_medias_to_display = $offset + $limit;
        }
        usort($this->medias_array,  array($this, 'oderByViewers'));
        for($i=$offset;$i<$nb_medias_to_display; $i++) 
        {
            array_push($this->medias_to_display, $this->medias_array[$i]);
        }
        return $this->medias_to_display;
    }	

}
