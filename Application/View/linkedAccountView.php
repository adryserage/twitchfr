<?php
use Vigas\Application\Application;
use Vigas\Application\View\Forms;

if(isset($_SERVER["REDIRECT_URL"]))
{
	if($_SERVER["REDIRECT_URL"]==Application::getBaseURL()."linked-account")
	{
		$main_title="Vigas - Settings";
		$content_title="Settings";
	}

    if(Application::getUser() !== null)
	{
        $user = Application::getUser();
         
		if($_SERVER["REDIRECT_URL"]==Application::getBaseURL()."linked-account" || ($_SERVER["REDIRECT_URL"]==Application::getBaseURL()."following" && Application::getUser()->getFirstLinkDone()==0))
		{?>
		<div class="col-md-12, link-account-form">
			<div class="row">
			<?php
			if(!isset(Application::getLinkedAccounts()['twitch_data']))
			{?>
				<div class="col-md-6">
				<h5>Link your Twitch account</h5>
				<a href="https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=s22t9783kw51czw3yqdt3kvf6onx40w&redirect_uri=https://vigas.tv<?=Application::getBaseURL()?>save-token&scope=user_read channel_read&state=oauth2"><img src="https://ttv-api.s3.amazonaws.com/assets/connect_dark.png"/></a>
				</div>
				<?php
			}
			else
			{?>
				<div class="col-md-6">
				<h5><img class="linked-account-icon" src="<?=Application::getBaseURL()?>/../../Web/img/twitch-icon.png"/>Twitch account</h5>
				<p><?= ucfirst(Application::getLinkedAccounts()['twitch_data']->getUsername());?></p>
				<p><img class="linked-profil-pic" src="<?= Application::getLinkedAccounts()['twitch_data']->getProfilPictureUrl();?>"/></p>
				</div>
				<?php
			}
			if(!isset(Application::getLinkedAccounts()['smashcast_data']))
			{?>	
				<div class="col-md-6">
				<h5>Link your Smashcast account</h5>
				<a href="https://api.smashcast.tv/oauth/login?app_token=pgemZT76WNPjOs9KikyHo1CxA0hRl4YSFbvfaGJd"><img src="<?=Application::getBaseURL()?>/../../Web/img/connect-smashcast.png"/></a>
				</div>
				<?php
			}
			else
			{?>
				<div class="col-md-6">
				<h5><img class="linked-account-icon" src="<?=Application::getBaseURL()?>/../../Web/img/smashcast-icon.png"/>Smashcast account</h5>
				<p><?= ucfirst(Application::getLinkedAccounts()['smashcast_data']->getUsername());?></p>
				<p><img class="linked-profil-pic" src="<?= Application::getLinkedAccounts()['smashcast_data']->getProfilPictureUrl();?>"/></p>
				</div>
				<?php
			}
			?>
			</div>
		</div>
		<?php
            if($_SERVER["REDIRECT_URL"]==Application::getBaseURL()."following")
            {?>
            <div class="col-md-12, first-link-done">
                Once you have link your accounts, click the 'Done' button. You can add more acount later in you profile, under Linked Accounts
                <?php
                if(isset($first_link_error))
                    {echo '<br/>'.$first_link_error;}
                ?>
                <form  class="first-link-done-form" action="<?=Application::getBaseURL()?>following" method="post">
                    <button  name="first-link-done" type="submit" class="btn btn-default">Done</button>
                </form>
            </div>
            <?php
            }
		}
       
	}
	else
	{
		?>
		<h5>You are not logged in, please login or create an account</h5>
		<div class="col-md-6">
			<div class="login-form">
				<h3>Login</h3>
				<?php
				if(isset($this->data['login_error']))
					{echo $this->data['login_error'];}
                isset($this->params['log-username']) ? $username = $this->params['log-username'] : $username = '';
                    Forms::getLoginForm($_SERVER["REDIRECT_URL"], 'post', $username);
				?>
			</div>
		</div>
		
		<div id="create-account-form" class="col-md-6">
			<div class="login-form">
				<h3>Create Account</h3>
				<?php
				if(isset($this->data['create_account_error']))
					{echo $this->data['create_account_error'];}
                isset($this->params) ? $params = $this->params : $params = '';
                    Forms::getCreateAccountForm($_SERVER["REDIRECT_URL"], 'post', $params);
				?>
			</div>
		</div>
		<?php
	}
    
}
