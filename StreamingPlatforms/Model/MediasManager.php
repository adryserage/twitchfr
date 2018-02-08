<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\StreamingPlatforms\Model\Stream;
use Vigas\StreamingPlatforms\Model\Game;
use Vigas\StreamingPlatforms\Model\Media;
use Vigas\Applciation\Model\CurlRequest;

/**
* Class MediasManager.
*/
Class MediasManager
{ 
     /**
    * @var array $medias_to_display contains medias to be displayed by the view 
    */
    protected $medias_to_display = [];
	
    /**
    * @var array $medias_array contains medias retrieved from the streaming platform 
    */
    protected $medias_array = [];

    /**
    * Merges existing medias array with medias retrieved from the streaming platform 
    * @param array $array
    */
	public function setMediasArray(Array $array)
    {
        $this->medias_array = array_merge($this->medias_array, $array);
    }
	
    /**
    * Orders medias by number of viewers from higher to lower
    * @param object Media $media1
    * @param object Media $media2
    */
    protected function oderByViewers(Media $media1, Media $media2)
    {
        if ($media1->getViewers() == $media2->getViewers()) {
            return 0;
        }
        return ($media1->getViewers() > $media2->getViewers()) ? -1 : 1;
    }
    
	/**
    * Merges array if medias array is empty
	* Adds numbers of viewers is the game is already in array or add the game is not
    * @param array $games_array
    */
    public function addGames(Array $games_array)
    {
        $game_exists = 0;
        if(count($this->medias_array) == 0)
        {
            $this->medias_array = array_merge($this->medias_array, $games_array);
        }
        else
        {
            //checking if a game is already in game array (loaded from an other source). If it is, the number of viewers is adedd, if not, the game is added in game array
            foreach($games_array as $new_game)
            {
				foreach($this->medias_array as $recorded_game)
				{
					if(strcasecmp($new_game->getGame(),$recorded_game->getGame()) == 0)
					{
						$recorded_game->addViewers($new_game->getViewers());
						$game_exists = 1;
						if($recorded_game->getBox()=="")
						{
							$recorded_game->setBox($box);
						}
					}
				}
				if($game_exists == 0)
				{
					array_push($this->medias_array, $new_game);
				}				
			}
        }
    }
    
    /**
    * Create a JSON file with media_array data
    * @param string $path_file JSON file path
    */
    public function buildJsonFile($path_file)
    {	
        $serialized_medias=(serialize($this->medias_array));
        $json_medias_file = fopen($path_file, "w+");
        fwrite($json_medias_file, json_encode($serialized_medias));
        fclose($json_medias_file);
    }

    /**
    * Set medias_array from JSON file data
    * @param string $path_file JSON file path
    */
    public function setMediasArrayFromJSON($path_file)
    {
        $json_source = file_get_contents($path_file);
        $serialized_medias = json_decode($json_source, true);
        $this->medias_array = unserialize($serialized_medias);
		
    }
    
	/**
    * Build medias_to_display array to be displayed by the view 
    * @param int $limit number of streams to display
    * @param int $offset offset to start creating medias_to_display
    * @param array $source_array contains list of the streaming platforms (for streams only)
    */
    public function getMediasToDisplay($limit, $offset, Array $source_array = null)
    {
		if(!is_null($source_array))
		{
			$i=0;
			foreach($this->medias_array as $stream)
			{
				if(!in_array($stream->getSource(), $source_array))
				{
					unset($this->medias_array[$i]);
				}
				$i++;
			}		
		}
        
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

    /** 
    * @return array returns the media array
    */
    public function getMediasArray()
    {
        return $this->medias_array;
    }
    
}
