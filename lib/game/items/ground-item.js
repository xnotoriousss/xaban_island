ig.module('game.items.ground-item')
    
.requires(
    'plusplus.core.config',
    'plusplus.core.timer',
    'plusplus.core.entity',
    'plusplus.core.hierarchy',
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsmath',
    'plusplus.helpers.utilsintersection',
    'plusplus.helpers.utilsvector2'
)
    
.defines(function () { "use strict";

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _utm = ig.utilsmath;
    var _uti = ig.utilsintersection;
    var _utv2 = ig.utilsvector2;

    /**
     * Base ground item entity.
     * <br>- includes handling for actions
     * <span class="alert alert-error"><strong>IMPORTANT:</strong> this is an abstract entity that should be extended.</span>
     * @class
     * @extends ig.EntityExtended
     * @memberof ig
     * @example
     **/
    ig.GroundItem = ig.EntityExtended.extend(/**@lends ig.GroundItem.prototype */{

        /**
         * @default
         * @override
         */
        targetable: true,
        
        animInit: "idleX",
        
        animSettings: {
            idleX: {
                frameTime: 1,
                sequence: [0]
            }
        },
        
        // item data
        
        stackable: false,
        stacks: 1,
        
        value: 0,

        /**
         * @override
         * @default
         */
        health: 1,

        /**
         * @override
         * @default
         */
        healthMax: 1,

        /**
         * Initializes Character types.
         * <br>- adds {@link ig.EntityExtended.TYPE.CHARACTER} to {@link ig.EntityExtended#type}
         * @override
         */
        initTypes: function () {
            this.parent();
            _ut.addType(ig.EntityExtended, this, 'type', "ITEM");

        },

        /**
         * Initializes character properties.
         * <br>- creates timers for things such as regen and damage delay
         * <br>- creates ability collection
         * @override
         */
        initProperties: function () {
            this.parent();
            // timers
        },

        /**
         * Resets character movement, velocity, and flip.
         * @override
         **/
        resetExtras: function () {
            this.parent();
        },


        /**
         * @override
         */
        recordResetState: function () {
            this.parent();
        },

        /**
         * Called by game when character added to game world.
         * @override
         **/
        ready: function () {
            this.parent();
        },

        /**
         * Called when character spawned.
         * @override
         **/
        spawn: function () {
            this.parent();
        },
        
        onLoot: function(player) {
            if(player.inventory) {
                var g2i = ig.items.g2i(this);
                
                if (!player.inventory.isFull()) {
                    player.inventory.addItem(g2i);
                    player.inventory.logInfo();
                    this.die();
                } else {
                    console.log("Player Inventory full!");
                    player.inventory.logInfo();
                }
            }
        },

        /**
         * @override
         **/
        pause: function () {
            this.parent();
        },

        /**
         * @override
         **/
        unpause: function () {
            this.parent();
        },
        
        /**
         * Kills character.
         * @override
         **/
        kill: function ( silent ) {
            this.parent( silent );
        },

        /**
         * Automatically called when character finished being killed.
         * <br>- explodes if has {@link ig.Character#explodingDeath} and not {@link ig.EntityExtended#dieingSilently}
         * @override
         **/
        die: function () {

            this.parent();

        },

        /**
         * @override
         */
        cleanup: function () {
            this.parent();
        },

        /**
         * @override
         */
        cleanupCollision: function () {
            this.parent();
        },

        /**
         * Intersects and checks intersected for various properties such as one-way and climbable.
         * @override
         **/
        intersectWith: function (entity) {
            this.parent();
        },

        /**
         * Changes character by updating various actions.
         * <br>- updates temporary invulnerability
         * <br>- regenerates stats
         * <br>- updates abilities
         * <br>- updates jump
         * <br>- updates climb
         * @override
         **/
        updateChanges: function () {
            this.parent();
        },
    });
});
