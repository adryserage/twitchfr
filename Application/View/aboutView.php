<?php
use Vigas\Application\Application;
use Vigas\Application\View\Forms;

?>
<div class="col-md-12">
	<p>Vigas.tv has been release in Juin 2016. It is a platform where you can find every live streams and games from the most famous video games streaming website (Twitch and Smashcast so far, more will join).</p>

	<h3>Patch Notes :</h3>
	
	<p><em>v1.5.1 - 04/14/2017</em><br/>
	- Removed Azubu and Hitbox since they merged to become Smashcast</p>
	<p><em>v1.5 - 11/17/2016</em><br/>
	- You can now create an account and link your Twitch, Hitbox or Azubu account(s)<br/>
	- Added a "following" section that show your following live streams<br/>
	- Added a default navigation menu on the page where there was none</p>
	<p><em>v1.2 - 09/14/2016</em><br/>
	- Added a pop-up if users try to load the stream page with a non-existent ID.<br/>
	- "load more streams" button used to appear in the midlle of the page when loading a stream after changing source(s)<br/>
	- Gif was not loaded on 404 page<br/>
	- Added Facebook and Google+ like button</p>
	<p><em>v1.1 - 06/11/2016</em><br/>
	- Added about page<br/>
	- Added 404 page<br/>
	- Fixed bug where games cover were not displayed in search result</p>
	<p><em>v1.0 - 06/01/2016</em><br/>
	First version, not much to say, there might be some bugs left, especially on mobiles.</p>

	<h3 id="form">Feedback/Bug report :</h3>
	<p>Just tell me how much you love Vigas ;)<br/>
	Or anything else you want, what you like about Vigas, what you don't, or any improvement idea you may have. You can also report a bug.</p>
</div>

<div class="col-md-8 col-sm-10">
    <?php
        if(isset($this->data['message']))
            {echo $this->data['message'];}
        array_push($this->params, $this->data['selected']);
        Forms::getAboutForm(Application::getBaseURL().'about#form', 'post', $this->params);
    ?>
</div>
<div class="col-xs-12">
	<h3>Follow Vigas :</h3>
    <a target="_blank" href="https://www.facebook.com/Vigas.TV/"><img class="social-network" alt="facebook logo" src="<?= Application::getBaseURL()?>/../../Web/img/facebook.png"/>Facebook</a><br/>
	<a target="_blank" href="https://plus.google.com/+VigasTv/about"><img class="social-network" alt="google plus logo" src="<?=Application::getBaseURL()?>/../../Web/img/googleplus.png"/>Google +</a>
</div>
<?php

