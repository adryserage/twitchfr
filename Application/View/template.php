<!DOCTYPE html>
<?php 
use Vigas\Application\Application;
?>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Vigas.tv is a platform where you can find every live streams and games from the most famous video games streaming website (Twitch and Smashcast)">
    <meta name="author" content="">
	<meta name="msvalidate.01" content="D02ED94A47FD1A453C17B84A83E6CB17" />
	
	<meta name="robots" content="noindex,nofollow" />


    <title><?= $this->main_title ?></title>
	<?php
	if (isset($_GET['action']) && $_GET['action'] == 'about' && !isset($e))
	{
		echo "<script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>";
	}
	?>
	
	<link href="https://plus.google.com/b/117076079832095712778" rel="publisher" />
	<link rel="icon" type="image/x-icon" href="<?=Application::getBaseURL()?>favicon.ico" />
	
    <!-- Bootstrap Core CSS -->
    <link href="<?=Application::getBaseURL()?>/../Web/css/bootstrap.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="<?=Application::getBaseURL()?>/../Web/css/sb-admin.css" rel="stylesheet">

    <!-- Morris Charts CSS -->
    <link href="<?=Application::getBaseURL()?>/../Web/css/plugins/morris.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="<?=Application::getBaseURL()?>/../Web/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	
	<link href="<?=Application::getBaseURL()?>/../Web/css/style.css" rel="stylesheet">
	
</head>

<body>

    <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <!-- Brand and toggle get grouped for better mobile display -->
            <header class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<?=Application::getBaseURL()?>"><img alt="vigas logo" src="<?=Application::getBaseURL()?>/../Web/img/logo.png" /></a>

            </header>
            <!-- Top Menu Items -->
            <ul class="nav navbar-right top-nav">
				<li>
					<form class="search-form" action="<?=Application::getBaseURL()?>search/" method="post">
						  <input type="text" class="search-field form-control" name="query" placeholder="Search">
						  <button type="submit" class="btn btn-default search-btn"></button>
					</form>
				</li>
				<?=$this->navbar_account?>
            </ul>
            <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <nav class="nav navbar-nav side-nav">
					<?= $this->navbar ?>
					<div id="social-network" class="col-xs-12">
						<div class="fb-like" style="display:block;" data-href="https://www.facebook.com/Vigas.TV" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
						<div class="gplus-like"><div class="g-plusone" data-href="https://plus.google.com/+VigasTv"></div></div>
					</div>
                </nav>
            </div>
            <!-- /.navbar-collapse -->
        </nav>

        <div id="page-wrapper">
			<!-- Top mainpage - Last update information -->
			<?php if(!isset($_SESSION['dont-show-update']) && !isset($_COOKIE['dont-show-update']))
			{?>
			<div class="col-lg-12">
                <div class="alert alert-info alert-dismissable update-alert">
                    <button id="close-update" type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
					<ul class="stop-update">
						<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-gear"></i></a>
						<ul class="dropdown-menu dont-show-anymore">
							<li>
								<a id="dont-show-anymore" href="#" data-dismiss="alert" aria-hidden="true">Dont show anymore</a>
							</li>
						</ul>
						</li>
					</ul>
                    <i class="fa fa-info-circle"></i>  <strong>New Update</strong> You can now create an account and link your Twitch or Smashcast accounts to Vigas in order to see all your following channels. <a href="<?=Application::getBaseURL()?>following" class="info-link"><strong>Try it now !</strong></a>
                </div>
            </div>			
			<?php
			}
			if (isset($_GET['action']) && ($_GET['action'] == 'about' || $_GET['action'] == '404') && !isset($e))
			{
				$class="reduced-container";
			}
			else
			{
				$class="";
			}?>
			<section class="container-fluid <?= $class ?>">
                <!-- Page Heading -->
                <div class="row">
                    <header class="col-lg-12">
                        <h1 class="page-header">
                            <?= $this->content_title ?>
                        </h1>
                    </header>
                </div>
                <!-- /.row -->
				<?php
				if(!isset($_GET['action']) || (isset($_GET['action']) && $_GET['action'] == 'following'))
				{?>
					<ul class="nav nav-tabs">
						<li <?php if(!isset($_GET['action'])) {echo "class=\"active\"";} ?>><a href="<?=Application::getBaseURL()?>">All</a></li>
						<li <?php if(isset($_GET['action']) && $_GET['action'] == 'following') {echo "class=\"active\"";} ?>><a href="<?=Application::getBaseURL()?>following">Following</a></li>
					</ul>
				<?php
				}
				if(isset($_GET['action']) && ($_GET['action'] == 'profile' || $_GET['action'] == 'linked-account'))
				{?>
					<ul class="nav nav-tabs">
						<li <?php if($_GET['action']=='profile') {echo "class=\"active\"";} ?>><a href="<?=Application::getBaseURL()?>profile">Profile</a></li>
						<li <?php if($_GET['action']=='linked-account') {echo "class=\"active\"";} ?>><a href="<?=Application::getBaseURL()?>linked-account">Linked accounts</a></li>
					</ul>
				<?php
				}
				
				if (!isset($_GET['action']) || $_GET['action'] == 'streams-by-game' || $_GET['action'] == 'following' && (Application::getLinkedAccounts()!== null && Application::getUser()->getFirstLinkDone()==1) && !isset($e))
				{
					?>	
					<div class="source-choice">
						<label><input type="checkbox" checked id="All" onclick="reload(this.id);" value="All">All</label>
						<label><input type="checkbox" checked id="Twitch" onclick="reload(this.id);" value="Twitch">Twitch</label>
						<label><input type="checkbox" checked id="Smashcast" onclick="reload(this.id);" value="Smashcast">Smashcast</label>
						<div id="source-choice-loading"></div>					
					</div>
				<?php } ?>
				<div id="content">	
					<?= $this->content ?>
				</div>
            </section>
            <!-- /.container-fluid -->
			
			<footer id="footer" class="<?= $class ?>">
				<p><a href="<?=Application::getBaseURL()?>">Vigas.tv</a> v1.5 | 2016 - 2017 | <a href="<?=Application::getBaseURL()?>about">About</a> | Template based on <a target="_blank" href="https://startbootstrap.com/template-overviews/sb-admin/">SB Admin</a> | <a target="_blank" href="https://www.facebook.com/Vigas.TV/"><img alt="facebook logo" src="<?=Application::getBaseURL()?>/../Web/img/facebook.png"/></a> <a target="_blank" href="https://plus.google.com/+VigasTv/about"><img alt="google plus logo" src="<?=Application::getBaseURL()?>/../Web/img/googleplus.png"/></a> | <a target="_blank" href="https://www.beyondsecurity.com/vulnerability-scanner-verification/vigas.tv" >
