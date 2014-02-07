ig.module('game.items.inventory')

.requires(
    'plusplus.core.config',
    'plusplus.helpers.utils',
    
    'game.items.inventory-item'
)

.defines(function(){ "use strict";
         
    var _c = ig.CONFIG;
    var _u = ig.utils;

    ig.Inventory = ig.global.Inventory = ig.Class.extend({

        numSlots: 6,
        
        items: [],
        
        init: function(settings) {
            settings = settings || {};
            
            this.numSlots = settings.numSlots || 6;
            
            for(var i = 0, il = this.numSlots; i < il; i++) {
                this.items[i] = null;
            }
            
            ig.merge(this, settings);
        },
    
        // Adds an item to the inventory.
        // Returns whether it was added.
        addItem: function(item) {
            var i, il,
                slotItem,
                firstEmpty = -1;
                
            if(item.stackable) {
                for(i = 0, il = this.numSlots; i < il; i++) {
                    slotItem = this.items[i];
                    
                    if(item.displayName === slotItem.displayName) {
                        this.items[i].stacks += slotItem.stacks;
                        return true;
                    }
                }
            }
                
            // find the first empty slot
            for(i = 0, il = this.numSlots; i < il; i++) {
                if(!this.items[i]) {
                    firstEmpty = i;
                    break;
                }
            }
            
            // put the new item into the slot
            if(firstEmpty !== -1) {
                this.items[i] = item;
                return true;
            }
            
            return false;
        },
        
        // switches the items between two inventory slots
        switchSlots: function(index1, index2) {
            var temp = items[index1];
            this.items[index1] = this.items[index2];
            this.items[index2] = temp;
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
    
        // removes an item from the inventory in a slot
        // returns the item that was removed
        removeSlot: function(index) {
            var slotItem = this.items[index];
            if(index >= 0 && slotItem) {
                this.items[index] = null;
                return slotItem;
            }
            
            return null;
        },
        
        // removes an item from the inventory by name
        // returns the item that was removed
        removeItemByName: function(name) {
            var index = this.getSlotIndexByName(name);
            if(index != -1) return this.removeSlot(index);
                
            return null;
        },
        
        // gets the index of a slot by the name of an item
        getSlotIndexByName: function(name) {
            for(var i = 0, il = this.numSlots; i < il; i++) {
                if(this.items[i].name === name) return i;
            }
            
            return -1;
        },
    
        // gets the number of items in the inventory
        getNumItems: function() {
            var count = 0;
            for(var i = 0, il = this.numSlots; i < il; i++)
            {
                if(this.items[i])
                    count++;
            }
            return count;
        },
        
        // returns whether the inventory is currently full
        isFull: function() {
            return this.getNumItems() >= this.numSlots;
        }
    });
});