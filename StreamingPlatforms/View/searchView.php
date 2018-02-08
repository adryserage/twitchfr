<?php
use Vigas\Controller\Application;

if(isset($this->params['query']))
{
	if(count($this->data['streams_array'])>0)
	{
		?>
		<div id="allStreams-display" class="row">
		<h3>Streams</h3>
		<?php
		$nb_streams_array = count($this->data['streams_array']);
		for($i=0;$i<$nb_streams_array; $i++) 
		{	
			$game = ucwords($this->data['streams_array'][$i]->getGame());
			?>
			<div id="<?= $this->data['streams_array'][$i]->getChannelName()?>" class="col-lg-3 col-md-4 col-xs-6 div-prev">
				<div style="background-image:url(<?= $this->data['streams_array'][$i]->getPreviewUrl()?>); background-size : contain;" >
					<img class="preview" alt="stream overlay" src="<?=Application::getBaseURL()?>/../../Web/img/degrade-<?= $this->data['streams_array'][$i]->getSource()?>.png" />
				</div>
				<p class="stream-infos"><?= $this->data['streams_array'][$i]->getChannelDisplayName()?> playing <a href="<?=Application::getBaseURL()?>streams-by-game/<?= urlencode($game) ?>"><?= urldecode($game) ?></a></p>
			
				<div class="overlay stream-ov">
					<h5 class="stream-status"><?= $this->data['streams_array'][$i]->getStatus()?></h5>
					<p class="viewers"><img alt="viewer icon" src="<?=Application::getBaseURL()?>/../../Web/img/viewer-icon.png" /><?= $this->data['streams_array'][$i]->getViewers()?></p>
					<img class="play-stream" alt="play stream icon" src="<?=Application::getBaseURL()?>/../../Web/img/play-logo.png" />
				</div>
			</div>
			<input type="hidden" id="stream-<?= $this->data['streams_array'][$i]->getChannelName()?>" value="<?= $this->data['streams_array'][$i]->getStreamUrl()?>">
			<input type="hidden" id="chat-<?= $this->data['streams_array'][$i]->getChannelName()?>" value="<?= $this->data['streams_array'][$i]->getChatUrl()?>">
		<?php
		}
		?>
		</div>
		<?php
	}
	
	if(count($this->data['games_array'])>0)
	{
		?>
		<div id="allGames-display" class="row">
		<h3>Games</h3>
		<?php
		$nb_games_array = count($this->data['games_array']);
		for($i=0;$i<$nb_games_array; $i++) 
		{ ?>
			<div id="<?= $this->data['games_array'][$i]->getId() ?>" class="col-lg-2 col-md-3 col-xs-4 div-prev">
				<a class="game-link" href="<?=Application::getBaseURL()?>streams-by-game/<?= urlencode($this->data['games_array'][$i]->getGame()) ?>">
				<div>
					<img class="preview" alt="game image" width="100%" src="<?= $this->data['games_array'][$i]->getBox() ?>"/>
				</div>
				<div class="overlay game-ov">
					<p><?= urldecode($this->data['games_array'][$i]->getGame()) ?></p>
				</div>
				</a>
			</div>
		<?php
		}
		?>
		</div>
		<?php
	}
	
	if(count($this->data['streamers'])>0)
	{?>
		<div id="Streamers-display" class="row">
		<h3>Offline streamer</h3>
		<?php
		foreach($this->data['streamers'] as $streamer)
		{?>
			<p class="streamer"><a target="_blank" href="<?=$streamer["profile_link"]?>"><?=$streamer["name"]?></a> (<?=$streamer["source"]?>)</p>
		<?php
		}
		?>
		</div>
		<?php
	}
	
	if(count($this->data['streams_array'])==0 && count($this->data['games_array'])==0 && count($this->data['streamers'])==0)
	{?>
		<p>Couldn't find anything for <?=$this->params['query']?>. Please try an other research</p>
	<?php
	}
}
else
{
    ?>
	<p>You did not enter any keyword<p>
    <?php 
}
