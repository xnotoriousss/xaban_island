ig.module('game.main')

.requires(
    // core
	'plusplus.core.plusplus',
	
	// levels
	'game.levels.test',
	
	'game.ui.UIWorldTime',
	
	// debug - remove this before release
	'plusplus.debug.debug'
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
				
		init: function() {
		    this.parent();
			
			this.loadLevel(ig.global.LevelTest);
			this.initUI();
		},
		
		initUI: function() {
			
			var minuteTimer = 833;
			
			var worldTime = this.spawnEntity(ig.worldTimer, 0, 0,{
				
				posPct: { x: 0, y: 0 },
				// set the margin
				marginAsPct: false,
				margin: { x: 700, y: 0 }
				// set the margin
				
			});
			
			setInterval(function() {
				worldTime.updateWorldTime();
				}, minuteTimer);
		},
		
		buildLevel: function() {
			this.parent();
			
			// get the player entity
            // if none, assume we're waiting for input to start
            var player = this.getPlayer();

            if(!player ) {
                // lets have the camera follow the title first
				/*
                var title = this.namedEntities["title"];

                if (title && this.camera) {

				    // first parameter is the entity to follow
                    // second parameter is snap (instead of transition)
                    // third parameter is to center on entity

                    this.camera.follow(title, true, true);

                }
				*/
                // and in the first level, an input trigger is used
                // which waits for a tap (and click === tap)
                // and once that happens, it:
                // activates the title to remove the text
                // spawns the player and starts the game
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
		}
    });

    ig.main(
        '#canvas', game, 60,
	    _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE,
	    ig.LoaderExtended
	);
});
