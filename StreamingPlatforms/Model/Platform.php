<?php
namespace Vigas\StreamingPlatforms\Model;

/**
* Abstract Class Platform
* Gets data from a streaming platform API
*/
abstract class Platform
{
	use \Vigas\Application\Model\CurlRequest;
	
	/**
    * @var string base_url platform's base API url
    */
	protected $base_url;
	
	/**
    * @var array api_keys platform's API keys
    */
	protected $api_keys = [];
	
	/**
    * @var array streams contains streams retrieved from the streaming platform
    */
	protected $streams = [];
	
	/**
    * @var array followed_streams contains followed streams retrieved from the streaming platform
    */
	protected $followed_streams = [];
	
	/**
    * @var array games contains games retrieved from the streaming platform
    */
	protected $games = [];
		
	/**
    * Sets the streaming platform API keys
    */
	public function __construct()
    {
		$classname = explode('\\',get_class($this));
		$classname = end($classname);
		$xml_doc = new \DOMDocument;
		$xml_doc->load(__DIR__.'/../config.xml');
		$elements = $xml_doc->getElementsByTagName(lcfirst($classname));
        for($i=0; $i<$elements->length; $i++)
		{
			$this->api_keys[$elements->item($i)->getAttribute('name')] = $elements->item($i)->getAttribute('value');
		}
    }
	
	/**
    * Gets streams from the streaming platform
    */
	public function getStreamsFromPlatform($url, $http_header = null)
    {
		
	}
	
	/**
    * Gets followed streams from the streaming platform
    */
	public function getFollowedStreamsFromPlatform($url, $http_header = null)
    {
		
	}
	
	/**
    * Gets games from the streaming platform
    */
	public function getGamesFromPlatform($url, $http_header = null)
    {
		
	}
    
	/**
    * @return array api_keys platform's API keys
    */
    public function getApiKeys()
    {
        return $this->api_keys;
    }
	
	/**
    * @return array streams contains streams retrieved from the streaming platform
    */
	public function getStreams()
    {
        return $this->streams;
    }
	
	/**
    * @return array followed_streams contains followed streams retrieved from the streaming platform
    */
	public function getFollowedStreams()
    {
        return $this->followed_streams;
    }
	/**
    * @return array games contains games retrieved from the streaming platform
    */
	public function getGames()
    {
        return $this->games;
    }
	
}