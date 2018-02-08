<?php
use Vigas\Application\Application;

if($this->params['games_limit']==6)
{?>
    <h4>Top 6 games</h4>
<?php
}
?>
<div id="games-display" class="<?= $div_games_display_class ?>">
<?php require_once __DIR__.'/../View/gamesContent.php';

if($this->params['games_limit']==24)
{
    ?>
	</div>
    <input type="hidden" id="offset" value="<?=$this->params['games_offset'] + $this->params['games_limit']?>">
    <input type="hidden" id="type" value="games">
    <?php

    if(count($this->data['games_to_display']) == $this->params['games_limit']  && $this->params['games_offset'] + $this->params['games_limit']<72)
    {?>
        <div id="load-more-div">
                <button id="load-more" class="btn btn-sm btn-primary load-more-btn">Load more streams</button>
        </div>
    <?php
    }
}
if($this->params['games_limit']==6)
{?>
    <a href="<?=Application::getBaseURL()?>games"><button name="view-more" class="btn btn-sm btn-primary view-more-btn">View all games</button></a>
	</div>
<?php
}

