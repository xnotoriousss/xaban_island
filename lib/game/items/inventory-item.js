ig.module('game.items.inventory-item')

.requires(
)

.defines(function() { "use strict";

    ig.InventoryItem = ig.Class.extend({

        // item data
        
        displayName: "default_string",
        
        iconPath: null,
        
        stackable: false,
        stacks: 1,
        maxStacks: 1,
        
        unbreakable: true,
        durability: 100,
        
        value: 0,
        
        components: {},

        init: function(settings) {
            ig.merge(this, settings);
        },
        
        getComponent: function(name) {
            return this.components[name];  
        },
        
        receiveDurability: function(amount) {
			if (amount > 0) {
				this.durability = Math.min(this.durability + amount, 100);
			} else {
				this.durability += amount;
				if(this.durability <= 0 && !this.unbreakable) {
					if (this.break_callback) {
                        this.break_callback();
                    }
				}
			}
        },
        
        onBreak: function(callback) {
            this.break_callback = callback;
        }
    });
});
