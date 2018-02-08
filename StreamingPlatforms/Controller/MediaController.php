<?php
namespace Vigas\StreamingPlatforms\Controller;

use Vigas\StreamingPlatforms\Model\StreamsManager;
use Vigas\StreamingPlatforms\Model\GamesManager;
use Vigas\StreamingPlatforms\Model\SearchManager;
use Vigas\Application\Controller\HTTPRequest;
use Vigas\Application\View\View;

class MediaController
{
    protected $model_params;
    protected $model_data;
    protected $navbar_method_name;
	protected $method_name;
	protected $platforms_keys = [];
    
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
				$this->method_name = 'get'.ucfirst($http_request->getGetData()['action']);
			}
			else
			{
				$this->method_name = 'getStreams';
			}
		}    
    }
   
    public function executeController()
    {
		$ctrl_method_name = $this->method_name;
		$navbar_method_name = $this->navbar_method_name;
        $this->$ctrl_method_name();
		$this->$navbar_method_name();
    }
	
	public function getView()
    {
		$view = new View($this->model_params, $this->model_data);
		$view_method_name = $this->method_name.'View';
        $view->$view_method_name();
		if(!isset($_GET['source_json']))
		{
			$view->getTemplate();
		}	
    }
	
	public function setPlatformsKeys()
    {
		$xml_doc = new \DOMDocument;
		$xml_doc->load(__DIR__.'/../config.xml');
		$platforms_keys = $xml_doc->getElementsByTagName('platform_key');
		;
		for($i=0; $i<$platforms_keys->length; $i++)
		{
			$this->platforms_keys[$platforms_keys->item($i)->getAttribute('platform')][$platforms_keys->item($i)->getAttribute('name')] = $platforms_keys->item($i)->getAttribute('value');
		}
	}
	
    public function getStreams()
    { 
        $streams_manager = new StreamsManager;
        $streams_manager->setMediasArrayFromJSON(__DIR__.'/../Model/data/streams.json');
        $this->model_data['streams_to_display'] = $streams_manager->getStreamsToDisplay($this->model_params['source_array'], $this->model_params['streams_limit'], $this->model_params['streams_offset']);
    }  
	
    public function getGames()
    {
        $games_manager = new GamesManager;
        $games_manager->setMediasArrayFromJSON(__DIR__.'/../Model/data/games.json');
        $this->model_data['games_to_display'] = $games_manager->getGamesToDisplay($this->model_params['games_limit'], $this->model_params['games_offset']);
    } 
    
    public function getStreamsByGame()
    {
        if(isset($this->model_params['games']))
        {
            $streams_manager = new StreamsManager;
            $twitch_game = str_replace(" ", "%20", $this->model_params['games']);

            foreach($this->model_params['source_array'] as $source)
            {
                if($source == "Twitch")
                {
                    $streams_manager->getTwitchStreams('https://api.twitch.tv/kraken/streams?limit=100&game='.$twitch_game, null, array('Client-ID: '. Application::TWITCH_APP['client_id']));
                    $streams_manager->getTwitchStreams('https://api.twitch.tv/kraken/streams?limit=100&offset=100&game='.$twitch_game, null, array('Client-ID: '. Application::TWITCH_APP['client_id']));
                }
                elseif($source=="Smashcast")
                {
                    $streams_manager->getSmashcastStreams('https://api.smashcast.tv/media/live/list?limit=100&game='.$this->model_params['games']);
                }
            }

            $this->model_data['streams_to_display'] = $streams_manager->getStreamsToDisplay($this->model_params['source_array'], $this->model_params['streams_limit'], $this->model_params['streams_offset']);
        }
    }
    
    public function getFollowing()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        if(Application::getLinkedAccounts() !== null && Application::getUser()->getFirstLinkDone()==1)
        {
            $linked_accounts = Application::getLinkedAccounts();
            $user = Application::getUser();

            $streams_manager = new StreamsManager;
            foreach($this->model_params['source_array'] as $source)
            {
                if($source=="Twitch" && isset($linked_accounts['twitch_data']))
                {
                    $twitch_token = $linked_accounts['twitch_data']->getToken();
                    $streams_manager->getTwitchStreams('https://api.twitch.tv/kraken/streams/followed', null, array('Client-ID: '.Application::TWITCH_APP['client_id'], 'Authorization: OAuth '.$linked_accounts['twitch_data']->decryptToken($twitch_token)));
                }
                elseif($source=="Smashcast" && isset($linked_accounts['smashcast_data']))
                {
                    $streams_manager->getSmashcastFollowedStreams($linked_accounts['smashcast_data']->getUsername());
                }
            }				

            $this->model_data['streams_to_display'] = $streams_manager->getStreamsToDisplay($this->model_params['source_array'], $this->model_params['streams_limit'], $this->model_params['streams_offset']);
        }
    }
    
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
    
    public function getModelParams()
    {
        return $this->model_params;  
    }
    
    public function getModelData()
    {
        return $this->model_data;  
    }
    
    public function getNavbar()
    {
        return $this->{$this->navbar_method_name}();  
    }
	
	public function getPlatformsKeys()
    {
        return $this->platforms_keys;  
    }
}
