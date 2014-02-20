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
		
		initProperties: function() {
			this.parent();
			
			this.player = ig.game.getPlayer();
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
						$('#slot' + (i + 1) + 'Num').html('___' + items[i].stacks + '*');
					else
						$('#slot' + (i + 1) + 'Num').html('___' + items[i].stacks);
				}else{
					$('#slot' + (i + 1)).css('background', '');
					if(i == selectedSlot)
						$('#slot' + (i + 1) + 'Num').html('___0*');
					else
						$('#slot' + (i + 1) + 'Num').html('');
				}
			}
		}

	});	
});
