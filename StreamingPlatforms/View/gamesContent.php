<?php

use Vigas\Application\Application;

foreach($this->data['games_to_display'] as $game) 
{?>
    <div id="<?= $game->getId() ?>" class="<?= $div_game_class ?>">
        <a class="game-link" href="<?=Application::getBaseURL()?>streams-by-game/<?= urlencode($game->getGame()) ?>">
        <div>
            <img class="preview" alt="game image" src="<?= $game->getBox() ?>"/>
        </div>
        <div class="overlay game-ov">
            <p><?= urldecode($game->getGame()) ?></p>
            <p class="game-infos"><img alt="viewer icon" src="<?=Application::getBaseURL()?>Web/img/viewer-icon.png" /> <span><?= $game->getViewers() ?></span></p>
        </div>
        </a>
    </div>
    <?php
}