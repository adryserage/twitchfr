<?php
use Vigas\Application\Application;

$nb_streams_to_display = count($this->data['streams_to_display']);

if($nb_streams_to_display>0)
{
	?>
    <div id="streams-display" class="<?= $div_streams_display_class ?>">
	<?php require_once __DIR__.'/../View/streamsContent.php'; ?>
	
	<?php
    if($this->params['streams_limit']==36)
    {
        ?>
		</div>
        <input type="hidden" id="offset" value="<?=$this->params['streams_offset'] + $this->params['streams_limit']?>">
        <input type="hidden" id="type" value="streams">
        <?php
    
        if($nb_streams_to_display == $this->params['streams_limit'] && $this->params['streams_offset'] + $this->params['streams_limit'] < 144)
        {?>
            <div id="load-more-div">
                <button id="load-more" class="btn btn-sm btn-primary load-more-btn">Load more streams</button>
            </div>	
        <?php
        }

        if(isset($this->params['id-stream']))
        {?>
            <input type="hidden" id="id-stream" value="<?=$this->params['id-stream']?>">
        <?php
        }
    }
    if(isset($_GET['action']) && $_GET['action'] == 'games')
    {?>
        <a href="<?=Application::getBaseURL()?>"><button name="view-more" class="btn btn-sm btn-primary view-more-btn">View all streams</button></a>
        </div>
    <?php
    }


}

