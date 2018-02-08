<?php
namespace Vigas\Model;

use Vigas\Model\CurlRequest;
use Vigas\Controller\Application;

/**
* Class LinkedAccount
* Get and manage account from streaming platform, interact with database
*/
class LinkedAccount
{
    use CurlRequest;
    
    /**
    * @var string $source the streaming platform account source
    */
    private $source;
    
    /**
    * @var string $username the streaming platform account username
    */
    private $username;
    
    /**
    * @var string $token the token given by the streaming platform once the user is logged
    */
    private $token;

    /**
    * @var string $profil_picture_url the profil picture url
    */
    private $profil_picture_url;
    
    /**
    * @param string $source the streaming platform account source
    */
    public function __construct($source)
    {
        $this->source = $source;
    }

    /**
    * Crypt the streaming platform token
    * @return string the crypted token
    */
    public function cryptToken()
    {
        $token = serialize($this->token);
        $td = mcrypt_module_open(MCRYPT_DES,"",MCRYPT_MODE_ECB,"");
        $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td,Application::CRYPT_TOKEN_KEY,$iv);
        $crypted_token = base64_encode(mcrypt_generic($td, $token));
        mcrypt_generic_deinit($td);

        return $crypted_token;
    }

    /**
    * Decrypt the streaming platform token
    * @param string $encrypted_token the crypted token
    * @return string the decrypted token
    */
    public function decryptToken($encrypted_token)
    {
        $td = mcrypt_module_open(MCRYPT_DES,"",MCRYPT_MODE_ECB,"");
        $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td,Application::CRYPT_TOKEN_KEY,$iv);
        $decrypted_token = mdecrypt_generic($td, base64_decode($encrypted_token));
        mcrypt_generic_deinit($td);

        $exploded_token=explode(':',$decrypted_token);
        $this->token=$exploded_token[2];
        $this->token = substr($this->token,1,$exploded_token[1]);	
        return $this->token;
    }

    /**
    * Get token from the streaming platform
    * @param array $data data to pass to the streaming platform API (app token, secret token...)
    */
    public function getTokenFromSource(Array $data)
    {	
        switch ($this->source)
        {
            case 'twitch':
                $url='https://api.twitch.tv/kraken/oauth2/token';
                $http_header=array('Client-ID: '.Application::TWITCH_APP['client_id']);
                break;
            case 'smashcast':
                $url='https://api.smashcast.tv/oauth/exchange';
                $http_header=array('Client-ID: '.Application::SMASHCAST_APP['app_token']);
                break;
        }

        $response=$this->curlRequest($url, $data, $http_header);
        $json_result=json_decode($response, true);
        $this->token=$json_result["access_token"];
    }

    /**
    * Get username from the streaming platform
    */
    public function getUsernameFromSource()
    {
        switch ($this->source)
        {
            case 'twitch':
                $url='https://api.twitch.tv/kraken/user';
                $http_header=array('Client-ID: '.Application::TWITCH_APP['client_id'], 'Authorization: OAuth '.$this->token);
                break;
            case 'smashcast':
                $url='https://api.smashcast.tv/userfromtoken/'.$this->token;
                $http_header=null;
                break;
        }

        $response=$this->curlRequest($url, null ,$http_header);

        $decode_response= json_decode($response, true);
        if(isset($decode_response["name"]))
        {
            $this->username=$decode_response["name"];
        }
        if(isset($decode_response["user_name"]))
        {
            $this->username=$decode_response["user_name"];
        }		
    }

    /**
    * Get profile picture from the streaming platform
    */
    public function getProfilePictureFromSource()
    {
        switch ($this->source)
        {
            case 'twitch':
                $response=$this->curlRequest('https://api.twitch.tv/kraken/users/'.$this->username, null, array('Authorization: OAuth '.$this->token));
                $decode_response= json_decode($response, true);
                if(isset($decode_response["logo"]))
                {
                    $this->profil_picture_url = $decode_response["logo"];
                }
                else
                {
                    $this->profil_picture_url = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png';
                }
                break;

            case 'smashcast':
                $response=$this->curlRequest('https://api.smashcast.tv/user/'.$this->username, null, array('Authorization: OAuth '.$this->token));
                $decode_response= json_decode($response, true);
                if(isset($decode_response["user_logo"]))
                {
                    $this->profil_picture_url = 'https://edge.sf.hitbox.tv'.$decode_response["user_logo"];
                }	
                break;
        }		
    }

    /**
    * Save streaming platform user informations into database
    * @param object PDO $db database connection object
    * @param string $username streaming platform username
    * @param int $user_id the "local" user id
    */
    public function saveToDB($db, $username, $user_id)
    {	
        $req = $db->prepare('SELECT count(id) as nb_id FROM LinkedAccount WHERE user_id=:user_id');
        $req->execute(array(
            'user_id' => $user_id
        ));
        $resultat = $req->fetch();
        if($resultat['nb_id']==0)
        {
            $req = $db->prepare('INSERT INTO LinkedAccount (user_id, '.$this->source.'_username, '.$this->source.'_token) VALUES(:user_id, :username, :encrypted_token)');
            $encrypted_token=$this->cryptToken($this->token);
            $resultat=$req->execute(array(
                'user_id' => $user_id,
                'username' => $username,
                'encrypted_token' => $encrypted_token
            ));
        }
        else
        {
            $req = $db->prepare('UPDATE LinkedAccount SET '.$this->source.'_username=:username, '.$this->source.'_token=:encrypted_token WHERE user_id=:user_id');
            $encrypted_token=$this->cryptToken($this->token);
            $resultat=$req->execute(array(
                'username' => $username,
                'encrypted_token' => $encrypted_token,
                'user_id' => $user_id
            ));
        }

        if (!$resultat)
        {
            print_r($req->errorInfo());
        }
        else
        {
            return array($this->source.'_username' => $username, $this->source.'_token' => $this->token);
        }
    }

    /**
    * Get streaming platform user informations from the database
    * @param object PDO $db database connection object
    * @param int $user_id the "local" user id
    */
    public function getFromDB($db, $user_id)
    {
        $req = $db->prepare('SELECT '.$this->source.'_username, '.$this->source.'_token FROM LinkedAccount WHERE user_id=:user_id');
        $req->execute(array(
                'user_id' => $user_id
        ));
        $reslutat=$req->fetch();
        if(isset($reslutat[$this->source.'_username']) && isset($reslutat[$this->source.'_token']))
        {
            $this->username = $reslutat[$this->source.'_username'];
            $this->token = $reslutat[$this->source.'_token'];
            $this->getProfilePictureFromSource();
            return $this;
        }
    }

    /** 
    * @return string returns the streaming platform account username
    */
    public function getUsername()
    {
        return $this->username;
    }

    /** 
    * @return string returns the token given by the streaming platform once the user is logged
    */
    public function getToken()
    {
        return $this->token;
    }
    
    /** 
    * @return string returns the streaming platform profil picture
    */
    public function getProfilPictureUrl()
    {
        return $this->profil_picture_url;
    }

    /** 
    * @param string $token the token given by the streaming platform once the user is logged
    */
    public function setToken($token)
    {
        $this->token = $token;
    }
}
