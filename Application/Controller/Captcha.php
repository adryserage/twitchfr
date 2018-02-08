<?php
namespace Vigas\Controller;

/**
 * Class Captcha.
 * Manage Google reCAPTCHA
 */
class Captcha
{
    /**
    * @var string $siteKey reCAPTCHA site key
    */
    private $siteKey;
    
    /**
    * @var string $secretKey reCAPTCHA secret key
    */
    private $secretKey;
    
    /**
    * @var string $captcha_response reCAPTCHA response
    */
    private $captcha_response;
    
    /**
    * @var string $remote_ip user IP address
    */
    private $remote_ip;
    
    /**
    * @var string $api_url Google reCAPTCHA url
    */
    private $api_url;

    /**
    * @param string $siteKey reCAPTCHA site key
    * @param string $secretKey reCAPTCHA secret key
    * @param string $captcha_response reCAPTCHA response
    * @param string $remote_ip user IP address
    */
    public function __construct($siteKey, $secretKey, $captcha_response, $remote_ip)
    {
        $this->siteKey=$siteKey;
        $this->secretKey=$secretKey;
        $this->captcha_response=$captcha_response;
        $this->remoteip=$remote_ip;
        $this->api_url="https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha_response."&remoteip=".$remote_ip;	
    }

    /** 
    * @return boolean returns true if captcha is validated, false otherwise
    */
    public function validCaptcha()
    {
        $decode = json_decode(file_get_contents($this->api_url, true));
        return $decode->success;
    }
}
