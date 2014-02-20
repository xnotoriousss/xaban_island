ig.module(
	'game.ui.ui-equipment'
)
.requires(
	'dom.ready',
	'plusplus.core.config',
    'plusplus.ui.ui-element'
)
.defines(function(){ "use strict";

	var _c = ig.CONFIG;

	ig.UIEquipment = ig.global.UIEquipment = ig.UIElement.extend({
		
		player: null,
		
		initProperties: function() {
			this.parent();
			
			this.player = ig.game.getPlayer();
		},

		update: function() {
			this.parent();
			
			if(this.player.equipment) this.updateItems(this.player.equipment);
			
		},
		
		
		updateItems: function(equipment) {
			var items = equipment.items;
			//var selectedSlot = equipment.getSelectedSlot();
			for(var i = 0; i < items.length; i++) {
				if(items[i] != null){
					$('#eslot' + (i + 1)).css('background', 'url(media/' + items[i].iconPath + ')');
					//$('#e' + (i + 1) + 'durability').html('___' + items[i].itemComponents.durability);
					//uncomment it if durability is available.
				}else{
					$('#eslot' + (i + 1)).css('background', '');
				}
			}
			
		}
		
	});	
});
