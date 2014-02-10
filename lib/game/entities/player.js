ig.module('game.entities.player')

.requires(
    'plusplus.abstractities.player',
	'plusplus.core.entity',
	'plusplus.core.config',
	'plusplus.helpers.utils',
	'plusplus.helpers.utilsintersection',
	'plusplus.ui.ui-meter',
	'plusplus.ui.ui-text',
	
	'game.items.items',
	'game.items.inventory',
	'game.items.equipment-container',
	'game.items.crafting'
)

.defines(function(){ "use strict";
		 
	var _c = ig.CONFIG;
	var _i = ig.items;
	var _ut = ig.utils;
	var _uti = ig.utilsintersection;

	ig.EntityPlayer = ig.global.EntityPlayer = ig.Player.extend({
    
		size: {x: 24, y: 40},
		offset: {x: 22, y: 14},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/player.png', 64, 64),
		
		animInit: "idleX",
		
		animSettings: {
			idleX: {
				frameTime: 0.5,
				sequence: [10,11]
			},
			idleUp: {
				frameTime: 0.5,
				sequence: [25,26]
			},
			idleDown: {
				frameTime: 0.5,
				sequence: [40,41]
			},
			moveX: {
				frameTime: 0.07,
				sequence: [5, 6, 7, 8]
			},
			moveDown: {
				frameTime: 0.07,
				sequence: [35, 36, 37, 38]
			},
			moveUp: {
				frameTime: 0.07,
				sequence: [20, 21, 22, 23]
			},
		},
		
		ui: {},
		
		opaque: true,
		persistent: true,
		
		displayName: "Xaban",
		
		health: 100,
		
		regen: true,
		regenEnergy: false,
		regenRateHealth: 1,
		
		speed: {
			x: 1000,
			y: 1000
		},
		
        maxVelGrounded: {x: 200, y: 200},
		
		inventory: null,
		crafting: null,
		equipment: null,
			
		// moves an item in the specified slot of the original container to a destination container
		switchContainer: function(slot, origin, destination) {
			if (origin.slotExists(slot)) {
				var temp = origin.removeSlot(slot);
				destination.addItem(temp);
			}
		},
			
		// moves an item in the selected slot of the original container to a destination container
		switchContainerSelected: function(origin, destination) {
			if (origin.selectedSlotExists()) {
				var temp = origin.removeSelectedSlot();
				destination.addItem(temp);
			}
		},
    
		initProperties: function() {
			this.parent();
			
			if(!ig.global.wm) {
				this.ui.healthMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
					animSheetPath: 'img/icons_stats.png',
					animSettings: true,
					fillStyle: 'rgb(255,54,90)',
					size: { x: 8, y: 8 },
					// by default margins are assumed to be a percent
					marginAsPct: false,
					margin: { x: 15, y: 15 }
				});
				
				this.ui.cursorAppendage = ig.game.spawnEntity(ig.UIText, 0, 0, {
					visible: false,
					fixed: false,
					text: "default_string",
					
				});
				
				this.inventory = new ig.Inventory({
					numSlots: 6
				});
				
				this.crafting = new ig.Crafting({
					numSlots: 4
				});
				
				this.equipment = new ig.EquipmentContainer({
				});
			}
		},
		
		/**
         * Whenever the player is deactivated, destroy the UI if it does exist.
         * @override
         **/
        deactivate: function() {
            this.parent();

            if(this._activatingUI || this._activeUI) {
                this._activeUI = this._activatingUI = false;

                // remove UI from the game

                if(this.ui.healthMeter) {
                    ig.game.removeEntity(this.ui.healthMeter);
                    this.ui.healthMeter = null;
                }
				
				if(this.ui.cursorAppendage) {
					ig.game.removeEntity(this.ui.cursorAppendage);
					this.ui.cursorAppendage = null;
				}
            }
        },
		
		/**
		 * @override
         **/
        receiveDamage: function(amount, from, unblockable) {
            var killed = this._killed;
            var applied = this.parent(amount, from, unblockable);

            if(!killed && applied && this.ui.healthMeter) {
                this.ui.healthMeter.setValue(this.health / this.healthMax);
			}

            return applied;
        },

        /**
         * @override
         **/
        receiveHealing: function (amount, from) {
            this.parent(amount, from);

            if(!this._killed && this.ui.healthMeter) {
                this.ui.healthMeter.setValue(this.health / this.healthMax);
            }
        },
		
		loot: function(item) {
			if(item) {
				item.onLoot(this);
			}
		},
		
		harvest: function(resource) {
		    if(resource) {
				resource.onHarvest(this);
			}
		},
		
		stop: function() {
			
		},
		
		addToEquipment: function(slot) {
			var inv = this.inventory;
			if (inv.slotExists(slot) && inv.isSlotEquippable(slot)) {
				this.switchContainer(slot, this.inventory, this.equipment);
			}
			
			this.equipment.logInfo();
		},
		
		addToEquipmentSelected: function() {
			this.addToEquipment(this.inventory.getSelectedSlot());
		},
		
		addToCrafting: function(slot) {
			var inv = this.inventory;
			if (inv.slotExists(slot)) {
				this.switchContainer(slot, this.inventory, this.crafting);
			}
			
			this.crafting.logInfo();
			this.inventory.logInfo();
		},
		
		addToCraftingSelected: function() {
			this.addToCrafting(this.inventory.getSelectedSlot());
		},
		
		craft: function(slot) {
			var name = this.crafting.getReadyResultName(slot);
			
			if (name) {
				if(!this.inventory.isFull()) {
					var n2i = _i.n2i(name);
					this.inventory.addItem(n2i);
				} else {
					var n2g = _i.n2g(name);
					ig.game.spawnEntity(n2g, this.pos.x, this.pos.y);
				}
			}
		},
		
		craftSelected: function() {
			this.craft(this.crafting.readySelectedSlot);
		},
		
		handleInput: function() {
		    this.parent();
			
		    var self = this;
			
			var mousePoint = ig.input.inputPoints[0];
			
			if (ig.input.released('interact_crafting')) {
				if(this.crafting.state === 0) this.crafting.changeState(1);
				else if (this.crafting.state > 0) this.crafting.changeState(0);
			}
			var cState = this.crafting.state;
			
			// item container handling
			if (ig.input.released('inv_interact_1')) {
				if (!ig.input.state('interact_switch')) {
					this.addToEquipmentSelected();
				} else if(cState === 1) {
					// FIX: call use instead of equip for this command
					this.addToCraftingSelected();
				}
			} else if(ig.input.released('inv_interact_2')) {
				if (!ig.input.state('interact_switch')) {
					this.inventory.dropSelectedSlot(this.pos.x, this.pos.y);
					this.inventory.logInfo();
				} else if(cState === 1) {
					this.crafting.dropSelectedSlot(this.pos.x, this.pos.y);
					this.crafting.logInfo();
				}
			}
			
			if (ig.input.released('inv_left')) {
				if (!ig.input.state('interact_switch')) {
					this.inventory.moveSelectedSlot(3);
					this.inventory.logInfo();
				} else if(cState > 0) {
					this.crafting.moveSelectedSlot(3);
					this.crafting.logInfo();
				}
			} else if (ig.input.released('inv_right')) {
				if (!ig.input.state('interact_switch')) {
					this.inventory.moveSelectedSlot(1);
					this.inventory.logInfo();
				} else if(cState > 0) {
					this.crafting.moveSelectedSlot(1);
					this.crafting.logInfo();
				}
			}
			
			if (ig.input.released('inv_up')) {
				if (!cState || !ig.input.state('interact_switch')) {
					this.inventory.moveSelectedSlot(0);
					this.inventory.logInfo();
				}
			} else if (ig.input.released('inv_down')) {
				if (!cState || !ig.input.state('interact_switch')) {
					this.inventory.moveSelectedSlot(2);
					this.inventory.logInfo();
				}
			}
			
			// outside interaction handling
			if (ig.input.released('interact_1')) {
				
				if (!ig.input.state('interact_switch')) {

					var entity = _uti.entitiesInAABB(self.pos.x, self.pos.y,
													 self.pos.x + self.size.x, self.pos.y + self.size.y,
													 true, 'entities', false)[1];
					
					if(entity) {
						switch(entity.type) {
							case ig.EntityExtended.TYPE.ITEM:
								self.loot(entity);
								break;
							case ig.EntityExtended.TYPE.RESOURCE:
								self.harvest(entity);
								break;
						}
					}
				} else {
					if (cState === 1) {
						this.crafting.changeState(2);
					} else if(cState === 2) {
						this.craftSelected();
						this.crafting.changeState(0);
						this.inventory.logInfo();
					}
				}
			}
			
			if (mousePoint) {
				var matchBy = function(entity) {
					return entity !== self && (entity.type & ig.EntityExtended.TYPE.CHARACTER ||
											   entity.type & ig.EntityExtended.TYPE.ITEM) &&
					_uti.pointInAABB(mousePoint.worldX, mousePoint.worldY, entity.pos.x, entity.pos.y,
									 entity.pos.x + entity.size.x, entity.pos.y + entity.size.y);
				};
				
				var selectedEntity = ig.game.getEntitiesMatching(matchBy, {
					layerName: 'entities',
					first: true
				})[0];
				
				var cursorAppendage = this.ui.cursorAppendage;
				
				if(selectedEntity) {
					var text = selectedEntity.displayName;
					if(cursorAppendage.text !== text) {
						this.ui.cursorAppendage.text = text;
					}
					
					if(!cursorAppendage.visible) {
						this.ui.cursorAppendage.visible = true;
					}
					
					this.ui.cursorAppendage.moveTo({x: mousePoint.worldX, y: mousePoint.worldY}, {
						offsetPct: {x: -1.5, y: -5}
					});
				} else {
					if(cursorAppendage.visible) {
						this.ui.cursorAppendage.visible = false;
					}
				}
			}
		},
		
		/**
         * When game is reset and player is cleared from persistent cache, we need to make sure we remove all persistent additions such as UI.
         * @override
         */
        cleanupPersistent: function () {

            this.deactivate();

        }
	});
});
