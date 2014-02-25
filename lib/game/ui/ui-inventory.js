ig.module(
	'game.ui.ui-inventory'
)
.requires(
	'dom.ready',
	'plusplus.core.config',
    'plusplus.ui.ui-element'
)
.defines(function(){ "use strict";

	var _c = ig.CONFIG;

	ig.UIInventory = ig.global.UIInventory = ig.UIElement.extend({
		
		player: null,
		
		isDragging: false,
		
		initProperties: function() {
			this.parent();
			
			var self = this;
			
			this.player = ig.game.getPlayer();
			
  			var numOfSlots = 6;
  			for(var i = 1; i <= numOfSlots; i++){
  				$( "#slot" + i ).draggable({			
  					zIndex: ig.game.UIlayer++,
  					start: function(){
  						var thestring = $(this).attr('id');
  						var thenum = thestring.replace( /^\D+/g, '');
  						self.player.inventory.setSelectedSlot(thenum-1);
  					}
  				});
    			$("#slot" + i).data({
    				'initLeft': $("#slot" + i).css('left'),
    				'initTop': $("#slot" + i).css('top')
    			});
    		}
		},

		update: function() {
			this.parent();
			
			if(this.player.inventory) this.updateItems(this.player.inventory);
		},
		
		updateItems: function(inventory) {
			
			var items = inventory.items;
			var selectedSlot = inventory.getSelectedSlot();
			for(var i = 0; i < items.length; i++) {
				if(items[i] != null){
					$('#slot' + (i + 1)).css('background', 'url(media/' + items[i].iconPath + ')');
					if(i == selectedSlot)
						$('#slot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + items[i].stacks + '*');
					else
						$('#slot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + items[i].stacks);
				}else{
					$('#slot' + (i + 1)).css('background', '');
					if(i == selectedSlot)
						$('#slot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0*');
					else
						$('#slot' + (i + 1) + 'Num').html('');
				}
			}
			
			var numOfSlots = 6;
			
			for(var i = 1; i <= numOfSlots; i++){
				var $currentLeft = $("#slot"+i).css('left');
				var $currentTop = $("#slot"+i).css('top'); 
				if(ig.game.isDragging == false && $currentLeft != $("#slot"+i).data('initLeft') && $currentTop != $("#slot"+i).data('initTop')){
					$("#slot"+i).css({
						'left': $("#slot"+i).data('initLeft'),
						'top': $("#slot"+i).data('initTop')
					});
				}
			}
		}

	});	
});
