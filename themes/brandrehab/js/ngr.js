 var ngr = (function($){

        var m = {};
        m.loaded = false;
        
		var editMode = false;
		var debugMode = false;
		
		var nav = {display:null,pager:null,showCompass:false,up:null,down:null,right:null,left:null,circle:null,logo:null,toolTip:null,over:''};
		var $content;
		

		var freeze = false;//freeze on animation, avoids loading and opening of portfolios and click on buttons while animating
		
		var edit_x = true;
		var edit_y = false;
		var firstClick = false;
		var scrollInterval=-1;
		
		var currentSprite = null;
		var backupSprite = null;
		var currentPortfolio;
		var scrollInterval=-1;
		
		var portfolios=[];
 		var cam;
 		var saveArea;
 		var mouse;
 	
 		
 		
 		
 /* START 
 Portfolio Load section:
 Portfolios are saved and loaded via json.
 After a portfolio json has been loaded parseJson() creates native js objects, 
 addPortfolio created via portfolioToHTML() the HTML DOM object and adds it to siplay list.
 All portfolios are saved in portfolios:array.
 */
 
 

 		
 		/*
 			add a portfolio to the display list and removes exising portfolio with same id
 		*/
 		function addPortfolio(portfolio){
 			portfolio.loading = 0;
 			
 			var $pf = portfolioToHTML( portfolio );
 			var $exists =  $('#' +portfolio.id );
 			if($exists.length){
 				$exists.replaceWith( $pf );
 			}
 			else{
 				
 				$content.append( $pf );
 				var $pagerButton = $( '<a href="#"  class="pagerButton"/>' );	
 				$('#pager').append( $pagerButton );
 				
 			}
 			
 			if(portfolio.width > parseInt( $content.css('width') ) ){
 				
 				$content.css( 'width',portfolio.width  ); 
 			}
 			updateDisplay();
 		}
 		
 	
 		
 		/* searches sprites by id and returns it if exists, otherwise null */
 		function getSpriteById( id ){
 			var i = portfolios.length;
 			while(i--){
 				var n=portfolios[i].data.length;
 				while(n--){
 					if( portfolios[i].data[n].id == id){
 						return portfolios[i].data[n];
 					}
 				}
 			}
 			return null;
 		}
 		
 		function cloneSprite( sprite ){
 			if(sprite == 'undefined' || sprite == null) return null;
 			
 			var s = { x:sprite.x, y:sprite.y, speed_x:sprite.speed_x, speed_y:sprite.speed_y, id:sprite.id, parentId:sprite.parentId, content:sprite.content, width:sprite.width};
 			return s;
 			
 		}
 
 		/*checks if a portolio with specific id getPorfolioById, returns portfolio if it getPorfolioById */
 		function getPortfolioById( id ){
 			var i=portfolios.length;
 			while(i--){
 				if( portfolios[i]["id"] == id){
 					return portfolios[i];
 				}
 			}
 			
 			return null;
 		}
 		
 	 		 	
 	 	
 		
 	
 	 	
 	 	
 	 	
 	 	/* creates a portfolio html display objects from js object */ 		
 		function portfolioToHTML( portfolio ){
 			
			var $portfolio = $('<div/>');
			var $preload = $('<div class="preload" />');
			$preload.html('loading images');
			$portfolio.append($preload);
			
			$portfolio.addClass("portfolio");
			$portfolio.attr("id",portfolio.id);
			$portfolio.attr("name",portfolio.name);
			$portfolio.css("background-color",portfolio.bgColor);
			$portfolio.css("height",portfolio.height ? portfolio.height : cam.height);
			$portfolio.css("width",portfolio.width ? portfolio.width : cam.width);
			
			return $portfolio;
		
 		}
 		
 		/* creates sprite html display objects from js object */ 	
 		function spriteToHTML( sprite ){
 			
 			var $sprite; var $spriteContent;
 			
 			$sprite = $('<div/>');
			$sprite.attr("id",sprite.id);
			$sprite.addClass("sprite");
			$sprite.css('left',sprite.x + 'px' );
			$sprite.css('top',sprite.y + 'px' );
			$sprite.css('width',sprite.width );
			
			$spriteContent= $('<div/>');
			$spriteContent.addClass('content');
			$spriteContent.append( $( sprite.content ) );
			$sprite.append($spriteContent);

			return $sprite;
 		}
 		
 		
 		 				
 /* END */
 
 /*START 
 Portfolio Save
 */
 
 
 	function fix(){//just for iterative fixes, sometimes faster to hack the objects here than cms
 		var serviceUrl = 'index.php/REST/portfolio/fix/';
 		data = {};
 		//$.post( serviceUrl,data ) ;
 	}
 	
 		function savePortfolios( id ){
 			
 			var serviceUrl = 'index.php/REST/portfolio/push/';
 			var data = [];
 			for(var i=0;i<portfolios.length;i++){
 				if(portfolios[i].changed){
 					data.push(portfolios[i]);
 				}
 			}
 			if(data.length == 0){
 				trace("You haven't changed anything!");
 				return null;
 			}
 			
 			data = {data:$.toJSON( data )};
 			$.post( serviceUrl,data,onPortfolioSaved ) ;
 			
 		}
 		
 		function onPortfolioSaved(data,textStatus,jqXHR){
 			trace( data );
 			if(textStatus == 'success'){
 				$.each( portfolios, function(i,portfolio){ 
 					portfolio.changed = false;
 					var n=portfolio.data.length;
 					while(n--){
 						portfolio.data[n].changed=false;
 					}
 				} );
 			}
 		}
 		
 		
 		/* in which row is the cam, point of measure is the camera center */
 		function getIndexAtCam(){
 			if(cam.x > saveArea.x)
 				return $.inArray(currentPortfolio,portfolios);
 				
 			var offset=0;
 			var camRef = cam.y + .5*cam.height;
 			var height;
 			for(var i=0;i<portfolios.length;i++){
 				height = portfolios[i].height ? portfolios[i].height : cam.height;
 				if(camRef >= offset && camRef <= offset + height){
 					return i;
 				}
 				offset+=height;
 			}
 			return 0;
 		}
 		
 		/*checks if row has items beyond first column*/
 		
 
 		
 		
 		/* locks y scroll when user is in a portfolio,cam size and portfolio height ha to match */
 		
 		var isOpen=false;var animateLock;var wasInside;
 		function setPortfolio(i){
 			 						
			if(!portfolios[i]) return;
			
			
			var portfolio = portfolios[i];
			var $portfolio = $( '#' + portfolio.id );
			
			
			var py = $portfolio.position().top;//i*cam.height;
			
							
			var pos = $content.position();
		 	if(cam.inside && !animateLock && pos.top != -py){
					animateLock=true;
					$content.animate({top:-py},400,function(){animateLock=false});
			}
			
			


			var hasChildren = hasMore();//cam is in save area and portfolio is oversize
			var hotZone = isInHotzone();
			
			
			
			
			if(portfolio.readMore == undefined)
				portfolio.readMore = false;
			
			
			if(portfolio!=currentPortfolio){
				currentPortfolio = portfolio;
				$content.width( portfolio.width == null || portfolio.width == undefined || portfolio.width == '' ? cam.width : portfolio.width );
				
			}
	 		
 			
 		}
 		
 		
 		
 		
 		function scrollBack( toX, callback ){
 				 if(toX == undefined) toX = 0;
				 if(cam.x > toX){
				 	freeze=true;
				 	var cb = function(){ 
				 		freeze=false;
				 		updateDisplay();
				 		if(callback) callback() 
				 	};
					var time = ( (cam.x-toX)/cam.width ) * 1000;
 					//$('body').animate({scrollLeft:0},time,cb);		
 					$.scrollTo( toX, time, {axis:'x',onAfter:cb } );
				}
				else callback();
 			
 		}
 		
 		
 		/* move Sprites() does the hole speed/position calculation for sprites */
 		function moveSprites(currentIndex){		
 			//var t = (new Date).getTime();
 			var x; var y;var pPos;
			var l = portfolios.length;
			var sprite;var $sprite;var offset=0;
			var n;var windowWidth =$(window).width();
 			for(var i = 0;i<l;i++){

				if(i == currentIndex || i == currentIndex+1 || i == currentIndex-1){ //do all that stuff only for overlapping portfolios
					n=portfolios[i].data.length;
					while(n--){
						sprite = portfolios[i].data[n];
						$sprite = $( '#' + sprite.id );									
						
						y =  sprite.y  -  (cam.y - offset)  * sprite.speed_y;
                  			$sprite.css('top', y);
						
						if(i==currentIndex){
							x = (sprite.x) - cam.x  * (sprite.speed_x );
						}
						else{
							x= (sprite.x) + cam.x;//pretend fixed positioning
						}
						
						$sprite.css('left', x);		
										
					}
 				}
 				offset+=portfolios[i].height;	
			}
			//trace((new Date).getTime() - t );
			
 		}
 		

 		function trace( message ){//traces Choordinate hints for staging and debugging
 			if(!debugMode && !editMode) return;
 			
 				var t = $('#trace');
 				t.html( t.html() + '</br>' + message  );
 				t.css('top', t.height() > 300 ? 300 - t.height() : 0 );
 				
 		}
 		
 		var scrollActive=true;
       	function updateDisplay(){
       		var i = getIndexAtCam();
       		var $scrollSizer = $('#scrollSizer');
       		
       		
       		$scrollSizer.height( cam.inside ?  1 : $content.height() );
			$scrollSizer.width( $content.width() );
			
			if(cam.wasInside){
				$(window).scrollTop( cam.y );
			}		
            if(!freeze){
            	setPortfolio(i);
       			updateNavigation();
       		}
 			moveSprites(i);
 			
 		}


         	
 		
 		
 		
 		/* selects a sprite for positioning and activates editSprodeMode */
 		
 		function onSpriteClick(e){
 				if(!currentSprite){
 					
 					e.stopImmediatePropagation();
 					var sprite = e.currentTarget; 	
 					backupSprite = getSpriteById(sprite.id );//for undo			
 					currentSprite = cloneSprite( backupSprite ); //native js objects
 					
 					firstClick = true;
 					$( '#' + currentSprite.id ).css('border','dotted 1px #9999FF');
 					$( window ).on('click', editSpritePosition );
 					trace( 'Selected Sprite: ' + (currentSprite ? currentSprite.id : 'none' ) + ', Axis Mode: ' +  (edit_x ? 'X' : 'Y') ); 
 				}	
 		}
 		
 		/* calculates the new Speed and starting position of the current sprite in firstClick */
 		function editSpritePosition(e){
 			
 			if(currentSprite){
 				
 				if(firstClick == true){
 					firstClick = false;
 				}
 				else{ //this means it must be second click and edit is done
 					var offset = $('#'+currentSprite.parentId).offset();
	 				var speed;
	 				if(edit_x){
	 					speed =  -( Math.round( ( mouse.deltaX / mouse.deltaCamX) * 100 ) / 100 );
	 					currentSprite.speed_x = isNaN(speed) || speed == Infinity || speed == -Infinity ? 1 : speed;
	 					currentSprite.x =  (mouse.x -	 offset.left) + (cam.x) * (currentSprite.speed_x)  ;	
	 				}
	 				if(edit_y){
	 					
	 					speed = -( Math.round( (mouse.deltaY / mouse.deltaCamY) * 100 ) / 100  ) ;
	 					currentSprite.speed_y = isNaN(speed) || speed == Infinity || speed == -Infinity ? 1 : speed;
	 					 
	 					currentSprite.y = Math.round( (mouse.y - offset.top) + (cam.y - offset.top) * currentSprite.speed_y );// - pPos.top;				
	 					
	 				}
	 				currentSprite.changed=true;
	 				updateSprite( currentSprite  );
					$( window ).off('click', editSpritePosition )
	 				trace( 'Sprite ' + currentSprite.id + ' updated to x:' + currentSprite.x + ' y:' + currentSprite.y + ' speedX:' + currentSprite.speed_x   + ' speedY:' + currentSprite.speed_y );
	 				$( '#' + currentSprite.id ).css('border','');
	 				currentSprite = null;
	 				
 					
 				}
 			}
 		}
 		
 		function updateSprite( sprite ){
 			if(sprite == null ) return null;
 			
 			var portfolio = getPortfolioById( sprite.parentId );
 			if( portfolio ){
 				var i=portfolio.data.length;
 				while(i--){
 					if(portfolio.data[i].id == sprite.id){
 						portfolio.data.splice( i,1, sprite );
 					}
 				}
 				portfolio.changed = true;
 			}
 			updateDisplay();
 			return null;
 		}
 		
 		
 		function shortcuts( e ){
 		
 			
 			if(debugMode || editMode){
	 			if( e.which == 73){//i - informations/trace
	 					$('#trace').css('display', $('#trace').css('display') == 'block' ? 'none' : 'block');
	 			}
 			}
 			if(editMode){
 				

 				if( e.which == 90 ){// z to undo change
 					if(backupSprite){
 						updateSprite( backupSprite );
 						$( '#' + backupSprite.id ).css('border','');
 						trace('Sprite ' + backupSprite.id + ' undone to x:' + backupSprite.x + ' y:' + backupSprite.y + ' speedX:' + backupSprite.speed_x   + ' speedY:' + backupSprite.speed_y);

 						backupSprite = null;
 						currentSprite = null;
 					}
 				}
 				
	 			if( e.which == 27){//esc
	 				if(currentSprite){
	 					$( document ).off('click', editSpritePosition )
	 					$( '#' + currentSprite.id ).css('border','');
	 					currentSprite = null;
	 					updateSprite( backupSprite );
	 					trace('Sprite ' + backupSprite.id + ' undone to x:' + backupSprite.x + ' y:' + backupSprite.y + ' speedX:' + backupSprite.speed_x   + ' speedY:' + backupSprite.speed_y);
	 					backupSprite = null;
	 					firstClick = false;
	 					$( window ).off('click', editSpritePosition );
	 					
	 					
	 				}
	 			}	
	 		  	if( e.which == 88 ){//x - set x positioning mode
	 				edit_x = true;
	 				edit_y = false;
	 				
	 			}
	 			if( e.which == 89 ){//y - set y positioning mode
	 				edit_x = false;
	 				edit_y = true;
	 				
	 			}
	 			if( e.which == 83 ){//s - for save
	 				//fix();
	 				savePortfolios();
	 				
	 			}
	 			
	 			if(e.which == 88 || e.which == 27 || e.which == 89 ){
	 				trace( 'Selected Sprite: ' + (currentSprite ? currentSprite.id : 'none' ) + ', Axis Mode: ' +  (edit_x ? 'X' : 'Y' ) );
	 			}
				
 			}
 		}
 		
 	

 		function scrollToPortfolio(i,multiplyTime,callback){
 			
 			
 			nav.pager.children( '.active' ).removeClass('active').text('');
			
			
		
						
 			var animate = function(){
 				trace('scrollToPortfolio:' + portfolios[i].id);
 				
 				freeze = true;
 				
 				var targetY= $( '#' + portfolios[i].id ).offset().top;
 				if(multiplyTime == undefined)
 					multiplyTime = 1;
 					
 				var cb = function(){
 					freeze=false;
 					//nav.pager.children().eq(i).addClass('active').text;
 					updateDisplay();
 					if(callback)callback() 
 				}
 				
 				var time = Math.abs( (  targetY -  cam.y )/cam.height   * 500 )*multiplyTime;
 				var pos = $('#' + portfolios[i].id).position();
 				$('body').scrollTo( 
 					{
 					top:pos.top,
 					left:0
 					},
 					{
 					axis:'xy',
 					duration:time,
 					easing:'linear',
 					onAfter:cb
 					}
 				);
 				
 				
 			}
 			
 			if(cam.inside){
 				scrollBack( 0, animate )
 			}
 			else animate();
 				
 			
 		}
 		
 		function scrollTop( pos ){
 			if(pos<=$(document).height() && pos >= 0) 
 				$('body').scrollTo( pos,{axis:'y'}  );
 			
 		}
 		
 		function scrollLeft( pos ){
 			if(pos<=$(document).width() && pos >= 0) 
 				$('body').scrollTo( pos,{axis:'x'}  );
 			
 		}
 		
 		function trackMouse(e){
		
			mouse.event = e.type;
			mouse.mouseDown = mouse.mouseDown && e.type != 'mouseup' || e.type == 'mousedown';
            mouse.deltaCamX = cam.x - mouse.camX;
            mouse.deltaCamY = cam.y - mouse.camY;
            mouse.camX = cam.x;
            mouse.camY = cam.y;

            
			if(mouse.event == 'mousedown' || mouse.event == 'click'){
             mouse.deltaX = e.pageX - mouse.x;
             mouse.deltaY = e.pageY - mouse.y;
             mouse.x = e.pageX;
             mouse.y = e.pageY;         
			}

         }
         
         var _wasInside;
         function trackCam(e){
         	
         	cam.x = $(window).scrollLeft();
 		   	cam.inside = cam.x > saveArea.x;
 		   	if(cam.inside && !cam.wasInside) 
 		   		_wasInside = true;
 		   	if(!cam.inside && _wasInside){
 		   		cam.wasInside = true;
 		   		_wasInside = false
 		   	}
 		   	else{
 		   		cam.wasInside = false;
 		   	}
 		   	
 		   	
         
 		    cam.y = cam.wasInside ? cam.y 
 		    		: cam.inside ? -$content.position().top : $(window).scrollTop();	
         	

         }
		
		function isInsidePortfolio(){
			if(!currentPortfolio) return false;
			return cam.x > 900
		}
		
		function hasMore(){
			if(!currentPortfolio) return false;
			return currentPortfolio ?  currentPortfolio.data.length >= 4 : false;
		}
		
		function isInHotzone(){
			if(!currentPortfolio) return false;
			var pTop = $('#' + currentPortfolio.id).position().top;
			return cam.y >= pTop && cam.y <= pTop + saveArea.y;
		}
		
		function readMore( ){
			var toX = 900;
			if(currentPortfolio.scrollBy!=0)
				toX = (Math.floor(cam.x/currentPortfolio.scrollBy) + 1 ) * currentPortfolio.scrollBy;
			if(cam.x<toX){
				var pos = $('#' + currentPortfolio.id ).position();
				pos.left = toX;
				$.scrollTo( pos ,{axis:'xy',offset:{left:toX},duration:1000} );
			}
								
		}
		
		function onDocumentClick(e){
			var targetClass = e.target.className == undefined || e.target.className == '' ? '' : e.target.className.match(/(\w+)/)[1];
			if(targetClass == 'readMore'	){
				e.preventDefault();
				readMore();	
			}
			
		}
			
		function onNavigation(e){
			e.preventDefault();
		
		
			var index = $.inArray(currentPortfolio,portfolios);
			
			var targetClass = e.target.className == undefined || e.target.className == '' ? '' : e.target.className.match(/(\w+)/)[1];
			
			if(!targetClass) return;
			
			
			$target= $( e.target );
		
			var active = $target.hasClass('active');
			
			
			if(targetClass == 'pagerButton' ){
				var portfolio = portfolios[ $target.index() ]; 
				
				if(portfolio!=currentPortfolio && !freeze)
					$target.text( e.type=='mouseover'? portfolio.name : '' );
				
				if(e.type=='mouseover' && !freeze)
					$target.addClass('over');
				else if(e.type=='mouseout' && !freeze)
					$target.removeClass('over');
				
			}
			else{
				if( e.type == 'mouseover' ){
					$target.addClass('over');
					nav.toolTip.css('display','block');
					nav.over = targetClass;
				}
				else if( e.type== 'mouseout'){
					$target.removeClass('over');
					nav.over = '';
				}
			}
			
			if(freeze) return;
			switch(targetClass){
				case 'pagerButton':
					if(e.type=='mousedown'){
						if(portfolios[ $target.index() ] == currentPortfolio)
							readMore();
						else
							scrollToPortfolio( $target.index() );
					}
					
				break;
				case 'down':
					if(active)
						if(e.type=='click')
							scrollToPortfolio( index+1 );
				
				break;
				case 'up':
					if(active)
						if(e.type=='click')
							scrollToPortfolio( index-1  );
				break;
				case 'right':
					if(active)
						if(e.type=='mousedown'){
							if(currentPortfolio.scrollBy!=0 || cam.x<900){
								readMore( )
							}
							else{
								$(document).one('mouseup', function(){ 
									clearInterval(scrollInterval) 
								});
								
			 					scrollInterval = setInterval(function(){
			 						scrollLeft(cam.x+8);
			 					},10);
							}			 		
						}
						 

				break;
				case 'left':
					if(e.type=='mousedown'){
						if(currentPortfolio.scrollBy!=0){
							scrollBack( ( Math.floor(cam.x/currentPortfolio.scrollBy) - 1 ) * currentPortfolio.scrollBy);
						}
						else{
							if(cam.x<=900){
								scrollBack( 0 );
							}
							else{
								$(document).one('mouseup', function(){ clearInterval(scrollInterval) });
			 					scrollInterval = setInterval(function(){
			 						scrollLeft(cam.x-5);
			 					},10);
							}				 		
						}
					}
				
				break;
				case 'circle':
					if(e.type=='mousedown'){
							scrollBack();				
							
					}		
				break;
				case 'logo':
					if(e.type=='mousedown')
						scrollToPortfolio( portfolios.length-1 ,0.3 );

				break;
			}
			
			updateNavigation();
		
		}
		

		function updateNavigation(){
			
			if(!currentPortfolio || freeze ) return;
			
			var i=$.inArray(currentPortfolio,portfolios);
			
			nav.pager.children('.active').removeClass( 'active' ).text('');
			var $currentPager = nav.pager.children().eq( i );
			$currentPager.removeClass('over').addClass( 'active' );
			$currentPager.text(portfolios.length > 1 && currentPortfolio == portfolios[ portfolios.length -1] ? 'Find Us' : 'View more' );
			
			if(cam.x > saveArea.x && nav.showCompass == false){
				nav.showCompass = true;
				nav.compass.show();
				nav.pager.hide();
			}
			if(cam.x < saveArea.x && nav.showCompass == true){
				nav.showCompass = false;
				nav.compass.hide();
				nav.pager.show();
			}
			
			
			nav.toolTip.text(   nav.over == 'left' && cam.x<= 900? 'press to scroll'
								: nav.over == 'left' ? 'press to scroll'
								: nav.over == 'right' && cam.x<900 ? 'read more'
								: nav.over == 'right' ? 'press to scroll' 
								: nav.over == 'up' ? 'previous' 
								: nav.over == 'down' ? 'next' 
								: nav.over == 'circle' && cam.x >= saveArea.x ? 'back' 
								: nav.over == 'circle' && i == portfolios.length - 1 ? 'top' 
								: nav.over == 'circle' ? 'contact' : '' );
							
			
			if( (i == 0 && nav.up.hasClass('active') ) || (i > 0 && !nav.up.hasClass('active') ) ){
				nav.up.toggleClass('active');
			}
			
			if( nav.down.hasClass('active') ){
				if(i == portfolios.length || cam.x > saveArea.x )
					nav.down.toggleClass('active');
			}
			else if(i<portfolios.length && cam.x < saveArea.x  ){
				nav.down.toggleClass('active');
			}
			
			if( nav.up.hasClass('active') ){
				if(i == 0|| cam.x > saveArea.x )	
					nav.up.toggleClass('active');
			}
			else if( i>0 && cam.x < saveArea.x ){
				nav.up.toggleClass('active');
			}
			
								
			if( !nav.right.hasClass('active')){
				if( isInHotzone() && hasMore() ){
					nav.right.toggleClass('active');
				}
			}
			else if(!isInHotzone() || !hasMore()){
				nav.right.toggleClass('active');
			}
						
			if( nav.left.hasClass('active') ){
				if( !hasMore() || cam.x < saveArea.x )
					nav.left.toggleClass('active');
			}
			else if( hasMore() && cam.x > saveArea.x){
				nav.left.toggleClass('active');
			}
			
			
		}

		
 		function updateSize(e){
 			var w = $(window).width();
 			var h = $(window).height();
 			
 			$preload= $('#cache > .preload');
 			$preload.css('top', .5* (h - $preload.height() ) );	
 			
 			$cache = $('#cache');
 			nav.display.css('width', w > cam.width ? '100%' : w + 'px');
 		
 			//$cache.css('top',h > cam.height ? .5* (h - 930) : 0);			
 			$cache.css('left',w > cam.width ? .5* (w - 1280) : 0);
 			
 	
     			
 		}
 		
 		function onDocumentScroll( e ){
 	
 			trackCam( e ); //saves cam Position etc.
 			$content.css('top', -cam.y );
 			$content.css('left', -cam.x );
 			updateDisplay();
 		}
 		
 	 	function getURLParameter( name ){
 	 		return decodeURIComponent( (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,""])[1] );	
 	 	}
 	 	
        m.init = function ( admin  ){
 
        	
        	editMode= admin;//getURLParameter('edit') == 'true';
     
        	debugMode= admin;//getURLParameter('debug') == 'true';
   		
 			mouse={x:0,y:0,deltaX:0,deltaY:0,camX:0,camY:0,deltaCamX:0,deltaCamY:0,mouseDown:false};
 			cam = {inside:false,wasInside:false,width:$('#cache').width(),height:768,x:0,y:0,ix:0,iy:0};
 		
 			saveArea = {width:$('#saveArea').width(),height:$('#saveArea').height(),x:parseInt( $('#saveArea').css('left') ),y:parseInt( $('#saveArea').css('top') )};
 			
 			nav.up = $('#compass .up' );
 			nav.down = $('#compass .down' );
 			nav.right = $('#compass .right' );
 			nav.left = $('#compass .left' );
 			nav.circle = $('#compass .circle' );
 			nav.logo =  $('#compass .logo' );
 			nav.toolTip =  $('#compass .toolTip' );
 			nav.pager = $('#pager');
 			nav.display = $('#nav');
 			nav.compass = $('#compass')
 			
 			$content = $("#content");
 			
 			if(editMode){
 				trace( "Edit Mode: Select Sprite, press 'X' or 'Y' to set axis restriction, set two reference points via mouse click, press 'ESC' to chancel current edit, 'Z' to undo the last change and 's' to save all edits." );
        		$('#saveArea').css('display','block');
        	}
        	
 			
			if(editMode)
				$(document).on('click', trackMouse );
				
			if(debugMode || editMode)
				$( document ).bind( 'keydown',shortcuts );
			
			
			
			
			$('#nav').on('mouseover', onNavigation );
			$('#nav').on('mouseout', onNavigation );
			$('#nav').on('mousedown', onNavigation );
			$('#nav').on('click', onNavigation );
			
			$('#content').on('click',onDocumentClick);
			
			$(window).resize( updateSize );
			updateSize(null);
			
			
					

 		}
 		
 		
 		
 		m.display = function(){
 			
 			
 			if(!portfolios || portfolios.length == 0) return;
 			
 			$(window).on('scroll', onDocumentScroll );
 			
 			$.each( portfolios, function( index, portfolio ){ addPortfolio( portfolio ) } );
 						
			forEachSprite( function(portfolio,sprite) {
				if(sprite.x < cam.width) //add first the start column
					addSpriteTo(portfolio,sprite)
			})
			
			forEachSprite( function(portfolio,sprite) {
				if(sprite.x >= cam.width) //then load all other in order
					addSpriteTo(portfolio,sprite)
			})
			
 		}
 		
 		m.load = function(callback){
 			var serviceUrl = 'index.php/REST/portfolio/get/' + 0 + '/' + 99;
 			var cb = function(data,textStatus,jqXHR){
 				onPortfolioSuccess(data,textStatus,jqXHR);
 				callback();
 			}
 			$.ajax(serviceUrl,{success:cb});
 		}
 		
 		function parseJson(json){
 			
 			var data = $.parseJSON( json );
 			
 			if($.isArray(data)){ 
 				resolveJsonArray(data) 			
 			}			
 			else{
 				for(key in data){
 					if( $.isArray( data[key] ) ){
 						resolveJsonArray( data[key] );
 					}
 				}
 			}
 			return data;
 		}
 		
 		/* little helper to iterate and translate json arrays to js objects*/
 	 	function resolveJsonArray( data ){
 	 		$.each( data, function(index,value){ data[index] = parseJson( value ) } );
 	 	}
 		
 		
 		
 		function onPortfolioSuccess(data,textStatus,jqXHR){
 			//alert(data);
 			portfolios = parseJson(data);
 			
 			
 			$.each( portfolios, function( index, portfolio ){ 
 				portfolio.scrollBy = portfolio.scrollBy == null || portfolio.scrollBy == '' || portfolio.scrollBy == undefined ? 0 : parseInt( portfolio.scrollBy );
 				addPortfolio( portfolio ) } 
 			);
 			
 			var sprites=[];

			var sprite;
			for(var i=0;i<portfolios.length;i++){
				for(var n=0;n<portfolios[i].data.length;n++){
					sprite=portfolios[i].data[n];
					sprite.x=parseInt(sprite.x);
 					sprite.y=parseInt(sprite.y);
					if(sprite.x < cam.width) //add only the first column
						addSpriteTo(portfolios[i],sprite);
				}
			}
			
			
 			$.each( portfolios, function( index,value){ 
 				checkImageProgressForPortfolio(	value.id );//check progress of image laoding
 			} )
 			
 		}
 		
 		function checkImageProgressForPortfolio( id ){
 			var $portfolio = $( '#' + id );
 			$( $portfolio ).children('.preload' ).css('display','block');
 			var portfolio = getPortfolioById( id );
 			portfolio.loading = 0;
 		
 			$('img', $portfolio ).each( function(index,value){ 
 				portfolio.loading++;
 				$(value).one('load', function(){ 
	 				portfolio.loading--;
	 				if(portfolio.loading==0){
	 					$( '#' + portfolio.id ).children('.preload').css('display','none');
	 					updateDisplay();
	 				}
 				})
 			})
 			
 		}



 		
 		m.parseHTML = function( $node ){
 		 	var data = [];
 		 	
 		 	$.each( $node.children(".portfolio"), function(i,portfolio){
 		 		var $pf = $(portfolio);
 		 		var meta = parseMeta( $pf);
 		 		data.push({
 		 			id:$pf.attr( "id" ),
 		 			scrollBy:meta["scrollBy"] ? parseInt(meta.scrollBy) : 0,
 		 			width:$pf.width(),
 		 			height:$pf.height(),
 		 			bgColor:rgb2hex( $pf.css("backgroundColor")),
 		 			data:parseSprites( $pf ),
 		 			name:$pf.attr( "name" ),
 		 			changed:false
 		 		});
 		 	});
 		 	portfolios = data;
 		}
 		
 		
 		
 		
 		
 		
 		function parseSprites( $portfolio){
 			data = [];
 			$.each( $portfolio.children( '.sprite'), function( i,sprite ){
 				$s = $(sprite);
 				var meta = parseMeta($s);
 				data.push( {
 					id:$s.attr( "id" ), 
 		 			width:$s.width(),
 		 			x: meta["x"] ? meta.x : 0,
 		 			y: meta["y"] ? meta.y : 0,
 		 			parentId:$portfolio.attr("id"),
 		 			speed_x: meta["speed_x"] ? meta.speed_x : 0,
 		 			speed_y: meta["speed_y"] ? meta.speed_y : 0,
 		 			content: $s.children(".content").html(),
 		 			changed:false
 				}); 
 			});
 			return data;
 		}
 	
 		function parseMeta( $sprite ){
 			var data = {};
 			var csv=$sprite.children('.meta').text();
 			var pairs = csv.split(',');
 			var i=pairs.length;
 			while(i--){ 
 				var nv = pairs[i].split(':');
 				data[ nv[0] ] = nv.length > 1 ? nv[1] : '';
 			}
 			return data;
 		}
 		
 		
 		function addSpriteTo( portfolio,sprite ){
 			
 			if(editMode)
 				$('.sprite').off('click',onSpriteClick);
 			
 			var $sprite = spriteToHTML(sprite);

 			var $portfolio = $('#' + portfolio.id );
 			if( $portfolio.length == 0) return;
 			
 			var $exists = $('#' + sprite.id );
 			
 			if($exists.length)
 				$exists.replaceWith($sprite);
 			else
 				$portfolio.append( $sprite );
 
 			
 			var $images = $('img', $sprite );
 			
 			if($images.length>0)
 				$portfolio.children('.preload' ).css('display','block');
 			
 			
 			$($images).each( function(index,image){ 
 				portfolio.loading++;
 				$(image).one('load', function(){ 
	 				portfolio.loading--;
	 				if(portfolio.loading==0){
	 					$( '.preload','#' + portfolio.id ).css('display','none');
	 				}
 				})
 			})
 			
 			if(editMode) 
 				$('.sprite').on('click',onSpriteClick);
 			
 		}
 		
 		
 		
 		function forEachSprite(f){
 			if(!f) return;
 			
 			for(var i=0;i<portfolios.length;i++){
				for(var n=0;n<portfolios[i].data.length;n++){
					f( portfolios[i],portfolios[i].data[n] );
				}
 			}
 		}
 		

 		function rgb2hex(rgb) {
		    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		    function hex(x) {
		        return ("0" + parseInt(x).toString(16)).slice(-2);
		    }
		    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
 		
    return   m;
 		
 }(jQuery));
		