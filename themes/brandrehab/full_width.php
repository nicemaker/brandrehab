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
	
</script>


<body class="fullWidth">

<a href="#"><img class="logo" src="<?php print $this->getThemePath();?>/images/brand-rehab-logo.png" style="width:325px;height:47px;" alt="BrandRehab"/></a>

<div class="content">
	
<?php
	$a = new Area('Main');
	$a->display($c);
?>
	
</div>

<?php Loader::element('footer_required'); ?>

 </body>
 
 
 </html>
 