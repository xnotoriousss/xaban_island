ig.module(
        'game.entities.tree'
    )
    .requires(
        'plusplus.core.config',
        'plusplus.abstractities.spawner',
        'plusplus.helpers.utils',
        
        'game.items.items',
        'game.items.ground-item'
    )
    .defines(function () {
        "use strict";

        var _c = ig.CONFIG; //settings
        var _i = ig.items; //handle item stuff
        var _ut = ig.utils; //handle array stuff

        /**
         * Entity that triggers an update of an entity's reset state and spawns it upon death.
         * @class
         * @extends ig.Spawner
         * @memberof ig
         * @author Collin Hover - collinhover.com
         **/
        ig.EntityTree = ig.global.EntityTree = ig.Spawner.extend(/**@lends ig.EntityCheckpoint.prototype */{

            // editor properties

            //_wmBoxColor: 'rgba( 35, 200, 125, 0.7 )',
	    
	    
	    size: {x: 24, y: 40}, //CHANGE ME, CHANGE ME!!
	    offset: {x: 22, y: 14}, //CHANGE ME, CHANGE ME!!
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/tree.png', 64, 64),
	
	    animInit: "idleX", 
	
	    animSettings: { 
			idleX: {
				frameTime: 1,
				sequence: [0]
			}
		},
	
            spawningEntity: ig.GroundItem,

	    health: 50,
	    
            /**
             * tree should not die after triggering.
             * @override
             * @default
             */
            suicidal: true,

            /**
             * Checkpoint spawns entities right in middle.
             * @override
             * @default
             */
            spawnAtRandomPosition: true,
            
            initProperties: function() {
                this.parent();
                
            },
            
            ready: function() {
                this.spawnSettings = _i.n2s_g("Log");
            },

            /**
             * Initializes checkpoint types.
             * <br>- adds {@link ig.EntityExtended.TYPE.CHECKPOINT} to {@link ig.EntityExtended#type}
             * @override
             **/
            initTypes: function () {

                this.parent();

                _ut.addType(ig.EntityExtended, this, 'type', "RESOURCE");

            },

            /**
             * Does spawner activate and links triggering entity as well as, if {@link ig.Checkpoint#restorative}, restores its stats.
             * @override
             **/
            activate: function (entity) {
                this.parent(entity);
                
                if (entity instanceof ig.GroundItem) {
                    
                }

            },

            /**
             * Does spawner activate and links triggering entity as well as, if {@link ig.EntityCheckpoint#restorativeSpawn}, restores its stats.
             * @override
             **/
            spawned: function (entity) {

                this.parent(entity);

            },
	    
	    kill: function(silent) {
		this.activate(this);
	    }

        });

    });