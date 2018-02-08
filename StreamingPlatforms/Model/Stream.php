<?php
namespace Vigas\StreamingPlatforms\Model;

use Vigas\StreamingPlatforms\Model\Media;

/**
 * Class Stream extends Media.
 * Manage a stream
 */
class Stream extends Media
{
    /**
    * @var string $channel_language the channel language
    */
    protected $channel_language;
    
    /**
    * @var string $channel_name the channel name
    */
    protected $channel_name;
    
    /**
    * @var string $stream_url the stream url
    */
    protected $stream_url;
    
    /**
    * @var string $chat_url the chat url
    */
    protected $chat_url;
    
    /**
    * @var string $preview_url the stream preview url (thumbnail)
    */
    protected $preview_url;
    
    /**
    * @var string $status the stream status (title)
    */
    protected $status;
    
    /**
    * @var string $channel_display_name the channel display name (streamer name)
    */
    protected $channel_display_name;

    /**
    * @param int $id stream id
    * @param string $game game name
    * @param int $viewers number of viewers watching this stream
    * @param string $channel_language the channel language
    * @param string $channel_name the channel name
    * @param string $stream_url the stream url
    * @param string $chat_url the chat url
    * @param string $preview_url the stream preview url (thumbnail)
    * @param string $status the stream status (title)
    * @param string $channel_display_name the channel display name (streamer name)
    * @param string $source the stream's streaming platform
    */
    public function __construct($id, $game, $viewers, $channel_language, $channel_name, $stream_url, $chat_url, $preview_url, $status, $channel_display_name, $source)
    {
        $this->id = $id;
        $this->game = $game;
        $this->viewers = $viewers;
        $this->channel_language = $channel_language;
        $this->channel_name = $channel_name;
        $this->stream_url = $stream_url;
        $this->chat_url = $chat_url;
        $this->preview_url = $preview_url;
        $this->status = $status;
        $this->channel_display_name = $channel_display_name;
        $this->source = $source;
    }

    /** 
    * @return string returns the channel language
    */
    public function getChannelLanguage()
    {
            return $this->channel_language;
    }

    /** 
    * @return string returns the channel name
    */
    public function getChannelName()
    {
            return $this->channel_name;
    }

    /** 
    * @return string returns the stream url
    */
    public function getStreamUrl()
    {
            return $this->stream_url;
    }

    /** 
    * @return string returns the chat url
    */
    public function getChatUrl()
    {
            return $this->chat_url;
    }

    /** 
    * @return string returns the stream preview url (thumbnail)
    */
    public function getPreviewUrl()
    {
            return $this->preview_url;
    }

    /** 
    * @return string returns the stream status (title)
    */
    public function getStatus()
    {
            return $this->status;
    }

    /** 
    * @return string returns the channel display name (streamer name)
    */
    public function getChannelDisplayName()
    {
            return $this->channel_display_name;
    }

    /** 
    * @return string returns the stream's streaming platform
    */
    public function getSource()
    {
            return $this->source;
    }
}
