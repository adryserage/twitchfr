<?php
use Vigas\Application\Application;
use Vigas\Application\View\Forms;

if(!$this->data['token_validity']) 
{?>
    <h3>Link is expired</h3>
    <p>Your link is expired or you requested a new one. Please check your mailbox or request a new link <a href="<?=Application::getBaseURL()?>forgot-password">here</a>
<?php
}
else
{?>
    <div class="col-md-6">
        <div class="login-form">
        <h5>Enter your new password</h5>
        <?php
        if(isset($this->data['reset_password_error'])){echo $this->data['reset_password_error'];}
        Forms::getResetPasswordForm($_SERVER['REQUEST_URI'], 'post');
        ?>
        </div>
    </div>
    <?php
}

