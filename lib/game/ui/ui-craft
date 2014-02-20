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
		},

		update: function() {
			this.parent();
			
			if(this.player.crafting) this.updateItems(this.player.crafting);
			
		},
		
		
		updateItems: function(crafting) {
			
			var items = crafting.items;
			var selectedSlot = crafting.getSelectedSlot();
			for(var i = 0; i < items.length; i++) {
				if(items[i] != null){
					$('#cslot' + (i + 1)).css('background', 'url(media/' + items[i].iconPath + ')');
					if(i == selectedSlot)
						$('#cslot' + (i + 1) + 'Num').html('___' + items[i].stacks + '*');
					else
						$('#cslot' + (i + 1) + 'Num').html('___' + items[i].stacks);
				}else{
					$('#cslot' + (i + 1)).css('background', '');
					if(i == selectedSlot)
						$('#cslot' + (i + 1) + 'Num').html('___0*');
					else
						$('#cslot' + (i + 1) + 'Num').html('');
				}
			}
			
			this.updateResults(crafting);
			
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
						$('#rslot' + (i + 1) + 'Num').html('___' + settings.stacks + '*');
					}else{
						$('#rslot' + (i + 1) + 'Num').html('___' + settings.stacks);
					}
				}else{
					$('#rslot' + (i + 1)).css('background', '');
					$('#rslot' + (i + 1) + 'Num').html('');
				}
			}
		}
		
	});	
});
