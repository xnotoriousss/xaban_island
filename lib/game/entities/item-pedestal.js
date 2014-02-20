ig.module('game.entities.item-pedestal')

.requires(
    'plusplus.core.config',
    'plusplus.abstractities.spawner',
    'plusplus.helpers.utils',
        
    'game.entities.ground-item',
    'game.items.items'
)
    
.defines(function () {
    "use strict";

    var _c = ig.CONFIG;
    var _i = ig.items;
    var _ut = ig.utils;

    /**
     * Entity that triggers an update of an entity's reset state and spawns it upon death.
     * @class
     * @extends ig.Spawner
     * @memberof ig
     * @author Collin Hover - collinhover.com
     **/
    ig.EntityItemPedestal = ig.global.EntityItemPedestal = ig.Spawner.extend(/**@lends ig.EntityCheckpoint.prototype */{

        // editor properties

        _wmBoxColor: 'rgba( 35, 200, 125, 0.7 )',

        /**
         * Checkpoint is spawner but should be triggerable by collision.
         * @override
         * @default
         */
        triggerable: true,

        /**
         * Checkpoints should not trigger after delay.
         * @override
         * @default
         */
        triggerAfterDelay: false,
        
        /**
         * @override
         */
        spawningEntity: ig.EntityGroundItem,
        
        // The name of the item must be provided.
        itemName: '',

        /**
         * Checkpoints should have a slight delay before respawning.
         * @override
         */
        respawnDelay: 5,

        /**
         * Checkpoint should only be triggered occasionally.
         * @override
         * @default
         */
        wait: 1,

        /**
         * Checkpoint should always respawn entities.
         * @override
         * @default
         */
        duration: -1,

        /**
         * Checkpoint can be triggered repeatedly.
         * @override
         * @default
         */
        once: false,

        /**
         * Checkpoint should not die after triggering.
         * @override
         * @default
         */
        suicidal: true,

        /**
         * Checkpoint spawns entities right in middle.
         * @override
         * @default
         */
        spawnAtRandomPosition: false,
        
        initProperties: function() {
            this.parent();
            
        },
        
        ready: function() {
            if (this.itemName) {
                this.spawnSettings = _i.n2s_g(this.itemName);
            }
        },

        /**
         * Initializes checkpoint types.
         * <br>- adds {@link ig.EntityExtended.TYPE.CHECKPOINT} to {@link ig.EntityExtended#type}
         * @override
         **/
        initTypes: function () {

            this.parent();

            //_ut.addType(ig.EntityExtended, this, 'type', "CHECKPOINT");

        },

        /**
         * Does spawner activate and links triggering entity as well as, if {@link ig.Checkpoint#restorative}, restores its stats.
         * @override
         **/
        activate: function (entity) {
            this.parent(entity);

        },

        /**
         * Does spawner activate and links triggering entity as well as, if {@link ig.EntityCheckpoint#restorativeSpawn}, restores its stats.
         * @override
         **/
        spawned: function (entity) {

            this.parent(entity);

        }

    });

});
