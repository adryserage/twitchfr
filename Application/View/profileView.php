<?php

use Vigas\Application\Application;
use Vigas\Application\View\Forms;

if(Application::getUser() !== null)
{?>
	<div class="col-md-4 col-sm-6">
        <?php 
        if(isset($this->data['change_pwd_error']))
            {echo $this->data['change_pwd_error'];}
            Forms::getProfileForm($_SERVER["REDIRECT_URL"], 'post', Application::getUser());
        ?>
	</div>
<?php
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
