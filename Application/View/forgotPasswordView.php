<?php
use Vigas\Application\Application;
use Vigas\Application\View\Forms;
?>
	<div class="col-md-6">
        <div class="login-form">
        <h5>Enter the email adress you used to create your account</h5>
        <?php
        if(isset($this->data['find_email']['email_found'])){echo $this->data['find_email']['email_found'];}
        if(isset($this->data['forgot_password_error'])){echo $this->data['forgot_password_error'];}
        isset($this->params['email']) ? $email = $this->params['email'] : $email = '';
        Forms::getForgotPasswordForm(Application::getBaseURL().'forgot-password', 'post', $email);
        ?>
        </div>
	</div>
	
	<div class="col-md-6">
        <div class="login-form">
        <h5>If you dont remember it, enter your username</h5>
        <?php
        if(isset($this->data['find_email']['username_not_found'])){echo $this->data['find_email']['username_not_found'];}
        isset($this->params['username']) ? $username = $this->params['username'] : $username = '';
        Forms::getFindEmailForm(Application::getBaseURL().'forgot-password', 'post', $username);
        ?>
        </div>
	</div>
<?php	
	
