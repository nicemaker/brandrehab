	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <?php Loader::element('header_required'); ?>
    <link rel="stylesheet" type="text/css" href="<?php print $this->getStyleSheet('css/main.css'); ?>" />
    <!--link rel="stylesheet" type="text/css" href="<?php print $this->getStyleSheet('typography.css'); ?>"/-->
</head>

<script src="<?php print $this->getThemePath();?>/js/jquery.js"></script>
<script src="<?php print $this->getThemePath();?>/js/jquery.json-2.3.min.js"></script>
<script src="<?php print $this->getThemePath();?>/js/jquery.scrollTo-1.4.2-min.js"></script>
<script src="<?php print $this->getThemePath();?>/js/ngr.js"></script>

<?php 

global $c;
$isEditMode = $c->isEditMode();
$u = new User();
$g = Group::getByName('Administrators');
$isLoggedIn = $u->isSuperUser()||$u->inGroup($g);
?>


<script>
	//preloading fonts and some images via preloadStack container
	
	$(document).ready( function(){
		ngr.init( <?php echo $isLoggedIn && !$isEditMode ?>  );
		ngr.load( loaded );
	})
	
	$(window).load( function(){
		$('#preloadStack').remove();
		loaded();
			
	})
	
	var loadCount=0;
	function loaded( e ){
		loadCount++;
		if(loadCount==2){
			$('.preload').css('display','none');	
			ngr.display();
		}
	}
	
		
		
</script>


<body class="default">


<div id="trace"></div>

<div id="c5Margin" <?php if($isEditMode) echo 'style="position:static"'; if($isLoggedIn && !$isEditMode) echo 'style="top:50px"';?>>





<div id="cache">
	<div id="saveArea"></div>
	<div class="preload">loading</div>
	<div id="nav" >
		<a href="#" class="logo"></a>
		<div id="compass">
			<div class="toolTip"></div>
			<a class="left" href="#"></a>
			<a class="right" href="#"></a>
			<a class="up" href="#"></a>
			<a class="down" href="#"></a>
			<a class="circle active" href="#"></a>
		</div>
		<div id="pager">
		</div>
	</div>
	<div id="content" >
	
	
	
	<?php
		/*
		Loader::model('page_list');
		$pl = new PageList();
		if(isLoggedIn) $pl->displayUnapprovedPages();
		$pl->filterByCollectionTypeHandle('portfolio');
    	$pl->sortByDisplayOrder();
    	
    	
    	$pages=$pl->get();
    	
		
 
   		foreach($pages as $page){
   			
   			$bgColor = $page->getAttribute('bgcolor');
			$scrollBy = $page->getAttribute('scrollBy');
			$width = $editMode ? '' :'6000px'  ;//$page->getAttribute('width');
			$height = $editMode ? '' : $page->getAttribute('height').'px';
			$id = $page->getCollectionID();
			$name = $page->getCollectionName();
				
			
			$blocks = $page->getBlocks('Main');					
			
			
			echo '<div class="portfolio" name="'.$name.'" id="'.$id.'" style="background-color:'.$bgColor.';width:'.$width.';height:'.$height.'" >';
			echo '<div class="meta">scrollBy:'.$scrollBy.'</div>';
			foreach ($blocks as $b){
				$sprites = $sprites.$b->display();
			}
			echo '</div>';
			
   		}
 

		*/
	?>
	
	
	
	</div>
</div>

</div>

<div id="scrollSizer"></div>


<div id="preloadStack" style="visibility:hidden">
		<div class="sprite">
			<div class="content"><h1>load fonts<h1/><p>load more fonts</p></div>
		</div>
		<div class="left active"></div>
		<div class="left over"></div>
		<div class="right active"></div>
		<div class="right over"></div>
		<div class="up active"></div>
		<div class="up over"></div>
		<div class="down active"></div>
		<div class="down over"></div>
		<div class="circle active"></div>
		<div class="circle over"></div>
</div>
	
<?php Loader::element('footer_required'); ?>

 </body>
 
 
 </html>
 