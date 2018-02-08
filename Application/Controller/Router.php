<?php
namespace Vigas\Controller;

use Vigas\Controller\AppController;
use Vigas\Controller\MediaController;
use Vigas\Model\User;

/**
* Class Router
* Manage HTTP parameters and controllers
*/
class Router
{
    /**
    * @var array $post_params HTTP POST parameters
    */
    protected $post_params = [];
    
    /**
    * @var array $get_params HTTP GET parameters
    */
    protected $get_params = [];
    
    /**
    * Set HTTP POST and GET parameters
    */
    public function __construct()
    {
        $this->setPOSTparams();
        $this->setGETparams();
    }
    
    /**
    * Set HTTP POST parameters
    */
    public function setPOSTparams()
    {
        foreach($_POST as $key => $value)
        {
            $this->post_params[$key] = htmlspecialchars($value);
        }
    }
    
    /**
    * Set HTTP GET parameters
    */
    public function setGETparams()
    {
        foreach($_GET as $key => $value)
        {
            $this->get_params[$key] = htmlspecialchars($value);
        }
    }
    
    /**
    * Set the method name the controller will use
    * @param string $action the action url parameter
    * @return sting the method name
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
    * Initialize the application controller and the related view
    */
    private function getAppController()
    {
        $appController = new AppController;
        if($this->get_params['action'] == 'following')
        {
            $ctrl_method = 'getLinkedAccount';
        }
        else
        {
             $ctrl_method = $this->setMethodName($this->get_params['action']);
        }
        if($this->get_params['action'] == 'reset-password' || $this->get_params['action'] == 'save-token')
        {
            $appController->$ctrl_method($this->get_params, $this->post_params);
        }
        elseif($this->get_params['action'] == 'manage-update-info')
        {
            $appController->$ctrl_method($this->get_params);
        }
        else
        {
            $appController->$ctrl_method($this->post_params);
        }
        $view_method =  $ctrl_method.'View';
        $view = new Views($this->post_params, $appController->getResponse());
        $view->$view_method();
        $view->getTemplate();
    }
    
    /**
    * Initialize the media controller and the related view
    */ 
    private function getMediaController()
    {
        $mediaController = new MediaController($this->get_params);
        if(!isset($this->get_params['offset']))
        {
            $mediaController->getNavbar();
        }
        if(isset($this->get_params['action']))
        {
            $ctrl_method = $this->setMethodName($this->get_params['action']);
            $view_method =  $ctrl_method.'View';
            if(isset($this->post_params['query']))
            {
                $mediaController->$ctrl_method($this->post_params['query']);
            }
            else
            {
                $mediaController->$ctrl_method();
            }
            $view = new Views($mediaController->getModelParams(), $mediaController->getModelData());
            $view->$view_method();
        }
        else
        {
            $mediaController->getStreams();
            $view = new Views($mediaController->getModelParams(), $mediaController->getModelData());
            $view->getStreamsView();
        }
         if(!isset($this->get_params['offset']))
        {
            $view->getTemplate();
        }      
    }
    
    /**
    * Call the right controller according to the requested action
    */ 
    public function getController()
    {
        if(!isset($this->get_params['action']) || $this->get_params['action'] == 'games' || $this->get_params['action'] == 'streams-by-game' || (
            $this->get_params['action'] == 'following' && Application::getUser() !== null && Application::getUser()->getFirstLinkDone()==1)
            || $this->get_params['action'] == 'search')
        {
            $this->getMediaController();
        }
        else
        {
            $this->getAppController();
        }
    }
    
    /**
    * @return array HTTP POST parameters
    */
    public function getPostParams()
    {
         return $this->post_params;
    }
    
    /**
    * @return array HTTP GET parameters
    */
    public function getGetParams()
    {
         return $this->get_params;
    }
    
}