ig.module('game.main')

.requires(
    // core
	'plusplus.core.plusplus',
	
	// levels
	'game.levels.test',
	
	'game.ui.ui-world-time',
	
	// debug - remove this before release
	'plusplus.debug.debug',
	
	'game.ui.ui-inventory',
	
	'game.ui.ui-craft',
	
	'game.ui.ui-equipment'
)

.defines(function(){ "use strict";
		
    var _c = ig.CONFIG;

    var game = ig.GameExtended.extend({
		
		clearColor: "#111111",
	
		shapesPasses: {
		    lighting: {
				ignoreClimbable: true,
				discardBoundaryInner: true,
				retainBoundaryOuter: false
			}
		},
		
		worldTime: null,
		
		inventoryUI: null,
				
		init: function() {
		    this.parent();
			
			this.loadLevel(ig.global.LevelTest);
		},
		
		initUI: function(player) {
			
			this.worldTime = this.spawnEntity(ig.UIWorldTime, 0, 0, {
				posPct: { x: 0.5, y: 0 },
				// set the margin
				marginAsPct: false,
				margin: { x: 0, y: 15 }
				// set the margin
			});
			
			this.inventoryUI = this.spawnEntity(ig.UIInventory, 0, 0, {
			});
			
			this.craftUI = this.spawnEntity(ig.UICraft, 0, 0, {
			});

			this.equipmentUI = this.spawnEntity(ig.UIEquipment, 0, 0, {
			});
			
			ig.UIWorldTime.timeInMinutes = this.worldTime.timeInMinutes;
			ig.UIWorldTime.timeInHours = this.worldTime.timeInHours;
		},
		
		buildLevel: function() {
			this.parent();
			
			// get the player entity
            // if none, assume we're waiting for input to start
            var player = this.getPlayer();


            if(player ) {
                this.initUI(player);
            }
		},
		
		inputStart: function() {
		    this.parent();
			
			ig.input.bind(ig.KEY.SPACE, 'interact_1');
			
			ig.input.bind(ig.KEY.SHIFT, 'interact_switch');
			
			ig.input.bind(ig.KEY.E, 'inv_interact_1');
			ig.input.bind(ig.KEY.Q, 'inv_interact_2');
			ig.input.bind(ig.KEY.R, 'inv_interact_3');
			ig.input.bind(ig.KEY.C, 'interact_crafting');
			ig.input.unbind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.unbind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.unbind(ig.KEY.UP_ARROW, 'up');
            ig.input.unbind(ig.KEY.DOWN_ARROW, 'down');
			ig.input.bind(ig.KEY.LEFT_ARROW, 'inv_left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'inv_right');
			ig.input.bind(ig.KEY.UP_ARROW, 'inv_up');
			ig.input.bind(ig.KEY.DOWN_ARROW, 'inv_down');
		},
		
		inputEnd: function() {
			this.parent();
			
			ig.input.unbind(ig.KEY.SPACE, 'interact_1');
			
			ig.input.unbind(ig.KEY.SHIFT, 'interact_switch');
			ig.input.unbind(ig.KEY.R, 'inv_interact_3');
			ig.input.unbind(ig.KEY.E, 'inv_interact_1');
			ig.input.unbind(ig.KEY.Q, 'inv_interact_2');
			ig.input.unbind(ig.KEY.C, 'interact_crafting');
			
			ig.input.unbind(ig.KEY.LEFT_ARROW, 'inv_left');
            ig.input.unbind(ig.KEY.RIGHT_ARROW, 'inv_right');
			ig.input.unbind(ig.KEY.UP_ARROW, 'inv_up');
			ig.input.unbind(ig.KEY.DOWN_ARROW, 'inv_down');
		},		
    });

    ig.main(
        '#canvas', game, 60,
	    _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE,
	    ig.LoaderExtended
	);
});
