ig.module('game.entities.sabertooth')
.requires(
    'plusplus.core.config',
    'game.abstractities.creature',
    'plusplus.helpers.utils',
    'plusplus.helpers.pathfinding'
)
.defines(function(){ 

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _pf = ig.pathfinding;
	
    ig.EntitySabertooth = ig.global.EntitySabertooth = ig.Creature.extend({
        displayName: "Evil Cat",
		health: 100,
		healthMax: 1000,
		speed: {x:1000, y:1000},
		size: {x: 32, y: 32},
		offset: {x: 0, y: 0},
		
		droppedItems: [
			{
				name: "Meat",
				quantityMin: 2,
				quantityMax: 3
			},
		],
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/sabertooth.png', 43,44),
		
		animInit: "idleX",
		
		animSettings: {
			idleX: {
				frameTime: 0.5,
				sequence: [0]
			},
			idleUp: {
				frameTime: 0.5,
				sequence: [0]
			},
			idleDown: {
				frameTime: 0.5,
				sequence: [0]
			},
			moveX: {
				frameTime: 0.07,
				sequence: [0]
			},
			moveDown: {
				frameTime: 0.07,
				sequence: [0]
			},
			moveUp: {
				frameTime: 0.07,
				sequence: [0]
			},
		},
		
        reactionTimer: null,
		
		preyClass: 'EntityPlayer',
    });
});
