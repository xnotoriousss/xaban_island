ig.module('game.items.equipment-container')

.requires(
    'plusplus.helpers.utils',
    
    'game.items.item-container'
)

.defines(function() { "use strict";
         
    var _ut = ig.utils;

    ig.EquipmentContainer = ig.ItemContainer.extend({

        numSlots: 2,
        
        SLOT_WEAPON: 0,
        SLOT_CLOTHING: 1,
        
        init: function(settings) {
            this.parent(settings);
        },
               
        // adds an item to the appropriate slot
        // returns any item that was replaced to make room
        addItem: function(item) {
            var equip = item.getComponent('equip');
            if (equip) {
                var temp;
                
                switch (equip.slot) {
                    case 'weapon':
                        temp = this.items[this.SLOT_WEAPON];
                        this.items[this.SLOT_WEAPON] = item;
                        break;
                    case 'clothing':
                        temp = this.items[this.SLOT_CLOTHING];
                        this.items[this.SLOT_CLOTHING] = item;
                        break;
                }
                if (temp) return temp;
            } else {
                ig.log("Error: Tried to equip item without an equip component");
            }
            
            return null;
        },
        
        logInfo: function() {
			ig.log("Player Equipment: ");
			var row1 = "";
			var i, il;
            var items = _ut.toArray(this.items);
			for(i = 0, il = this.numSlots; i < il; i++) {
                row1 += "[";
                if(items[i]) row1 += items[i].displayName;
                if (this.selectedSlot === i) {
                    row1 += "*";
                }
                row1 += "]";
            }
            ig.log(row1);
        }
    });
});
