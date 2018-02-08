<?php
namespace Vigas\StreamingPlatforms\Controller;

use Vigas\StreamingPlatforms\Model\Twitch;
use Vigas\StreamingPlatforms\Model\Smashcast;
use Vigas\StreamingPlatforms\Model\MediasManager;
use Vigas\StreamingPlatforms\Model\SearchManager;
use Vigas\Application\Controller\HTTPRequest;
use Vigas\Application\View\View;

/**
* Class SPController
* Streaming Platforms Controller
*/
class SPController
{
	/**
    * @var array model_params parameters used by the model to get data
    */
    protected $model_params;
	
	/**
    * @var array model_data data got from the model
    */
    protected $model_data;
	
	/**
    * @var string navbar_method_name contains name of the SPController method used to get the navbar
    */
    protected $navbar_method_name;
	
	/**
    * @var string method_name contains name of the SPController method used to get the content
    */
	protected $method_name;
    
	/**
    * Sets parameters for the model and methods name
    * @param object HTTPRequest $http_request
    */
    public function __construct(HTTPRequest $http_request = null)
    {
		if(!is_null($http_request))
		{
			if(isset($http_request->getGetData()['action']) && $http_request->getGetData()['action'] == 'games')
			{
			   $this->model_params['streams_limit'] = 3;
			   $this->model_params['streams_offset'] = 0;
			   $this->model_params['source_array'] = ["All","Twitch","Smashcast"];
			   $this->model_params['games_limit'] = 24;
			   $this->model_params['games_offset'] = (isset($http_request->getGetData()['offset'])) ? $http_request->getGetData()['offset'] : 0;
			   $this->navbar_method_name = 'getStreams';     
			}
			elseif(!isset($http_request->getGetData()['action']) || $http_request->getGetData()['action'] == 'following' || $http_request->getGetData()['action'] == 'streams-by-game')
			{
				if(isset($_GET["source_json"]) && is_array(json_decode($_GET["source_json"])))
				{
					$this->model_params['source_array'] = json_decode($_GET["source_json"]);

				}
				else
				{
					$this->model_params['source_array'] = ["All","Twitch","Smashcast"];
				}
				
			   $this->model_params['id-stream'] = (isset($http_request->getGetData()['id-stream'])) ? $http_request->getGetData()['id-stream'] : null;
			   $this->model_params['streams_limit'] = 36;
			   $this->model_params['streams_offset'] = (isset($http_request->getGetData()['offset'])) ? $http_request->getGetData()['offset'] : 0;
			   $this->model_params['games_limit'] = 6;
			   $this->model_params['games_offset'] = 0;
			   $this->navbar_method_name = 'getGames';
			} 
			if(isset($http_request->getGetData()['game']))
			{
				$this->model_params['games'] = $http_request->getGetData()['game'];
			}
			if(isset($http_request->getGetData()['action']) && $http_request->getGetData()['action'] == 'search')
			{
				$this->model_params['games_limit'] = 6;
				$this->model_params['games_offset'] = 0;
				$this->navbar_method_name = 'getGames';
			}
			
			if(isset($http_request->getGetData()['action']))
			{
				$this->method_name = $this->setMethodName($http_request->getGetData()['action']);
			}
			else
			{
				$this->method_name = 'getStreams';
			}
		}    
    }
	
	/**
    * Sets the method name the controller will use
    * @param string $action the action url parameter
    * @return string the method name
    */
    public function setMethodName($action) {
        if(strpos($action, '-'))
        {
            $array = explode('-', $action);
            $action = 'get';
            foreach ($array as &$word)
            {
                $action .= ucfirst($word);
            }
            return $action;
        }
        else
        {
            return 'get'.ucfirst($action);
        }        
    }
   
    /**
    * Executes SPController methods to get content and navbar
    */
    public function executeController()
    {
		$ctrl_method_name = $this->method_name;
		$navbar_method_name = $this->navbar_method_name;
        $this->$ctrl_method_name();
		$this->$navbar_method_name();
    }
	
	/**
    * Executes SPController methods to get content and navbar
	* Creates the view and call View method and template
    */
	public function getView()
    {
		$view = new View($this->model_params, $this->model_data);
		if(isset($_GET['requested_by']) && $_GET['requested_by'] == 'ajax')
		{
			if($this->method_name == 'getGames')
			{
				$view->getGamesContent();
			}
			else
			{
				$view->getStreamsContent();
			}
		}
		else
		{
			$view_method_name = $this->method_name.'View';
			$view->$view_method_name();
			$view->getTemplate();
		}
    }
	
