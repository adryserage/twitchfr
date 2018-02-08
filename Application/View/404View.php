<?php
use Vigas\Application\Application;
?>
<p class="center">It seems you got lost. To make you feel better, here is an amazing gif !</p>
<p class="center">Now, you can go back to <a href="<?=Application::getBaseURL()?>">main page</a></p>
<p class="center"><img class="gif-404" alt="amazing gif" src="<?=$this->data['file_path']?>"/></p>
<?php

