ig.module('game.main')

.requires(
    // core
	'plusplus.core.plusplus',
	
	// levels
	'game.levels.test',
	
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
			
			ig.input.bind(ig.KEY.E, 'interact_1');
		},
		
		inputEnd: function() {
			this.parent();
			
			ig.input.unbind(ig.KEY.E, 'interact_1');
		}
    });

    ig.main(
        '#canvas', game, 60,
	    _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE,
	    ig.LoaderExtended
	);
});