	/**
    * Gets streams to display for the all streams view
    */
    public function getStreams()
    { 
        $streams_manager = new MediasManager;
        $streams_manager->setMediasArrayFromJSON(__DIR__.'/../Model/data/streams.json');
        $this->model_data['streams_to_display'] = $streams_manager->getMediasToDisplay($this->model_params['streams_limit'], $this->model_params['streams_offset'], $this->model_params['source_array']);
    }  
	
	/**
    * Gets games to display for the all games view
    */
    public function getGames()
    {
        $games_manager = new MediasManager;
        $games_manager->setMediasArrayFromJSON(__DIR__.'/../Model/data/games.json');
        $this->model_data['games_to_display'] = $games_manager->getMediasToDisplay($this->model_params['games_limit'], $this->model_params['games_offset']);
    } 
    
	/**
    * Gets streams to display for the streams by game view
    */
    public function getStreamsByGame()
    {
        if(isset($this->model_params['games']))
        {
            $streams_manager = new MediasManager;
            $twitch_game = str_replace(" ", "%20", $this->model_params['games']);

            foreach($this->model_params['source_array'] as $source)
            {
                if($source == "Twitch")
                {
					$twitch = new Twitch;
                    $twitch->getStreamsFromPlatform('https://api.twitch.tv/kraken/streams?limit=100&game='.$twitch_game, array('Client-ID: '. $twitch->getApiKeys()['client_id']));
                    $twitch->getStreamsFromPlatform('https://api.twitch.tv/kraken/streams?limit=100&offset=100&game='.$twitch_game, array('Client-ID: '. $twitch->getApiKeys()['client_id']));
					$streams_manager->setMediasArray($twitch->getStreams());
                }
                elseif($source=="Smashcast")
                {
					$smashcast = new Smashcast;
                    $smashcast->getStreamsFromPlatform('https://api.smashcast.tv/media/live/list?limit=100&game='.$this->model_params['games']);
					$streams_manager->setMediasArray($smashcast->getStreams());
                }
            }

            $this->model_data['streams_to_display'] = $streams_manager->getMediasToDisplay($this->model_params['streams_limit'], $this->model_params['streams_offset'], $this->model_params['source_array']);
        }
    }
	
    /**
    * Gets streams to display for the following view
    */
    public function getFollowing()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        if(Application::getLinkedAccounts() !== null && Application::getUser()->getFirstLinkDone()==1)
        {
            $linked_accounts = Application::getLinkedAccounts();
            $user = Application::getUser();

            $streams_manager = new MediasManager;
            foreach($this->model_params['source_array'] as $source)
            {
                if($source=="Twitch" && isset($linked_accounts['twitch_data']))
                {
                    $twitch_token = $linked_accounts['twitch_data']->getToken();
                    $streams_manager->getTwitchStreams('https://api.twitch.tv/kraken/streams/followed', null, array('Client-ID: '.$this->getPlatformsKeys()['twitch']['client_id'], 'Authorization: OAuth '.$linked_accounts['twitch_data']->decryptToken($twitch_token)));
                }
                elseif($source=="Smashcast" && isset($linked_accounts['smashcast_data']))
                {
                    $streams_manager->getSmashcastFollowedStreams($linked_accounts['smashcast_data']->getUsername());
                }
            }				

            $this->model_data['streams_to_display'] = $streams_manager->getStreamsToDisplay($this->model_params['source_array'], $this->model_params['streams_limit'], $this->model_params['streams_offset']);
        }
    }
    
	/**
    * Gets all data to display for the search view
    */
    public function getSearch($query = '')
    {
        if($query != '')
        {
            $search_manager = new SearchManager();
            $search_manager->twitchSearch($query);
            $search_manager->smashcastSearch($query);

            $this->model_data['streams_array'] = $search_manager->getStreamsMngr()->getMediasArray();
            $this->model_data['games_array'] = $search_manager->getGamesMngr()->getMediasArray();
            $this->model_data['streamers'] = $search_manager->getStreamerName();
            $this->model_params['query'] = $query;
        }
    }
    
	/**
    * @return array parameters used by the model to get data
    */
    public function getModelParams()
    {
        return $this->model_params;  
    }
    
	/**
    * @return array data got from the model
    */
    public function getModelData()
    {
        return $this->model_data;  
    }
}
