<?php /* Portfolio Sprite View */ ?>

<?php  defined('C5_EXECUTE') or die("Access Denied.");
?>
<?php global $c; $spriteClass = ($c->isEditMode()) ? 'sprite spriteEditMode' :  'sprite'; ?>

<div class="<?php echo $spriteClass ?>" id="<?php echo $bID ?>" <?php  if (!empty($width)){ 
	echo 'style="width:'.$width.'px"';}?> />
	<div class="meta"><?php 
		echo 'speed_x:'.$speed_x;
		echo ',speed_y:'.$speed_y;
		echo ',x:'.$x;
		echo ',y:'.$y;
		?></div>
	<div class="content">
	<?php  if (!empty($content)): ?>
	<?php  echo $controller->getContent(); ?>
	<?php  endif; ?>
	</div>
</div>



