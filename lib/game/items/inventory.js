ig.module('game.items.inventory')

.requires(
    'plusplus.core.config',
    'plusplus.helpers.utils',
    
    'game.items.item-container'
)

.defines(function(){ "use strict";
         
    var _c = ig.CONFIG;
    var _u = ig.utils;

    ig.Inventory = ig.global.Inventory = ig.ItemContainer.extend({

        numSlots: 6,
        
        items: [],
        selectedSlot: 0,
        
        init: function(settings) {
            this.parent(settings);
        },
    
        // Adds an item to the inventory.
        // Returns whether it was added.
        addItem: function(item) {
            var i, il,
                slotItem;
                
            if(item.stackable) {
                for(i = 0, il = this.numSlots; i < il; i++) {
                    slotItem = this.items[i];
                    
                    if(item.displayName === slotItem.displayName) {
                        this.items[i].stacks += slotItem.stacks;
                        return true;
                    }
                }
            }
                
            return this.parent(item);
        },
        
        // offsets the index of the currently selected item based on direction
        // UP = 0
        // RIGHT = 1
        // DOWN = 2
        // LEFT = 3
        moveSelectedSlot: function(dir) {
            var index = this.selectedSlot;
            
            switch(dir) {
                case 0:
                    if (index % 2 !== 0) {
                        index--;
                    } else {
                        index++;
                    }
                    break;
                case 1:
                    index -= 2;
                    if (index < 0) {
                        index += this.numSlots;
                    }
                    break;
                case 2:
                    if (index % 2 === 0) {
                        index++;
                    } else {
                        index--;
                    }
                    break;
                case 3:
                    index = (index + 2) % this.numSlots;
                    break;
                default:
            }
            
            this.selectedSlot = index;
        },
        
        // depletes the stacks of an item in an inventory slot by the specified amount
        // deletes the item if the stacks reach zero
        // returns whether the slot was able to be depleted
        depleteSlot: function(index, amount) {
            var slotItem = this.items[index];
            if(slotItem) {
                this.items[index].stacks -= amount;
                
                if(slotItem.stacks <= 0) {
                    this.removeSlot(index);
                }
                
                return true;
            }
            
            return false;
        },
        
        // depletes the stacks of an item by name by the specified amount
        // deletes the item if the stacks reach zero
        // returns whether the item was able to be depleted
        depleteItemByName: function(name, amount) {
            var index = this.getSlotIndexByName(name);
            if(index != -1) return this.depleteSlot(index, amount);
                
            return false;
        },
        
        logInfo: function() {
			ig.log("Player Inventory ("+this.getNumItems()+" items): ");
			var row1 = "",
                row2 = "";
			var i, il,
                numRowSlots = this.numSlots * 0.5;
			for(i = numRowSlots-1; i >= 0; i--) {
                row1 += "[";
                if(this.items[i*2]) row1 += this.items[i*2].displayName;
                if (this.selectedSlot === i*2) {
                    row1 += "*";
                }
                row1 += "]";
            }
            ig.log(row1);
            row2 = "";
			for(i = numRowSlots-1; i >= 0; i--) {
                row2 += "[";
                if(this.items[i*2+1]) row2 += this.items[i*2+1].displayName;
                if (this.selectedSlot === (i*2+1)) {
                    row2 += "*";
                }
                row2 += "]";
            }
            ig.log(row2);
        }
    });
});
