ig.module('game.entities.wolf')
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
	
    ig.EntityWolf = ig.global.EntityWolf = ig.Creature.extend(/**@lends ig.Creature.prototype */{
        displayName: "Wolf",
		health: 1000,
		healthMax: 1000,
		speed: {x:1000, y:1000},
		size: {x: 32, y: 32},
		offset: {x: 0, y: 0},
		tameable: true,
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/dog.png', 40,40),
		
		animInit: "idleX",
		
		animSettings: {
			idleX: {
				frameTime: 0.5,
				sequence: [7]
			},
			idleUp: {
				frameTime: 0.5,
				sequence: [10]
			},
			idleDown: {
				frameTime: 0.5,
				sequence: [1]
			},
			moveX: {
				frameTime: 0.07,
				sequence: [6,7,8]
			},
			moveDown: {
				frameTime: 0.07,
				sequence: [0,1,2]
			},
			moveUp: {
				frameTime: 0.07,
				sequence: [9,10,11]
			},
		},
		droppedItems: [
			{
				name: "Meat",
				quantityMin: 2,
				quantityMax: 3
			},
		],
        reactionTimer: null,
	})
});
