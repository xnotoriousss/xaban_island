ig.module('game.items.crafting')

.requires(
    'game.items.items',
    
    'game.items.item-container'
)

.defines(function() { "use strict";

    ig.Crafting = ig.ItemContainer.extend({

        numSlots: 4,
        
        results: [],
        
        init: function(settings) {
            this.parent(settings);
        },
               
        addItem: function(item) {
            var i, il,
                slotItem;
                
            if(item.stackable) {
                for(i = 0, il = this.numSlots; i < il; i++) {
                    slotItem = this.items[i];
                    
                    if(item.displayName === slotItem.displayName) {
                        this.items[i].stacks += slotItem.stacks;
                        this.updateResults();
                        return true;
                    }
                }
            }
        
            return this.parent(item);
        },
               
        addResult: function(itemName){
            this.results.push(itemName);
        },
               
        //check for results from item data, use addResult(itemName) to put result onto array
        updateResults: function() {
            var newItemName;
            this.addResult(newItemName);
        }
    });
});
