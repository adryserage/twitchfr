<?php
namespace Vigas\Application\Controller;

/**
* Class HTTPRequest
* Manages HTTP request
*/
class HTTPRequest
{
	/**
    * @var array $post_data HTTP POST parameters
    */
	protected $post_data=[];
	
	/**
    * @var array $get_data HTTP GET parameters
    */
	protected $get_data=[];
	
	/**
    * Sets HTTP POST and GET parameters
    */
	public function __construct()
    {
        $this->setGetData();
        $this->setPostData();
    }
	
	public function cookieData($key)
	{
		return isset($_COOKIE[$key]) ? $_COOKIE[$key] : null;
	}

	public function cookieExists($key)
	{
		return isset($_COOKIE[$key]);
	}

	/**
    * Sets HTTP GET parameters
    */
	public function setGetData()
	{
		foreach ($_GET as $key => $value)
		{
			$this->get_data[$key] = htmlspecialchars($value);
		}
	}
	
	/**
    * Sets HTTP POST parameters
    */
	public function setPostData()
	{
		foreach ($_POST as $key => $value)
		{
			$this->post_data[$key] = htmlspecialchars($value);
		}
	}
	
	/**
    * @return array HTTP GET parameters
    */
	public function getGetData()
	{
		return $this->get_data;
	}
	
	/**
    * @return array HTTP POST parameters
    */
	public function getPostData()
	{
		return $this->post_data;
	}
	
}