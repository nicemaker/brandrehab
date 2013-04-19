<?php /* PortfolioRest */ ?>
<?php
    defined('C5_EXECUTE') or die(_("Access Denied."));


	
	
	class Portfolio{
		public $id;
		public $data;
		public $bgColor;
		public $index;
		public $name;
		public $changed;
		public $width; 
		public $height;
	}


	class Sprite{
		public $id;
		public $content;
		public $x;
		public $y;
		public $speed_y;
		public $speed_x;
		public $width;
		public $parentId;
	}
 
 	
 	
    class RESTportfolioController extends Controller {
    	
    	
    	/* Get a portfolio, $i = start index, $count = count */
    	
    	public function get($i, $count=1) {
    		$js = Loader::helper('json');
    		
    		$data = array();
    		
    		if($count<=0) exit;
    		Loader::model('page_list');
    	
    		$pl = new PageList();
			$pl->filterByCollectionTypeHandle('portfolio');
    		$pl->sortByDisplayOrder();
    		
    		$pages=$pl->get();
    		
    		$total = $pl->getTotal();
    		
    		
    		if($i >= $total){ exit; }
    		
    		$limit = min($total,$i + $count);
    		
    		for( $i; ( $i<$limit); $i++){
    			$portfolio = new Portfolio();
    			$portfolio->data = array();
				$portfolio->bgColor = $pages[$i]->getAttribute('bgcolor');
				$portfolio->height = $pages[$i]->getAttribute('height');
				$portfolio->width = $pages[$i]->getAttribute('width');
				$portfolio->scrollBy = $pages[$i]->getAttribute('scrollBy') ;
				$portfolio->index = $i;
				$portfolio->id = $pages[$i]->getCollectionID();
				$portfolio->name = $pages[$i]->getCollectionName();
				$portfolio->changed = false;
			
				$blocks = $pages[$i]->getBlocks('Main');
				
								
				foreach ($blocks as $b){
						$sprite= new Sprite;
						$sprite->parentId = $pages[$i]->getCollectionID();
						$sprite->id = $b->getBlockID();
						$spriteController = $b->getInstance();

						if( get_class( $spriteController ) == 'PortfoliospriteBlockController' ){ 
							$sprite->content = $spriteController->getContent(); 
						} 
						else{
							//$sprite->content= $b->getInstance()->content;
						}
						
						$sprite->x=$b->getInstance()->x;
						$sprite->y=$b->getInstance()->y;
						$sprite->speed_x=$b->getInstance()->speed_x;
						$sprite->speed_y=$b->getInstance()->speed_y;
						$sprite->width=$b->getInstance()->width;
						array_push( $portfolio->data,$js->encode($sprite ) );

				}
			 array_push( $data, $js->encode($portfolio) );
			}
	   		print $js->encode( $data );
	   		exit;
    	}
    	
    	function getImage($content	){
    		
    		if( preg_match( '/src=".*\/([a-zA-Z0-9\-\/_.]+)"/',$content,$matches) ){
    			
    			Loader::model('file_list');
    			$fl = new FileList();
    			$fl->filterByKeywords($matches[1]);
    			$files = $fl->get($itemsToGet = 1, $offset = 0);
    			
    			if(count( $files ) > 0){
    				
    				$fID = $files[0]->fID;
    				$fID = "{CCM:FID_".$fID."}";
    				
    				$content = preg_replace( '/(.*src=").*(["].*)/', '$1'.$fID.'$2', $content );			
    			}
    		}
    		
    		return $content;
    
    		
    	}
    	
    	 public function push(){//saves portfolios
	    	
				
				try{  
					$js = Loader::helper('json');  		
	    			$portfolios = $js->decode( $_POST['data'] );
					$parentPage= Page::getByID("1");
									
	    			foreach( $portfolios as $portfolio ){
	    				
    				
					
	    			if($portfolio->id){
	    				$currentCollectionVersion = Collection::getByID($portfolio->id)->getVersionObject();
						$newCollectionVersion = $currentCollectionVersion->createNew('From Positioning');
	    				$page = Page::getByID($portfolio->id,'RECENT');
	    				

	    			}
	    			else{
	    				
	    				
	    				$pt = CollectionType::getByHandle("portfolio");
			    		$data = array(
	        				'name' => $portfolio->name ? $portfolio->name : 'Untitled', 
						);

		    			$page = $parentPage->add($pt,$data);
						
	    			}
	    			
	    			
	    			$page->setAttribute('bgcolor', $portfolio->bgColor);
	    			
	    			$sprites = $portfolio->data;
		    			foreach( $sprites as $sprite){
		    				if($sprite->id){
		    					$b = Block::getByID($sprite->id);
		    					$b->arHandle = 'Main';
		    				}
		    				else{
		    					$bt = BlockType::getByHandle('portfoliosprite');
		    					$b = $page->addBlock($bt, 'Main', $data);
		    				}
		    				$sprite->content = RESTportfolioController::getImage ($sprite->content ) ;
		    				if($sprite->changed == 'true'){
		    					$b = $b->duplicate( $page );
		    					$b->update( RESTportfolioController::spriteToArray( $sprite ) );
		    				}
		    				else{
		    					$b->alias( $page );
		    				}
		    					    			
		    				
		    			}
						    			
	    			}
	    			echo 'success';

				}
				catch( Exception $e ){
					echo( $e->getMessage() );
				}
				exit;

    		
    	}
    	    	
    	
    	
    	public function fix(){
    		Loader::model('page_list');
			$pl = new PageList();
			$pl->filterByCollectionTypeHandle('portfolio');
			$pages = $pl->get(200);
			foreach( $pages as $page ){
				
				$blocks = $page->getBlocks('Main');
								
				foreach ($blocks as $b){
						
						$b->getBlockID();
						$controller = $b->getInstance();

						if( get_class( $controller ) == 'PortfoliospriteBlockController' ){ 
							$content = $controller->getContent(); 
						} 
						else{
							$content= $controller->content;
						}
						$content = RESTportfolioController::getImage ($b->getInstance()->content ) ;
						$b->getInstance()->save( array( content=>$content ) );
						echo $b->getInstance()->content. "\n";

				}
			}
    	}
    	
    	function spriteToArray( $sprite){
    		return array(
    			x=>$sprite->x,
    			y=>$sprite->y,
    			speed_y=>$sprite->speed_y,
    			speed_x=>$sprite->speed_x,
    			content=>$sprite->content,
    			width=>$sprite->width,
    		);
    	}
    	
    	
    
    }
?>