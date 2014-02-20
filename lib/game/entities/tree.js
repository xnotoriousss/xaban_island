ig.module('game.entities.tree')
    
.requires(
	'plusplus.helpers.utils',
	
	'game.abstractities.resource'
)

.defines(function () {

	var _c = ig.CONFIG;
	var _ut = ig.utils;
	
	ig.EntityTree = ig.global.EntityTree = ig.Resource.extend({
		
		size: {x: 49, y: 50},
		offset: {x: 0, y: 0},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/tree.png', 49, 50),
				
		animInit: "idleX",
		animSettings: {
			idleX: {
				frameTime: 1,
				sequence: [0]
			}
		},
		
		displayName: "Tree",
		collides: ig.EntityExtended.COLLIDES.FIXED,
		
		health: 500,
			
		requiredTool: ig.items.TOOLTYPES.WOODCUTTING,
		droppedItems: [
			{
				name: "Stick",
				quantityMin: 1,
				quantityMax: 3
			},
			{
				name: "Log",
				quantityMin: 1,
				quantityMax: 3
			}
		],
		
		initTypes: function() {
			_ut.addType(ig.EntityExtended, this, 'type', "INTERACTIVE HARVESTABLE");
		}
	});
});
