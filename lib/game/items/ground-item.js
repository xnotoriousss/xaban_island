ig.module('game.items.ground-item')
    
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
