ig.module('game.items.item-container')

.requires(
    'plusplus.core.config',
    'plusplus.helpers.utils',
    
    'game.items.inventory-item'
)

.defines(function(){ "use strict";
         
    var _c = ig.CONFIG;
    var _u = ig.utils;

    ig.ItemContainer = ig.global.ItemContainer = ig.Class.extend({

        numSlots: 6,
        
        items: [],
        selectedSlot: 0,
        
        init: function(settings) {
            settings = settings || {};
            
            this.numSlots = settings.numSlots || this.numSlots;
            
            for(var i = 0, il = this.numSlots; i < il; i++) {
                this.items[i] = null;
            }
            
            ig.merge(this, settings);
        },
    
        // Adds an item to the container.
        // Returns whether it was added.
        addItem: function(item) {
            // find the first empty slot
            var firstEmpty = this.getEmptySlotIndex();
            
            // put the new item into the slot
            if(firstEmpty !== -1) {
                this.items[firstEmpty] = item;
                return true;
            }
            
            return false;
        },
		
        // switches the items between two container slots
        switchSlots: function(index1, index2) {
            var temp = items[index1];
            this.items[index1] = this.items[index2];
            this.items[index2] = temp;
        },
        
		// finds the first empty slot in the container
		getEmptySlotIndex: function() {
            for(var i = 0, il = this.numSlots; i < il; i++) {
                if(!this.items[i])
                    return i;
            }
            
            return -1;
        },
    
        // removes an item from the container in a slot
        // returns the item that was removed
        removeSlot: function(index) {
            var slotItem = this.items[index];
            if(slotItem) {
                this.items[index] = null;
                return slotItem;
            }
            
            return null;
        },
        
        // removes an item from the container by name
        // returns the item that was removed
        removeItemByName: function(name) {
            var index = this.getSlotIndexByName(name);
            if(index != -1) return this.removeSlot(index);
                
            return null;
        },
		
		emptyAll: function() {
            this.results = [];
            this.items = [];
        },
        
        // gets the index of a slot by the name of an item
        getSlotIndexByName: function(name) {
            for(var i = 0, il = this.numSlots; i < il; i++) {
                if(this.items[i].name === name) return i;
            }
            
            return -1;
        },
    
        // gets the number of items in the container
        getNumItems: function() {
            var count = 0;
            for(var i = 0, il = this.numSlots; i < il; i++)
            {
                if(this.items[i])
                    count++;
            }
            return count;
        },
        
        // returns whether the container is currently full
        isFull: function() {
            return this.getNumItems() >= this.numSlots;
        },
    });
});
