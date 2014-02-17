ig.module('game.entities.gorilla')
.requires(
    'plusplus.core.config',
    'game.abstractities.creature',
    'plusplus.helpers.utils',
    'plusplus.helpers.pathfinding'
)
.defines(function(){ 
    "use strict";

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _pf = ig.pathfinding;
	
    ig.EntityGorilla = ig.global.EntityGorilla = ig.Creature.extend(/**@lends ig.Creature.prototype */{
        displayName: "Tarzan",
		speed:{
			x:1000,
			y:1000
		},
		health: 1000,
		healthMax: 1000,
		size: {x: 48, y: 48},
		offset: {x: 0, y: 0},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/gorilla.png', 50, 54),
		
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
		
        performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
		
        reactionTimer: null,
		
		preyClass: 'EntitySabertooth',
		
		droppedItems: [
			{
				name: "Meat",
				quantityMin: 1,
				quantityMax: 3
			},
		],
		
        initTypes: function () {
            
			_ut.addType( ig.EntityExtended, this, 'type', "CREATURE" );
        },
    });
});
