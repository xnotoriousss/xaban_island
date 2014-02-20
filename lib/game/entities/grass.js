ig.module('game.entities.grass')

.requires(
	'plusplus.helpers.utils',
	
	'game.abstractities.resource'
)

.defines(function () {
	
	var _c = ig.CONFIG;
	var _ut = ig.utils;
	
	ig.EntityGrass = ig.global.EntityGrass = ig.Resource.extend({
		displayName: "Patch of Grass",
		size: {x: 45, y: 45},
		offset: {x: 0, y: 0},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/grass.png', 45, 45),
		animInit: "idleX",
		animSettings: {
			idleX: {
				frameTime: 1,
				sequence: [0]
			}
		},
			
		droppedItems: [
			{
				name: "Grass",
				quantityMin: 1,
				quantityMax: 3
			}
		],
		
		initTypes: function() {
			_ut.addType(ig.EntityExtended, this, 'type', "INTERACTIVE GATHERABLE");
		}
    });
});
