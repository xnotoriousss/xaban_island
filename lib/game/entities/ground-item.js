ig.module('game.entities.ground-item')
    
.requires(
    'plusplus.helpers.utils',
    
    'game.abstractities.character'
)
    
.defines(function () { "use strict";

    var _ut = ig.utils;
    var _c = ig.CONFIG;

    ig.EntityGroundItem = ig.global.EntityGroundItem = ig.Character.extend({

        targetable: true,
        
        size: {x: 32, y: 32},
		offset: {x: 0, y: 0},
        
        animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/item-spear.png', 32, 32),
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
            _ut.addType(ig.EntityExtended, this, 'type', "INTERACTIVE LOOTABLE");
        },
        
        resetExtras: function() {
			this.parent();
			
			this.rangeInteractableX = 8;
			this.rangeInteractableY = 8;
            /*
            if (!this.displayName) {
                this.kill(true);
            }*/
		},
        
        onLoot: function(player) {
            if(player.inventory) {
                var g2i = ig.items.g2i(this);
                g2i.stacks = this.stacks;
                

                if(player.inventory.addItem(g2i)) {
                    player.inventory.logInfo();
                    this.kill(true);
                } else {
                    console.log("Player Inventory full!");
                    player.inventory.logInfo();
                }
            }
        }
    });
});
