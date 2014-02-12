ig.module('game.items.inventory')

.requires(
    'plusplus.core.config',
    'plusplus.helpers.utils',
    
    'game.items.item-container'
)

.defines(function(){ "use strict";
         
    var _c = ig.CONFIG;ig.module('game.items.inventory')

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
                    
                    if(slotItem && item.displayName === slotItem.displayName) {
                        this.items[i].stacks += item.stacks;
                        return true;
                    }
                }
            }
                
            return this.parent(item);
        },
        
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
                    index = (index + 2) % this.numSlots;
                    break;
                case 2:
                    if (index % 2 === 0) {
                        index++;
                    } else {
                        index--;
                    }
                    break;
                case 3:
                    index -= 2;
                    if (index < 0) {
                        index += this.numSlots;
                    }
                    break;
                default:
            }
            
            this.selectedSlot = index;
        },
        
        logInfo: function() {
			ig.log("Player Inventory ("+this.getNumItems()+" items): ");
			var row1 = "",
                row2 = "";
			var i, il, currIndex,
                numRowSlots = this.numSlots * 0.5;
			for(i = 0; i < numRowSlots; i++) {
                currIndex = i*2;
                
                row1 += "[";
                if(this.items[currIndex])
                {
                    row1 += this.items[currIndex].displayName;
                    if (this.items[currIndex].stackable) {
                        row1 += "("+this.items[currIndex].stacks+")";
                    }
                }
                if (this.selectedSlot === currIndex) {
                    row1 += "*";
                }
                row1 += "]";
            }
            ig.log(row1);
            row2 = "";
			for(i = 0; i < numRowSlots; i++) {
                currIndex = i*2+1;
                row2 += "[";
                if(this.items[currIndex]) {
                    row2 += this.items[currIndex].displayName;
                    if (this.items[currIndex].stackable) {
                        row2 += "("+this.items[currIndex].stacks+")";
                    }
                }
                if (this.selectedSlot === (currIndex)) {
                    row2 += "*";
                }
                row2 += "]";
            }
            ig.log(row2);
        }
    });
});
    var _u = ig.utils;

    ig.Inventory = ig.global.Inventory = ig.ItemContainer.extend({

        numSlots: 6,
        
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
                    
                    if(slotItem && item.displayName === slotItem.displayName) {
                        this.items[i].stacks += item.stacks;
                        return true;
                    }
                }
            }
                
            return this.parent(item);
        },
        
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
                    index = (index + 2) % this.numSlots;
                    break;
                case 2:
                    if (index % 2 === 0) {
                        index++;
                    } else {
                        index--;
                    }
                    break;
                case 3:
                    index -= 2;
                    if (index < 0) {
                        index += this.numSlots;
                    }
                    break;
                default:
            }
            
            this.selectedSlot = index;
        },
        
        isSlotEquippable: function(index) {
            return this.items[index].hasComponent('weapon');
        },
        
        isSelectedSlotEquippable: function() {
            return this.isSlotEquippable(this.selectedSlot);
        },
        
        logInfo: function() {
			ig.log("Player Inventory ("+this.getNumItems()+" items): ");
			var row1 = "",
                row2 = "";
			var i, il, currIndex,
                numRowSlots = this.numSlots * 0.5;
			for(i = 0; i < numRowSlots; i++) {
                currIndex = i*2;
                
                row1 += "[";
                if(this.items[currIndex])
                {
                    row1 += this.items[currIndex].displayName;
                    if (this.items[currIndex].stackable) {
                        row1 += "("+this.items[currIndex].stacks+")";
                    }
                }
                if (this.selectedSlot === currIndex) {
                    row1 += "*";
                }
                row1 += "]";
            }
            ig.log(row1);
            row2 = "";
			for(i = 0; i < numRowSlots; i++) {
                currIndex = i*2+1;
                row2 += "[";
                if(this.items[currIndex]) {
                    row2 += this.items[currIndex].displayName;
                    if (this.items[currIndex].stackable) {
                        row2 += "("+this.items[currIndex].stacks+")";
                    }
                }
                if (this.selectedSlot === (currIndex)) {
                    row2 += "*";
                }
                row2 += "]";
            }
            ig.log(row2);
        }
    });
});
