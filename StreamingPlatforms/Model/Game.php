<?php
namespace Vigas\StreamingPlatforms\Model;

Use Vigas\StreamingPlatforms\Model\Media;

/**
 * Class Game extends Media.
 * Manages a streamed game
 */
class Game extends Media
{
    /**
    * @var string $box game boxart's url
    */
    private $box;

    /**
    * @param int $id game id
    * @param string $game game name
    * @param int $viewers number of viewers watching this game
    * @param string $box game boxart's url
    * @param string $source the game's streaming platform
    */
    public function __construct($id, $game, $viewers, $box, $source)
    {
        $this->id = $id;
        $this->game = $game;
        $this->viewers = $viewers;
        $this->box = $box;
        $this->source = $source;
    }
    
    /** 
    * @return string returns the game boxart's url
    */
    public function getBox()
    {
        return $this->box;
    }
    
    /** 
    * @param string $box the game boxart's url to set
    */
    public function setBox($box)
    {
        $this->box = $box;
    }
    
    /** 
    * @param int $viewers add a number of viewers to the game
    */
    public function addViewers($viewers)
    {
        $this->viewers += $viewers;
    }
}
