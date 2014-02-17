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

    var _c = ig.CONFIG;ig.module('game.items.ground-item')
    
.requires(
    'plusplus.core.timer',
    'plusplus.core.hierarchy',
    'plusplus.helpers.utils',
    
    'game.abstractities.character'
)
    
.defines(function () { "use strict";

    var _ut = ig.utils;

    ig.GroundItem = ig.Character.extend(/**@lends ig.GroundItem.prototype */{

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
        maxStacks: 1,
        value: 0,

        health: 1,

        initTypes: function () {
            this.parent();
            _ut.addType(ig.EntityExtended, this, 'type', "ITEM");

        },
        
        onLoot: function(player) {
            if(player.inventory) {
                var g2i = ig.items.g2i(this);
                g2i.stacks = this.stacks;
                

                if(player.inventory.addItem(g2i)) {
                    player.inventory.logInfo();
                    this.die();
                } else {
                    console.log("Player Inventory full!");
                    player.inventory.logInfo();
                }
            }
        }
    });
});

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
        maxStacks: 1,
        
        value: 0,
        
        components: {},

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
        
        onLoot: function(player) {
            if(player.inventory) {
                var g2i = ig.items.g2i(this);
                g2i.stacks = this.stacks;
                

                if(player.inventory.addItem(g2i)) {
                    player.inventory.logInfo();
                    this.die();
                } else {
                    console.log("Player Inventory full!");
                    player.inventory.logInfo();
                }
            }
        }
    });
});
