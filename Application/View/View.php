<?php
namespace Vigas\Application\View;

/**
* Class Application
* Imports view files and sets view
*/
class View
{  
	/**
    * @var array params parameters used by the view
    */
    protected $params;
	
	/**
    * @var array data data retrived from the model
    */
    protected $data;
	
	/**
    * @var string main_title HTML page title 
    */
    protected $main_title;
	
	/**
    * @var string content_title view content title
    */
    protected $content_title;
	
	/**
    * @var string navbar_account top navbar account information
    */
    protected $navbar_account;
	
	/**
    * @var string navbar left side navbar
    */
    protected $navbar;
	
	/**
    * @var string content view content
    */
    protected $content;

	/**
    * Sets parameters for the view and get navbar account view
    * @param array parameters $params
    * @param array data $data
    */
    public function __construct($params, $data)
    {
        $this->params = $params;
        $this->data = $data;
		ob_start();
        require_once __DIR__.'/navbarAccountView.php';
		$this->navbar_account = ob_get_clean();
    }
    
	/**
    * Gets the all live streams or streams by game view
    * @param string $streams_view the view file to get
    */
    public function getStreamsContentView($streams_view)
    {
        $div_streams_display_class = "row";
        $div_stream_class = "col-lg-3 col-md-4 col-xs-6 div-prev";
		ob_start();
        require_once __DIR__.'/../../StreamingPlatforms/View/'.$streams_view.'View.php';
		$this->content = ob_get_clean();
        
        if($this->params['streams_offset'] == 0)
        {
            $div_games_display_class = "col-xs-12 div-navbar";
            $div_game_class = "col-sm-6 col-xs-2 div-prev-navbar";
			ob_start();
            require_once __DIR__.'/../../StreamingPlatforms/View/allGamesView.php';
            $this->navbar = ob_get_clean(); 
        }    
    }
    
	/**
    * Gets the all live streams view
    */
    public function getStreamsView()
    {         
        $this->main_title = "Vigas - Live streams from Twitch and Smashcast";
        $this->content_title = "Live streams";
        $this->getStreamsContentView('allStreams');
    }
	
	/**
    * Gets the streams content only
    */
	public function getStreamsContent()
    {
		$div_streams_display_class = "row";
        $div_stream_class = "col-lg-3 col-md-4 col-xs-6 div-prev";
        require_once __DIR__.'/../../StreamingPlatforms/View/streamsContent.php';
    }
   
	/**
    * Gets the all games view
    */
    public function getGamesView()
    {
        $this->main_title = "Vigas - All games from Twitch and Smashcast";
		$this->content_title = "All games";
        $div_games_display_class = "row";
        $div_game_class="col-lg-2 col-md-3 col-xs-4 div-prev";
		ob_start();
        require_once __DIR__.'/../../StreamingPlatforms/View/allGamesView.php';
        $this->content = ob_get_clean();  

        if($this->params['games_offset'] == 0)
        {
            $div_streams_display_class = "col-xs-12 div-navbar";
            $div_stream_class = "col-sm-12 col-xs-4 div-prev-navbar";
			ob_start();
            require_once __DIR__.'/../../StreamingPlatforms/View/allStreamsView.php';
            $this->navbar = ob_get_clean();
        }
    }
	
	/**
    * Gets the games content only
    */
	public function getGamesContent()
    {
		$div_games_display_class = "row";
        $div_game_class = "col-lg-2 col-md-3 col-xs-4 div-prev";
        require_once __DIR__.'/../../StreamingPlatforms/View/gamesContent.php';
    }
    
	/**
    * Gets the live streams by game view
    */
    public function getStreamsByGameView()
    {         
        $this->main_title = "Vigas - ".urldecode($this->params['games'])." live streams from Twitch and Smashcast";
        $this->content_title = urldecode($this->params['games'])." live streams";
        $this->getStreamsContentView('streamsByGame');
    }
    
	/**
    * Gets the following live streams view
    */
    public function getFollowingView()
	{         
        $this->main_title = "Vigas - Following live streams from Twitch and Smashcast";
        $this->content_title = "Live streams";
        $div_streams_display_class="row";
        $div_stream_class="col-lg-3 col-md-4 col-xs-6 div-prev";
		ob_start();
        require_once __DIR__.'/../../StreamingPlatforms/View/followingView.php';
        $this->content = ob_get_clean();
        
        if($this->params['streams_offset'] == 0)
        {
            $div_games_display_class = "col-xs-12 div-navbar";
            $div_game_class = "col-sm-6 col-xs-2 div-prev-navbar";
			ob_start();
            require_once __DIR__.'/../../StreamingPlatforms/View/allGamesView.php'; 
            $this->navbar = ob_get_clean();
        }
    }
    
	/**
    * Gets the search view
    */
    public function getSearchView()
    {
        if($this->params['query'] != '')
        {
            $this->main_title = "Vigas - Results for ".$this->params['query'];
            $this->content_title = "Results for ".$this->params['query'];
        }
        else
        {
            $this->main_title = "Vigas - No Result";
            $this->content_title = "No Result";
        }
        ob_start();
        require_once __DIR__.'/../../StreamingPlatforms/View/searchView.php';
        $this->content = ob_get_clean();
        
        $div_games_display_class = "col-xs-12 div-navbar";
        $div_game_class = "col-sm-6 col-xs-2 div-prev-navbar";
		ob_start();
        require_once __DIR__.'/../../StreamingPlatforms/View/allGamesView.php'; 
        $this->navbar = ob_get_clean();
    }
    
	/**
    * Gets the linked accounts view
    */
    public function getLinkedAccountView()
    {
        $this->main_title = "Vigas - Login or Create Account";
        $this->content_title = "Login or create account";
		ob_start();
        require_once __DIR__.'/linkedAccountView.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the save token view
    */
    public function getSaveTokenView()
    {
        $this->main_title = "Vigas - Login or Create Account";
        $this->content_title = "Login or create account";
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the user profile view
    */
    public function getProfileView()
    {
        $this->main_title = "Vigas - Settings";
        $this->content_title = "Settings";
		ob_start();
        require_once __DIR__.'/profileView.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the forgot password view
    */
    public function getForgotPasswordView()
    {
        $this->main_title = "Vigas - Forgot Password";
        $this->content_title = "Forgot Password";
		ob_start();
        require_once __DIR__.'/forgotPasswordView.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the reset password view
    */
    public function getResetPasswordView()
    {
        $this->main_title = "Vigas - Reset Password";
        $this->content_title = "Reset Password";
		ob_start();
        require_once __DIR__.'/resetPasswordView.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the about view
    */
    public function getAboutView()
    {
        $this->main_title = "Vigas - About";
        $this->content_title = "About Vigas";
		ob_start();
        require_once __DIR__.'/aboutView.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the 404 view
    */
    public function get404View()
    {
        $this->main_title="Vigas - Page not found";
        $this->content_title="Page not found";
		ob_start();
        require_once __DIR__.'/404View.php';
        $this->content = ob_get_clean();
        $this->getDefaultNavbarView();
    }
    
	/**
    * Gets the default navbar view
    */
    public function getDefaultNavbarView()
    {
		ob_start();
        require_once __DIR__.'/defaultNavbarView.php';
        $this->navbar = ob_get_clean();
    }
    
	/**
    * Gets the template
    */
    public function getTemplate()
    {
        require_once __DIR__.'/template.php';   
    }

}
