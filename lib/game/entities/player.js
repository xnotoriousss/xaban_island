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
	
	'game.abstractities.entity',
	
	'game.core.combat',
	
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
		
		stamina: 100,
		
		hunger: {
			value: 100,
			valueMax: 100,
			
			regenRate: -0.0016,
		},
		
		temperature: {
			heat: 100,
			heatMax: 200,
			heatPivot: 100,
			heatLowOffsetThreshold: 50,
			heatHighOffsetThreshold: 150,
			
			ambientTemperature: 35,
			adjustedTemperature: 35,
			
			distanceModifier: 0.5,
			
			baseHeatRegenRate: 0.01,
			adjustedHeatRegenRate: 0
		},
		
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
			
			this.ui.hungerMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
				 animSheetPath: 'img/icons_stats_hunger.png',
				 animSettings: true,
				 fillStyle: 'rgb(204,255,0)',
				 size: { x: 8, y: 8 },
				 // by default margins are assumed to be a percent
				 marginAsPct: false,
				 margin: { x: 15, y: 60 }
			});
			
			this.ui.tempMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
				 animSheetPath: 'img/icons_stats_temperature.png',
				 animSettings: true,
				 fillStyle: 'rgb(69,170,255)',
				 backgroundStyle: 'rgb(255,0,0)',
				 size: { x: 8, y: 8 },
				 // by default margins are assumed to be a percent
				 marginAsPct: false,
				 margin: { x: 15, y: 105 }
			});
			
			this.ui.targetAppendage = ig.game.spawnEntity(ig.UIText, 0, 0, {
				 visible: false,
				 fixed: false,
				 text: "default_string"
				 
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
			
			if (this.ui.tempMeter) {
				ig.game.removeEntity(this.ui.tempMeter);
				this.ui.tempMeter = null;
			}
			
			if (this.ui.hungerMeter) {
				ig.game.removeEntity(this.ui.hungerMeter);
				this.ui.hungerMeter = null;
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
		
		receiveHunger: function (amount, from) {
            this.hunger.value = Math.max(this.hunger.value + amount, 0);
			var temp = this.hunger;
			if(amount < 0 && temp.value <= 0) {
				this.receiveDamage(0.33, this, true);
				console.log("Hunger-health: "+this.health);
			}
			
			if (!this._killed && this.ui.tempMeter) {
				this.ui.hungerMeter.setValue(temp.value / temp.valueMax);
			}
        },
		
		receiveTemperature: function (amount, from) {
            this.temperature.heat = Math.min(this.temperature.heat + amount, this.temperature.heatMax);
			var temp = this.temperature;
			if(temp.heat < temp.heatLowOffsetThreshold) {
				var diff = temp.heatLowOffsetThreshold - temp.heat;
				this.receiveDamage(diff * 0.15, this, true);
			} else if(temp.heat > temp.heatHighOffsetThreshold) {
				var diff = temp.heat - temp.heatHighOffsetThreshold;
				this.receiveDamage(diff * 0.15, this, true);
			}
			
			if (!this._killed && this.ui.tempMeter) {
				this.ui.tempMeter.setValue(temp.heat / temp.heatMax);
			}
        },
		
		updateTemperatureRegeneration: function() {
			var self = this;
			
			var matchBy = function(entity) {
				return entity.getComponent('heat');
			};
					
			var selectedEntities = ig.game.getEntitiesMatching(matchBy, {
				layerName: 'entities',
				distanceSquared: 1000000,
				from: this
			});
			
			var temp = this.temperature;
			
			if (selectedEntities.length) {
				
				selectedEntities.sort(function(a, b) {
					var h1 = a.getComponent('heat'), h2 = b.getComponent('heat');
					var d1 = a.distanceSquaredTo(self), d2 = b.distanceSquaredTo(self);
					var t1 = h1.baseTemperature - d1 * temp.distanceModifier;
					var t2 = h2.baseTemperature - d2 * temp.distanceModifier;
					
					if (t1 > t2) return 1;
					if (t1 < t2) return -1;
					return 0;
				});
				
				var selectedEntity = selectedEntities[0];
				
				var h = selectedEntity.getComponent('heat');
				var d = selectedEntity.distanceTo(this);
				var adjustedSourceTemp = h.baseTemperature - (d - h.optimumDistance) * temp.distanceModifier;
				var adjustedTemperature = Math.max(temp.ambientTemperature, adjustedSourceTemp);
				this.temperature.adjustedTemperature = adjustedTemperature;
				
				//console.log("Your adjusted temperature: "+this.temperature.adjustedTemperature);
				
				var diffPct = (adjustedTemperature - temp.heat) / temp.heatPivot;
				var regenModifier = Math.pow(2, Math.abs(diffPct) * 7);
				this.temperature.adjustedHeatRegenRate = (diffPct >= 0 ? 1 : -1) * temp.baseHeatRegenRate * (regenModifier - 1);
				//console.log("Your adjusted heat regen rate: "+this.temperature.adjustedHeatRegenRate);
			} else {
				this.temperature.adjustedTemperature = temp.ambientTemperature;
				//console.log("Your adjusted temperature: "+temp.adjustedTemperature);
				
				var diffPct = (temp.ambientTemperature - temp.heat) / temp.heatPivot;
				var regenModifier = Math.pow(2, Math.abs(diffPct) * 7);
				this.temperature.adjustedHeatRegenRate = (diffPct >= 0 ? 1 : -1) * temp.baseHeatRegenRate * (regenModifier - 1);
				//console.log("Your adjusted heat regen rate: "+this.temperature.adjustedHeatRegenRate);
			}
		},
		
		/**
         * Restores stats at a steady rate.
         * @override
         **/
        regenerate: function() {
			this.parent();
			
			this.updateTemperatureRegeneration();
			
			this.receiveHunger(this.hunger.regenRate, this);
            this.receiveTemperature(this.temperature.adjustedHeatRegenRate, this);
        },
		
		attack: function(creature) {
            if(creature) {
                if (this.equipment.items[0]) {
                    ig.combat.attack(creature, this, this.equipment.items[0].components.weapon.type, this.equipment.items[0].components.weapon.damage); // TODO: Replace 0 with weapon range
                } else {
                    ig.log("No Weapon");
                    ig.combat.attack(creature, this, 0, 1);
                }
            }
        },
		
		loot: function(item) {
			if(item) {
				item.onLoot(this);
			}
		},
		
		harvest: function(resource) {
		    if(resource) {
				resource.onHarvest(null, 10);
			}
		},
		
		stop: function() {
			
		},
		
		// moves an item in the specified slot of the original container to a destination container
		switchContainer: function(slot, origin, destination) {
			if (origin.slotExists(slot)) {
				var temp = origin.removeSlot(slot);
				if (destination !== this.equipment) {
					destination.addItem(temp);
				} else {
					var replaced = destination.addItem(temp);
					console.log(replaced);
					if(replaced) {
						origin.addItem(replaced);
					}
				}
			}
		},
			
		// moves an item in the selected slot of the original container to a destination container
		switchContainerSelected: function(origin, destination) {
			this.switchContainer(origin.getSelectedSlot(), origin, destination);
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
						return entity !== self &&(entity instanceof ig.EntityExtended) && entity.displayName &&
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
					
					if (ig.input.pressed('interact_attack')) {
						// Duct tapes
						
						var top = this.pos.y;
						var left = this.pos.x;
						var bottom = this.pos.y + this.size.y;
						var right = this.pos.x + this.size.x;
						if (this.facing.y == -1) {
							top = this.pos.y + this.facing.y * this.size.y;
						} else if (this.facing.y == 1) {
							bottom = this.pos.y + this.size.y + this.facing.y * this.size.y;
						} else if (this.facing.x == -1) {
							left = this.pos.x + this.facing.x * this.size.x;
						} else if (this.facing.x == 1) {
							right = this.pos.x + this.size.x + this.facing.x * this.size.x;
						}
						var entity = _uti.entitiesInAABB(left, top, right, bottom, true,  'entities', false)[1];
						if(entity != this && entity) {
							switch(entity.type) {
								case ig.EntityExtended.TYPE.CREATURE: // TODO: Figure out ig.EntityExtended.TYPE.CREATURE
									
									this.attack(entity);
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
						if(ig.input.state('interact_switch') && cState === crafting.STATE_NEUTRAL) {
							this.addToCraftingSelected();
						}
					} else if(ig.input.released('inv_interact_2')) {
						if(ig.input.state('interact_switch') && cState === crafting.STATE_NEUTRAL) {
							this.crafting.dropSelectedSlot(this.pos.x, this.pos.y);
							this.crafting.logInfo();
						}
					}
				
					if (ig.input.released('inv_left')) {
						if (!ig.input.state('interact_switch')) {
							this.inventory.moveSelectedSlot(3);
							this.inventory.logInfo();
						} else {
							this.crafting.moveSelectedSlot(3);
							this.crafting.logInfo();
						}
					} else if (ig.input.released('inv_right')) {
						if (!ig.input.state('interact_switch')) {
							this.inventory.moveSelectedSlot(1);
							this.inventory.logInfo();
						} else {
							this.crafting.moveSelectedSlot(1);
							this.crafting.logInfo();
						}
					}
					
					if (ig.input.released('inv_up')) {
						if (!ig.input.state('interact_switch')) {
							this.inventory.moveSelectedSlot(0);
							this.inventory.logInfo();
						}
					} else if (ig.input.released('inv_down')) {
						if (!ig.input.state('interact_switch')) {
							this.inventory.moveSelectedSlot(2);
							this.inventory.logInfo();
						}
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
