ig.module('game.items.crafting')

.requires(
    'plusplus.helpers.utils',
    
    'game.items.items',
    'game.items.recipes',
    
    'game.items.item-container'
)

.defines(function() { "use strict";
         
    var _r = ig.recipes;
    var _ut = ig.utils;

    ig.Crafting = ig.ItemContainer.extend({
        
        STATE_NEUTRAL: 0,
        STATE_CRAFT: 1,

        numSlots: 4,
        
        // 0 = neutral (unopened)
        // 1 = opened
        // 2 = crafting, player choosing what to craft
        state: 0,
        
        results: [],
        // results that are ready to be made (have all the materials necessary)
        readyResults: [],
        // index of the currently selected ready recipe to craft
        readySelectedSlot: 0,
        
        init: function(settings) {
            this.parent(settings);
        },
        
        changeState: function(state) {
            this.state = state;
            
            switch (state) {
                case this.STATE_NEUTRAL:
                    this.logInfo();
                    break;
                case this.STATE_CRAFT:
                    var temp = this.results;
                    this.readyResults = temp.filter(function(elem) {
                        return elem.ready;
                    });
                    if (this.readyResults.length) {
                        ig.log("Finalizing Crafting...");
                        this.logInfo();
                    } else {
                        this.state = this.STATE_NEUTRAL;
                    }
                    break;
            }
        },
        
        addItem: function(item) {
            var i, il,
                slotItem;
                
            if(item.stackable) {
                for(i = 0, il = this.numSlots; i < il; i++) {
                    slotItem = this.items[i];
                    
                    if(slotItem && item.displayName === slotItem.displayName) {
                        this.items[i].stacks += item.stacks;
                        this.updateResults();
                        return true;
                    }
                }
            }
        
            if(this.parent(item))
            {
                this.updateResults();
                return true;
            }
            
            return false;
        },
        
        moveSelectedSlot: function(dir) {
            if (this.state === this.STATE_NEUTRAL) {
                var index = this.selectedSlot;
                
                switch(dir) {
                    case 1:
                        index = (index + 1) % this.numSlots;
                        break;
                    case 3:
                        index --;
                        if (index < 0) {
                            index += this.numSlots;
                        }
                        break;
                    default:
                }
                
                this.selectedSlot = index;
            } else if(this.state === this.STATE_CRAFT) {
                var index = this.readySelectedSlot;
                
                switch(dir) {
                    case 1:
                        index = (index + 1) % this.readyResults.length;
                        break;
                    case 3:
                        index --;
                        if (index < 0) {
                            index += this.readyResults.length;
                        }
                        break;
                }
                
                this.readySelectedSlot = index;
            }
        },
        
        removeSlot: function(index) {
			var temp = this.parent(index);
            this.updateResults();
            return temp;
		},
               
        addResult: function(itemName) {
            this.results.push(itemName);
        },
        
        updateResults: function() {
            var materials = [];
            
            for (var i = 0, il = this.items.length; i < il; i++) {
                if (this.items[i]) {
                    materials.push({
                        name: this.items[i].displayName,
                        quantity: this.items[i].stacks
                    });
                }
            }
            
            if (!materials.length) {
                if (this.results.length) {
                    this.results = [];
                }
                
                return;
            }
            
            if (!this.results.length) {
                _r.getResults(materials, this.results);
            } else {
                _r.updateResults(materials, this.results);
            }
        },
        
        craftReadySlot: function(slot) {
            var result = this.readyResults[slot];
            if (result) {
                for(var i = 0, il = result.requiredMaterials.length; i < il; i++) {
                    var currMat = result.requiredMaterials[i];
                    this.depleteItemByName(currMat.name, currMat.quantity);
                    this.updateResults();
                }
                return result.name;
            }
            
            return '';
        },
        
        logInfo: function() {
            if (this.state === this.STATE_NEUTRAL) {
                ig.log("Player Crafting ("+this.getNumItems()+" items): ");
                var row1 = "",
                    row2 = "";
                var i, il, j, jl;
                for(i = 0, il = this.numSlots; i < il; i++) {
                    row1 += "[";
                    if(this.items[i]) {
                        row1 += this.items[i].displayName;
                        if (this.items[i].stackable) {
                            row1 += "("+this.items[i].stacks+")";
                        }
                    }
                    if (this.selectedSlot === i) {
                        row1 += "*";
                    }
                    row1 += "]";
                }
                ig.log(row1);
                ig.log("Possible results: ");
                row2 = "";
                for(i = 0, il = this.results.length; i < il; i++) {
                    row2 += "[" + this.results[i].name + ": (";
                    var requiredMaterials = this.results[i].requiredMaterials;
                    var currentMaterials = this.results[i].currentMaterials;
                    for(j = 0, jl = requiredMaterials.length; j < jl; j++) {
                        var currQuantity = 0,
                            matchingIndex = _ut.indexOfProperty(currentMaterials, "name", requiredMaterials[j].name);
                        if (matchingIndex !== -1) {
                            currQuantity = currentMaterials[matchingIndex].quantity;
                        }
                        row2 += currQuantity + "/" + requiredMaterials[j].quantity + " " + requiredMaterials[j].name;
                        if (j < jl - 1) {
                            row2 += ", ";
                        }
                    }
                    row2 += ")";
                    if (this.results[i].ready) {
                        row2 += "!";
                    }
                    row2 += "]";
                }
                ig.log(row2);
            } else if(this.state === this.STATE_CRAFT) {
                ig.log("Choose what to craft: ");
                var row = "";
                for(var i = 0, il = this.readyResults.length; i < il; i++) {
                    row += "[" + this.readyResults[i].name + ": (";
                    var requiredMaterials = this.readyResults[i].requiredMaterials;
                    var currentMaterials = this.readyResults[i].currentMaterials;
                    for(j = 0, jl = requiredMaterials.length; j < jl; j++) {
                        var currQuantity = 0,
                            matchingIndex = _ut.indexOfProperty(currentMaterials, "name", requiredMaterials[j].name);
                        if (matchingIndex !== -1) {
                            currQuantity = currentMaterials[matchingIndex].quantity;
                        }
                        row += currQuantity + "/" + requiredMaterials[j].quantity + " " + requiredMaterials[j].name;
                        if (j < jl - 1) {
                            row += ", ";
                        }
                    }
                    row += ")";
                    if (this.readySelectedSlot === i) {
                        row += "*";
                    }
                    row += "]";
                }
                ig.log(row);
            }
        }
    });
});
