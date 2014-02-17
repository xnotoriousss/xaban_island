ig.module('game.entities.mineral-deposit')
    
.requires(
	'game.abstractities.resource'
)

.defines(function () {

	var _c = ig.CONFIG;
	var _ut = ig.utils;
	
	ig.EntityMineralDeposit = ig.global.EntityMineralDeposit = ig.Resource.extend({
		
		size: {x: 32, y: 32},
		offset: {x: 0, y: 0},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/item-stone.png', 32, 32),
				
		animInit: "idleX",
		animSettings: {
			idleX: {
				frameTime: 1,
				sequence: [0]
			}
		},
		
		displayName: "Deposit",
		collides: ig.EntityExtended.COLLIDES.FIXED,
		
		health: 1000,
			
		requiredTool: ig.items.TOOLTYPES.MINING,
		droppedItems: [
			{
				name: "Iron",
				quantityMin: 1,
				quantityMax: 1
			}
		]
	});
});
