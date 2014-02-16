ig.module('game.entities.grass')

.requires(
	'game.abstractities.resource'
)

.defines(function () {
	
	var _c = ig.CONFIG;
	
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
		
		health: 1,
		
		droppedItems: [
			{
				name: "Grass",
				quantityMin: 1,
				quantityMax: 3
			}
		]
    });
});
