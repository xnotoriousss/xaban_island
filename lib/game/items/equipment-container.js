ig.module('game.items.equipment-container')

.requires(
    'plusplus.helpers.utils',
    
    'game.items.item-container'
)

.defines(function() { "use strict";
         
    var _ut = ig.utils;

    ig.EquipmentContainer = ig.ItemContainer.extend({

        numSlots: 2,
        
        // relevant data from the weapon slot
        // has information like a weapon's damage, tool power, etc
        weaponData: {
            melee: null,
            tool: null
        },
        
        init: function(settings) {
            this.parent(settings);
        },
               
        // adds an item to the appropriate slot
        // returns any item that was replaced to make room
        addItem: function(item) {
            var self = this;
            
            var equip = item.getComponent('equip');
            if (equip) {
                var slot,
                    temp,
                    newItem;
                
                switch (equip.slot) {
                    case 'weapon':
                        slot = ig.EquipmentContainer.SLOT.WEAPON;
                        temp = this.removeSlot(slot);
                        this.items[slot] = newItem = item;
                        this.weaponData.melee = equip.melee || null;
                        this.weaponData.tool = equip.tool || null;
                        break;
                    case 'clothing':
                        slot = ig.EquipmentContainer.SLOT.CLOTHING;
                        temp = this.removeSlot(slot);
                        this.items[slot] = newItem = item;
                        break;
                }
                
                newItem.onBreak(function() {
                    self.removeSlot(slot);
                    self.logInfo();
                });
                if (temp) return temp;
            } else {
                ig.log("Error: Tried to equip item without an equip component");
            }
            
            return null;
        },
        
        removeSlot: function(slot) {
            if (this.slotExists(slot)) {
                this.weaponData.melee = null;
                this.weaponData.tool = null;
                
                if (this.getLightWeapon()) {
                    this.entity.deactivateLight();
                    this.entity.deactivateHeat();
                }
            }
            
            return this.parent(slot);
        },
        
        getWeapon: function() {
            return this.getSlot(ig.EquipmentContainer.SLOT.WEAPON);
        },
        
        getLightWeapon: function() {
            var weapon = this.getWeapon();
            if (weapon) {
                var equip = weapon.getComponent('equip');
                if (equip.entitySettings) {
                    return (equip.entitySettings.glowSettings ? weapon : null);
                }
            }
            return null;
        },
        
        getClothing: function() {
            return this.getSlot(ig.EquipmentContainer.SLOT.CLOTHING);
        },
        
        getWeaponData: function() {
            return this.weaponData;    
        },
        
        damageWeapon: function(amount) {
            var weapon = this.items[ig.EquipmentContainer.SLOT.WEAPON];
            if (weapon) {
                weapon.receiveDurability(-amount);
                console.log(weapon.durability);
            }
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
    
    ig.EquipmentContainer.SLOT = {
        WEAPON: 0,
        CLOTHING: 1
    };
});
