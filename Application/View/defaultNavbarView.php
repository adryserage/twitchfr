<?php
use Vigas\Application\Application;

?>
<div class="col-xs-12 div-default-navbar">
	<ul class="default-navbar">
		<a href="<?=Application::getBaseURL()?>"><li class="default-navbar-item"><i class="fa fa-fw fa-video-camera"></i> All streams</li></a>
		<a href="<?=Application::getBaseURL()?>games"><li class="default-navbar-item"><i class="fa fa-fw fa-gamepad"></i> All games</li></a>
		<?php if(Application::getUser() !== null){ ?>
		<a href="<?=Application::getBaseURL()?>following"><li class="default-navbar-item"><i class="fa fa-fw fa-heart"></i> Following</li></a>
		<?php } ?>
		<?php if(Application::getUser() !== null){ ?>
		<a href="<?=Application::getBaseURL()?>profile"><li class="default-navbar-item"><i class="fa fa-fw fa-user"></i> Profile</li></a>
		<?php } ?>
	</ul>
</div>

<?php