<img src="https://seal.beyondsecurity.com/verification-images/vigas.tv/vulnerability-scanner-9.gif" alt="Vulnerability Scanner" border="0" />
</a></p>
			</footer>
			
        </div>
        <!-- /#page-wrapper -->
		
    </div>
    <!-- /#wrapper -->

    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js" integrity="sha384-K+ctZQ+LL8q6tP7I94W+qzQsfRV2a+AfHIi9k8z8l9ggpc8X+Ytst4yBo/hH+8Fk" crossorigin="anonymous"></script>
    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.js" integrity="sha384-nbu0EcklP74/4DaTXgE8DZcxAX458y/YsSqsK9R31nCkAtdJC5tHRoMsGlNqpo2H" crossorigin="anonymous"></script>
	<script src="<?=Application::getBaseURL()?>/../Web/js/script.js"></script>
    <!-- Morris Charts JavaScript -->
    <script src="<?=Application::getBaseURL()?>/../Web/js/plugins/morris/raphael.min.js"></script>
    <script src="<?=Application::getBaseURL()?>/../Web/js/plugins/morris/morris.min.js"></script>
    <script src="<?=Application::getBaseURL()?>/../Web/js/plugins/morris/morris-data.js"></script>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-76196030-2', 'auto');
	  ga('send', 'pageview');

	</script>
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>
	<script src="https://apis.google.com/js/platform.js" async defer></script>
</body>
</html>
