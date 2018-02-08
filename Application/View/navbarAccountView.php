<?php
use Vigas\Application\Application;
use Vigas\Application\View\Forms;

if(Application::getUser() !== null)
{?>
	<li class="dropdown">
	<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <?=ucfirst(Application::getUser()->getUsername())?> <b class="caret"></b></a>
	<ul class="dropdown-menu dropdown-profile">
		<li>
            <a href="<?= Application::getBaseURL()?>profile"><i class="fa fa-fw fa-user"></i>Profile</a>
		</li>
		<li>
			<a href="<?=Application::getBaseURL()?>linked-account"><i class="fa fa-fw fa-gear"></i>Linked Accounts</a>
		</li>
		<li class="divider"></li>
		<li>
			<a href="<?=Application::getBaseURL()?>logout"><i class="fa fa-fw fa-power-off"></i>Log Out</a>
		</li>
		<li class="divider"></li>
		<li>
			<a href="<?=Application::getBaseURL()?>about"><i class="fa fa-fw fa-info-circle"></i>About</a>
		</li>
	</ul>
	</li>
<?php
}
else
{
?>
	<li class="dropdown">
	<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa"></i>Sign In<b class="caret"></b></a>
	<ul class="dropdown-menu dropdown-form-account">
		<?php
		if(isset($this->data['login_error']))
            {echo $this->data['login_error'];}
        isset($this->params['log-username']) ? $username = $this->params['log-username'] : $username = '';
            Forms::getLoginForm(Application::getBaseURL()."following", 'post', $username);
		?>
	</ul>
	</li>
	
	<li class="dropdown">
	<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa"></i>Join Now<b class="caret"></b></a>
	<ul class="dropdown-menu dropdown-form-account">
		<?php
		if(isset($this->data['create_account_error']))
            {echo $this->data['create_account_error'];}
        isset($this->params) ? $params = $this->params : $params = '';
            Forms::getCreateAccountForm(Application::getBaseURL()."following", 'post', $params);
		?>
	</ul>
	</li>
<?php
}
