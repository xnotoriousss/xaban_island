ig.module('game.abstractities.resource')

.requires(
	'plusplus.helpers.utilsintersection',
	
	'game.items.items'
)

.defines(function () {

	var _i = ig.items;
	var _ut = ig.utils;
	var _uti = ig.utilsintersection;
	
	ig.Resource = ig.EntityExtended.extend({
	    
		performance: ig.EntityExtended.PERFORMANCE.STATIC,
		targetable: true,
		health: 100,
		healthMax: 100,
		regen: false,
		
		requiredTool: null,
		droppedItems: [],

		initTypes: function () {
			_ut.addType(ig.EntityExtended, this, 'type', "RESOURCE");
		},

		initProperties: function () {
			this.parent();
		},
		
		onHarvest: function(damage) {
			this.receiveDamage(damage, this, true);
		},
		
		dropItems: function(name, amount) {
			var i, il, j, jl,
				n2g,
				droppedItem, quantityMax, quantity,
				pos = this.pos,
				size = this.size;
				
			var droppedItems = this.droppedItems;
				
			for(i = 0, il = droppedItems.length; i < il; i++) {
				droppedItem = droppedItems[i];
				quantity = droppedItem.quantityMin + Math.floor(Math.random() * ((droppedItem.quantityMax - droppedItem.quantityMin) + 1));
				for(j = 0, jl = quantity; j < jl; j++) {
					n2g = _i.n2g(droppedItem.name);
					ig.game.spawnEntity(n2g, pos.x + Math.random() * size.x - n2g.size.x * 0.5, pos.y + Math.random() * size.y - n2g.size.y * 0.5);
				}
			}
		},

		kill: function ( silent ) {
			if (!silent)
				this.dropItems();
			
			this.parent( silent );
		},
	});
});
