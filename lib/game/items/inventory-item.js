ig.module('game.items.inventory-item')

.requires(
)

.defines(function() { "use strict";

    ig.InventoryItem = ig.Class.extend({

        // item data
        
        displayName: "default_string",
        
        stackable: false,
        stacks: 1,
        maxStacks: 1,
        
        value: 0,
        
        components: {},

        init: function(settings) {
            ig.merge(this, settings);
        },
        
        getComponent: function(name) {
            return this.components[name];  
        }
    });
});
