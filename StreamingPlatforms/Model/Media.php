<?php
namespace Vigas\StreamingPlatforms\Model;

/**
 * Abstract Class Media.
 * A media is either a game or a stream
 */
abstract class Media
{
    /**
    * @var int $id media id
    */
    protected $id;
    
    /**
    * @var string $game game name
    */
    protected $game;
    
    /**
    * @var int $viewers number of viewers
    */
    protected $viewers;
    
    /**
    * @var string $source the media's streaming platform
    */
    protected $source;

    /** 
    * @return int returns the media id
    */
    public function getId()
    {
		return $this->id;
    }

    /** 
    * @return string returns the game name
    */
    public function getGame()
    {
		return $this->game;
    }

    /** 
    * @return string returns the number of viewers
    */
    public function getViewers()
    {
		return $this->viewers;
    }
}
