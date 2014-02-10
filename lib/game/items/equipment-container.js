ig.module('game.items.equipment-container')

.requires(
    'game.items.item-container'
)

.defines(function() { "use strict";

    ig.EquipmentContainer = ig.ItemContainer.extend({

        numSlots: 3,
        
        init: function(settings) {
            this.parent(settings);
        },
               
        addItem: function(item) {
            return this.parent(item);
        },
        
        logInfo: function() {
			ig.log("Player Equipment ("+this.getNumItems()+" items): ");
			var row1 = "";
			var i, il;
			for(i = 0, il = this.numSlots; i < il; i++) {
                row1 += "[";
                if(this.items[i]) row1 += this.items[i].displayName;
                if (this.selectedSlot === i) {
                    row1 += "*";
                }
                row1 += "]";
            }
            ig.log(row1);
        }
    });
});
