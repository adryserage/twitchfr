<?php

use Vigas\Application\Application;

if($this->params['streams_limit']==3)
{?>
	<h4>Top 3 live streams</h4>
	<?php
	$separator = "<br />";
}
else
{
	$separator = " playing ";
	
}

if(count($this->data['streams_to_display']) > 0)
{	
	foreach($this->data['streams_to_display'] as $stream) 
	{	
		$game = $stream->getGame();
		?>
		<div id="<?= $stream->getChannelName()?>" class="<?= $div_stream_class ?>">
			<div style="background-image:url(<?= $stream->getPreviewUrl()?>); background-size : contain;" >
				<img class="preview" alt="stream overlay" src="<?= Application::getBaseURL()?>Web/img/degrade-<?= $stream->getSource()?>.png" />
			</div>
			<p class="stream-infos"><?= $stream->getChannelDisplayName().$separator ?><a href="<?=Application::getBaseURL()?>streams-by-game/<?= urlencode($game) ?>"><?= urldecode($game) ?></a></p>

			<div class="overlay stream-ov">
				<?php
				if (!isset($_GET['action']))
				{?>
				<h5 class="stream-status"><?= $stream->getStatus()?></h5>
				<?php } ?>
				<p class="viewers"><img alt="viewer icon" src="<?=Application::getBaseURL()?>Web/img/viewer-icon.png" /><?= $stream->getViewers()?></p>
				<img class="play-stream" alt="play stream icon" src="<?=Application::getBaseURL()?>Web/img/play-logo.png" />
			</div>
		</div>
		<input type="hidden" id="stream-<?= $stream->getChannelName()?>" value="<?= $stream->getStreamUrl()?>">
		<input type="hidden" id="chat-<?= $stream->getChannelName()?>" value="<?= $stream->getChatUrl()?>">
	<?php
	}
}

else
{?>
    <input type="hidden" id="type" value="<?= isset($_GET['action']) ? htmlspecialchars($_GET['action']) : 'streams' ?>">
    <?php
    if(isset($_GET['game']))
    {?>
        <input type="hidden" id="game" value="<?=urlencode($_GET['game'])?>">
    <?php
    }
    if(empty($this->params['source_array']))
    {?>
        <p class="alert alert-warning">No streaming platform selected. Please select at least one.</p>
    <?php
    }
    else
    {
		if(!isset($_GET['game']))
		{
			$game = "";
		}
		else
		{
			$game = ' '.htmlspecialchars(urldecode($_GET['game']));
		}
        $display_source=" on ";
        foreach($this->params['source_array'] as $key => $source)
        {
            if($source!="All")
            {
                if(!isset($this->params['source_array'][$key+2]) && isset($this->params['source_array'][$key+1]))
                {
                    $display_source.= $source." or ";
                }
                elseif(!isset($this->params['source_array'][$key+1]))
                {
                    $display_source.= $source;
                }
                else
                {
                    $display_source.= $source.", ";
                }
            }
        }?>
        <p class="alert alert-warning">Couldn't find any<?=$game?> live stream <?=$display_source?></p>
    <?php
    }
}
