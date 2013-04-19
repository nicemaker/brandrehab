<?php /* Portfolio Sprite Edit */ ?>
<?php  defined('C5_EXECUTE') or die("Access Denied.");
Loader::element('editor_config');
?>

<style type="text/css" media="screen">
	.ccm-block-field-group h2 { margin-bottom: 5px; }
	.ccm-block-field-group td { vertical-align: middle; text-align:right; padding:3px; }
</style>



<div class="ccm-block-field-group">
<h2>Attributes</h2>
	<table>
		<tr>
			<td>X</td>
			<td><?php  echo $form->text('x', $x, array('style' => 'width: 50px')); ?></td>
			<td>Y</td>
			<td><?php  echo $form->text('y', $y, array('style' => 'width: 50px')); ?></td>
			<td>Speed X</td>
			<td><?php  echo $form->text('speed_x', $speed_x, array('style' => 'width: 50px')); ?></td>
			<td>Speed Y</td>
			<td><?php  echo $form->text('speed_y', $speed_y, array('style' => 'width: 50px')); ?></td>
		</tr>
		<tr>
			<td></td>
				<td>Width</td>
				<td><?php  echo $form->text('width', $width, array('style' => 'width: 50px')); ?></td>
			<td></td>
		</tr>
	</table>
</div>

<div class="ccm-block-field-group">
	<h2>Content</h2>
	<?php  Loader::element('editor_controls'); ?>
	<textarea id="spriteContent" name="content" class="ccm-advanced-editor"><?php  echo $content; ?></textarea>
</div>





