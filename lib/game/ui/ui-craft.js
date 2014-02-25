ig.module(
	'game.ui.ui-craft'
)
.requires(
	'dom.ready',
	'plusplus.core.config',
    'plusplus.ui.ui-element'
)
.defines(function(){ "use strict";

	var _c = ig.CONFIG;

	ig.UICraft = ig.global.UICraft = ig.UIElement.extend({
		
		player: null,
		
		initProperties: function() {
			this.parent();
			
			this.player = ig.game.getPlayer();
			
			var self = this;
			
			var numOfSlots = 4;
  			for(var i = 1; i <= numOfSlots; i++){
  				$( "#cslot" + i ).draggable({			
  					zIndex: ig.game.UIlayer++,
  					start: function(){
  						var thestring = $(this).attr('id');
  						var thenum = thestring.replace( /^\D+/g, '');
  						self.player.crafting.setSelectedSlot(thenum-1);
  					}
  				});
    			$("#cslot" + i).data({
    				'initLeft': $("#cslot" + i).css('left'),
    				'initTop': $("#cslot" + i).css('top')
    			});
    		}
		},

		update: function() {
			this.parent();
			
			if(this.player.interfaceState == this.player.STATE_CRAFTING){
				$(".craft").show();
				$(".result").show();
				this.updateItems(this.player.crafting);
			} else {
				$(".craft").hide();
				$(".result") .hide();
			}
			
		},
		
		
		updateItems: function(crafting) {
			
			var items = crafting.items;
			var selectedSlot = crafting.getSelectedSlot();
			for(var i = 0; i < items.length; i++) {
				if(items[i] != null){
					$('#cslot' + (i + 1)).css('background', 'url(media/' + items[i].iconPath + ')');
					if(i == selectedSlot)
						$('#cslot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + items[i].stacks + '*');
					else
						$('#cslot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + items[i].stacks);
				}else{
					$('#cslot' + (i + 1)).css('background', '');
					if(i == selectedSlot)
						$('#cslot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0*');
					else
						$('#cslot' + (i + 1) + 'Num').html('');
				}
			}
			
			this.updateResults(crafting);
			
			var numOfSlots = 4;
			
			for(var i = 1; i <= numOfSlots; i++){
				var $currentLeft = $("#cslot"+i).css('left');
				var $currentTop = $("#cslot"+i).css('top'); 
				if(ig.game.isDragging == false && $currentLeft != $("#slot"+i).data('initLeft') && $currentTop != $("#slot"+i).data('initTop')){
					$("#cslot"+i).css({
						'left': $("#cslot"+i).data('initLeft'),
						'top': $("#cslot"+i).data('initTop')
					});
				}
			}
			
		},
		
		updateResults: function(crafting) {

			var results = crafting.results;

			for(var i = 0; i < 6; i++){
				if(results[i] != null){
					var settings = ig.items.n2s_i(results[i].name);
					if(!results[i].ready){
						$('#rslot' + (i + 1)).css('-webkit-filter','grayscale(100%)');
					}else{
						$('#rslot' + (i + 1)).css('-webkit-filter','grayscale(0%)');
					}
					$('#rslot' + (i + 1)).css('background', 'url(media/' + settings.iconPath + ')');
					if(i == crafting.readySelectedSlot && results[i].ready){
						$('#rslot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + settings.stacks + '*');
					}else{
						$('#rslot' + (i + 1) + 'Num').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + settings.stacks);
					}
				}else{
					$('#rslot' + (i + 1)).css('background', '');
					$('#rslot' + (i + 1) + 'Num').html('');
				}
			}
			
		}
		
	});	
});
