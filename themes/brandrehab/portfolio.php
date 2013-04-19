<?php /* Portfolio Page Type */ ?>
	
<?php $page=Page::getCurrentPage() ?>

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

<script>
<?php global $c;

$isEditMode = $c->isEditMode();
$u = new User();
$g = Group::getByName('Administrators');
$isLoggedIn = $u->isSuperUser()||$u->inGroup($g);
?>


<?php if(!$isEditMode): ?>
	$(document).ready( function(){
		ngr.init( <?php echo $isLoggedIn && !$isEditMode ?>  );
		ngr.parseHTML( $("#content"));
		$("#content").empty();
	})
	
	$(window).load( function(){
		ngr.display();
				
	})
<?php endif; ?>
</script>


<body >

<div id="c5Margin" <?php if($isEditMode) echo 'style="position:static"'; if($isLoggedIn && !$isEditMode) echo 'style="top:50px"';?>>

<div id="trace"></div>

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
	<div id="content">

	<?php 
		$bgColor = $page->getAttribute('bgcolor');
		$scrollBy = $page->getAttribute('scrollBy');
		$width = $editMode ? null : $page->getAttribute('width').'px';
		$height = $editMode ? null : $page->getAttribute('height').'px';
		$id = $page->getCollectionID();
		$name = $page->getCollectionName();
		
		echo '<div class="portfolio" name="'.$name.'" id="'.$id.'" style="background-color:'.$bgColor.';width:'.$width.';height:'.$height.'" >';
		echo '<div class="meta">scrollBy:'.$scrollBy.'</div>';
		$a = new Area('Main');
		$a->display($c);
		echo '</div>';
	
	?>
	</div>
</div>

</div>
<div id="scrollSizer"></div>

<?php Loader::element('footer_required'); ?>

 </body>
 
 
 </html>
 