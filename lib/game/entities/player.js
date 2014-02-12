ig.module('game.entities.player')

.requires(
    'plusplus.abstractities.player',
	'plusplus.abstractities.character',
	'plusplus.core.entity',
	'plusplus.core.config',
	'plusplus.helpers.utils',
	'plusplus.helpers.utilsintersection',
	'plusplus.ui.ui-meter',
	'plusplus.ui.ui-text',
	
	'game.items.items',
	'game.items.inventory',
	'game.items.ground-item',
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
		
		buildEntity: null,
		buildSlot: 0,
		
		ui: {},
		
		opaque: true,
		
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
		
		// 0 = NEUTRAL
		// 1 = CRAFT
		// 2 = BUILD
		interfaceState: -1,
		
		STATE_NEUTRAL: 0,
		STATE_CRAFTING: 1,
		STATE_BUILDING: 2,
			
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
				
				// some basic fighting abilities
				/*
				this.abilityMelee = new ig.AbilityMelee(this, {
					// note the name, so we can reference it
					// however, name is not the only way to reference
					// you can also get an ability by type
					name: 'melee',
					// note disabled, we will enable them via triggers later
					enabled: false
				});

				// add to the player's abilities list
				// you do not need to store them as above
				// simply adding them to the abilities list is enough

				this.abilities.addDescendants([
					this.abilityMelee
				]);
				*/
			}
		},
		
		/**
		 * Whenever the player is activated, create the UI if it does not exist.
		 * @override
		 **/
	    activate: function () {

		    this.parent();
		   
		    this.interfaceState = this.STATE_NEUTRAL;
			   
			this.ui.healthMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
				 animSheetPath: 'img/icons_stats.png',
				 animSettings: true,
				 fillStyle: 'rgb(255,54,90)',
				 size: { x: 8, y: 8 },
				 // by default margins are assumed to be a percent
				 marginAsPct: false,
				 margin: { x: 15, y: 15 }
			 });
			
			this.ui.targetAppendage = ig.game.spawnEntity(ig.UIText, 0, 0, {
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
		},
		
		/**
         * Whenever the player is deactivated, destroy the UI if it does exist.
         * @override
         **/
        deactivate: function() {
            this.parent();

			// remove UI from the game

            if(this.ui.healthMeter) {
                ig.game.removeEntity(this.ui.healthMeter);
                this.ui.healthMeter = null;
            }
				
			if(this.ui.targetAppendage) {
				ig.game.removeEntity(this.ui.targetAppendage);
				this.ui.targetAppendage = null;
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
			var name = this.crafting.craftReadySlot(slot);
			
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
		
		changeInterfaceState: function(newState) {
			var crafting = this.crafting;
			if(this.interfaceState === this.STATE_NEUTRAL) {
				switch (newState) {
					case this.STATE_CRAFTING:
						ig.log("Player Crafting opened!");
						this.crafting.changeState(crafting.STATE_NEUTRAL);
						break;
					case this.STATE_BUILDING:
						ig.log("Trying to build now...");
						
						break;
				}
			} else if(this.interfaceState === this.STATE_CRAFTING) {
				ig.log("Player Crafting closed!");
				this.crafting.changeState(crafting.STATE_NEUTRAL);
				for(var i = 0, il = this.crafting.items.length; i < il; i++) {
					if (this.crafting.slotExists(i)) {
						this.switchContainer(i, this.crafting, this.inventory);
					}
				}
			} else if(this.interfaceState === this.STATE_BUILDING) {
			}
			this.interfaceState = newState;
		},
		
		use: function(slot) {
			var inv = this.inventory;
			var item = inv.getSlot(slot);
			if (item) {
				var use = item.components.use;
				if (use) {
					switch(use) {
						case "equip":
							this.switchContainer(slot, this.inventory, this.equipment);
							this.equipment.logInfo();
							break;
						case "build":
							this.changeInterfaceState(this.STATE_BUILDING);
							this.buildEntity = item.components['build'].type;
							this.buildSlot = slot;
							break;
					}
				}
			}
		},
		
		useSelected: function() {
			this.use(this.inventory.getSelectedSlot());
		},
		
		handleInput: function() {
		    this.parent();
			
		    var self = this;
			
			var inputTarget = {x: 0, y: 0};
			var mousePoint = ig.input.inputPoints[0];
			if (mousePoint) {
				inputTarget.x = mousePoint.worldX;
				inputTarget.y = mousePoint.worldY;
			}
			
			if (this.interfaceState >= this.STATE_NEUTRAL && ig.input.pressed('interact_crafting')) {
				// toggle the state
				if(this.interfaceState !== this.STATE_CRAFTING)
					this.changeInterfaceState(this.STATE_CRAFTING);
				else
					this.changeInterfaceState(this.STATE_NEUTRAL);
			}
			
			// handle input accordingly to the interface state (NEUTRAL, CRAFTING, BUILDING)
			var iState = this.interfaceState;
			switch(iState) {
				case this.STATE_NEUTRAL:
					// in neutral mode want to display information on any entities that the input target is hovering over
					var matchBy = function(entity) {
						return entity !== self && (entity instanceof ig.Character ||
												   entity instanceof ig.GroundItem) &&
						_uti.pointInAABB(inputTarget.x, inputTarget.y, entity.pos.x, entity.pos.y,
										 entity.pos.x + entity.size.x, entity.pos.y + entity.size.y);
					};
					
					var selectedEntity = ig.game.getEntitiesMatching(matchBy, {
						layerName: 'entities',
						first: true
					})[0];
					
					var targetAppendage = this.ui.targetAppendage;
					
					if(selectedEntity) {
						var text = selectedEntity.displayName;
						if(targetAppendage.text !== text) {
							this.ui.targetAppendage.text = text;
						}
						
						if(!targetAppendage.visible) {
							this.ui.targetAppendage.visible = true;
						}
						
						this.ui.targetAppendage.moveTo({x: inputTarget.x, y: inputTarget.y}, {
							offsetPct: {x: -1.5, y: -5}
						});
					} else {
						if(targetAppendage.visible) {
							this.ui.targetAppendage.visible = false;
						}
					}
			
					// item container handling
					if (ig.input.released('inv_interact_1')) {
						this.useSelected();
					} else if(ig.input.released('inv_interact_2')) {
						this.inventory.dropSelectedSlot(this.pos.x, this.pos.y);
						this.inventory.logInfo();
					}
				
					if (ig.input.released('inv_left')) {
						this.inventory.moveSelectedSlot(3);
						this.inventory.logInfo();
					} else if (ig.input.released('inv_right')) {
						this.inventory.moveSelectedSlot(1);
						this.inventory.logInfo();
					}
					
					if (ig.input.released('inv_up')) {
						this.inventory.moveSelectedSlot(0);
						this.inventory.logInfo();
					} else if (ig.input.released('inv_down')) {
						this.inventory.moveSelectedSlot(2);
						this.inventory.logInfo();
					}
				
					// outside interaction handling
					if (ig.input.pressed('interact_1')) {
						var entity = _uti.entitiesInAABB(self.pos.x, self.pos.y,
														 self.pos.x + self.size.x, self.pos.y + self.size.y,
														 true, 'entities', false)[1];
							
						if(entity) {
							switch(entity.type) {
								case ig.EntityExtended.TYPE.ITEM:
									self.loot(entity);
									break;
							}
						}
					}
					if(ig.input.state('interact_1')) {
						var entity = _uti.entitiesInAABB(self.pos.x, self.pos.y,
														self.pos.x + self.size.x, self.pos.y + self.size.y,
														true, 'entities', false)[1];
							
						if(entity) {
							switch(entity.type) {
								case ig.EntityExtended.TYPE.RESOURCE:
									self.harvest(entity);
									break;
							}
						}
					}
					break;
				case this.STATE_CRAFTING:
					var crafting = this.crafting;
					var cState = crafting.state;
					
					// item container handling
					if (ig.input.released('inv_interact_1')) {
						if(cState === crafting.STATE_NEUTRAL) {
							this.addToCraftingSelected();
						}
					} else if(ig.input.released('inv_interact_2')) {
						if(cState === crafting.STATE_NEUTRAL) {
							this.crafting.dropSelectedSlot(this.pos.x, this.pos.y);
							this.crafting.logInfo();
						}
					}
				
					if (ig.input.released('inv_left')) {
						this.crafting.moveSelectedSlot(3);
						this.crafting.logInfo();
					} else if (ig.input.released('inv_right')) {
						this.crafting.moveSelectedSlot(1);
						this.crafting.logInfo();
					}
				
					// outside interaction handling
					if (ig.input.pressed('interact_1')) {
						if (cState === this.crafting.STATE_NEUTRAL) {
							this.crafting.changeState(this.crafting.STATE_CRAFT);
						} else if(cState === this.crafting.STATE_CRAFT) {
							this.craftSelected();
							this.crafting.changeState(this.crafting.STATE_NEUTRAL);
							this.inventory.logInfo();
						}
					} else if (ig.input.state('interact_1')) {
					}
					break;
				case this.STATE_BUILDING:
					// outside interaction handling
					if (ig.input.pressed('interact_1')) {
						/*var entity = _uti.entitiesInAABB(inputTarget.x, inputTarget.y,
														 inputTarget.x + self.buildingEntity.size.x, inputTarget.y + self.buildingEntity.size.y,
														 true, 'entities', false)[1];*/
					
						var temp = new (this.buildEntity)();
						var offset = {x: 0, y: 0};
						if (this.facing.y < 0) offset = {x: -temp.size.x * 0.5 + this.size.x * 0.5, y: -temp.size.y};
						else if (this.facing.y > 0) offset = {x: -temp.size.x * 0.5 + this.size.x * 0.5, y: this.size.y};
						else if (this.facing.x < 0) offset = {x: -temp.size.x, y: -temp.size.y * 0.5 + this.size.y * 0.5};
						else if (this.facing.x > 0) offset = {x: this.size.x, y: -temp.size.y * 0.5 + this.size.y * 0.5};
						
						var temp = ig.game.spawnEntity(temp, this.pos.x + offset.x, this.pos.y + offset.y);
						this.inventory.removeSlot(this.buildSlot);
						this.changeInterfaceState(this.STATE_NEUTRAL);
						this.inventory.logInfo();
					}
					break;
				default:
					ig.log("Click the screen to start!");
					break;
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
