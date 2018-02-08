<?php

namespace Vigas\StreamingPlatforms\Model;

use Vigas\Application\Controller\Autoloader;
require_once __DIR__.'/../../Application/Controller/Autoloader.php';
Autoloader::register();

use Vigas\StreamingPlatforms\Model\Twitch;
use Vigas\StreamingPlatforms\Model\Smashcast;
use Vigas\StreamingPlatforms\Controller\SPController;
use Vigas\StreamingPlatforms\Model\MediasManager;

$sp_controller = new SPController();
$streams_manager = new MediasManager;
$games_manager = new MediasManager;

$twitch = new Twitch;
$twitch->getStreamsFromPlatform('https://api.twitch.tv/kraken/streams?limit=100&offset=0', array('Client-ID: '.$twitch->getApiKeys()['client_id']));
$twitch->getStreamsFromPlatform('https://api.twitch.tv/kraken/streams?limit=100&offset=100', array('Client-ID: '.$twitch->getApiKeys()['client_id']));
$streams_manager->setMediasArray($twitch->getStreams());

$smashcast = new Smashcast;
$smashcast->getStreamsFromPlatform('https://api.smashcast.tv/media/live/list?limit=100&start=0');
$streams_manager->setMediasArray($smashcast->getStreams());

$streams_manager->buildJsonFile(__DIR__.'/data/streams.json');

$twitch = new Twitch;
$twitch->getGamesFromPlatform('https://api.twitch.tv/kraken/games/top?limit=100', array('Client-ID: '.$twitch->getApiKeys()['client_id']));
$games_manager->addGames($twitch->getGames());

$smashcast = new Smashcast;
$smashcast->getGamesFromPlatform('https://api.smashcast.tv/games?limit=100&liveonly=true');
$games_manager->addGames($smashcast->getGames());

$games_manager->buildJsonFile(__DIR__.'/data/games.json');

?>
