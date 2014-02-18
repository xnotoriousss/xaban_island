ig.module('game.entities.player')

.requires(
    'plusplus.abstractities.player',
	'plusplus.core.config',
	'plusplus.helpers.utils',
	'plusplus.helpers.utilsintersection',
	'plusplus.ui.ui-meter',
	'plusplus.ui.ui-text',
	
	'game.core.combat',
	'game.ui.ui-world-time',
	
	'game.abstractities.character',
	
	'game.items.items',
	'game.items.buildables',
	'game.items.inventory',
	'game.items.ground-item',
	'game.items.equipment-container',
	'game.items.crafting'
)

.defines(function(){ "use strict";
		 
	var _c = ig.CONFIG;
	var _i = ig.items;
	var _b = ig.buildables;
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
		regenDelay: 0.5,
		regenEnergy: false,
		regenHealth: false,
		
		attackDelay: 1,
		attackTimer: null,
		
		stamina: 100,
		
		hunger: {
			value: 100,
			valueMax: 100,
			
			regenRate: -0.05,
		},
		
		heat: {
			value: 100,
			valueMax: 100,
			
			baseAmbientRegenRate: 3,
			adjustedAmbientRegenRate: 3,
			baseRegenRate: 3,
			adjustedRegenRate: 0,
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
				
				this.attackTimer = new ig.Timer();
				
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
		
		pause: function() {
			this.parent();
			
			this.attackTimer.pause();
		},
		
		unpause: function() {
			this.parent();
			
			this.attackTimer.unpause();
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
				 margin: { x: 15, y: 15 },
				 scale: 3
			});
			
			this.ui.hungerMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
				 animSheetPath: 'img/icons_stats_hunger.png',
				 animSettings: true,
				 fillStyle: 'rgb(204,255,0)',
				 size: { x: 8, y: 8 },
				 // by default margins are assumed to be a percent
				 marginAsPct: false,
				 margin: { x: 15, y: 60 },
				 scale: 3
			});
			
			this.ui.tempMeter = ig.game.spawnEntity(ig.UIMeter, 0, 0, {
				 animSheetPath: 'img/icons_stats_temperature.png',
				 animSettings: true,
				 fillStyle: 'rgb(255,0,0)',
				 backgroundStyle: 'rgb(69,170,255)',
				 size: { x: 8, y: 8 },
				 // by default margins are assumed to be a percent
				 marginAsPct: false,
				 margin: { x: 15, y: 105 },
				 scale: 3
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
			var hunger = this.hunger;
			if (amount > 0) {
				hunger.value = Math.min(hunger.value + amount, hunger.valueMax);
			} else {
				hunger.value = Math.max(hunger.value + amount, 0);
				if(hunger.value <= 0) {
					this.receiveDamage(10, this, true);
				}
			}
			
			if (!this._killed && this.ui.tempMeter) {
				this.ui.hungerMeter.setValue(hunger.value / hunger.valueMax);
			}
        },
		
		receiveHeat: function (amount, from) {
			var heat = this.heat;

			if (amount > 0) {
				heat.value = Math.min(heat.value + amount, heat.valueMax);
			} else if(amount < 0) {
				heat.value = Math.max(heat.value + amount, 0);
				if(heat.value <= 0) {
					this.receiveDamage(4.5, this, true);
				}
			}
			
			if (!this._killed && this.ui.tempMeter) {
				this.ui.tempMeter.setValue(heat.value / heat.valueMax);
			}
        },
		
		updateHeatRegeneration: function() {
			var self = this;
			var heat = this.heat;
			
			var currTime = ig.UIWorldTime.timeInHours;
			var morningTime = ig.UIWorldTime.THRESHOLDS.MORNING;
			var dayTime = ig.UIWorldTime.THRESHOLDS.DAY;
			var sunsetTime = ig.UIWorldTime.THRESHOLDS.SUNSET;
			var nightTime = ig.UIWorldTime.THRESHOLDS.NIGHT;
			if (currTime >= morningTime && currTime <= dayTime) {
				var ratio = (currTime - morningTime + 1) / (dayTime - morningTime + 1);
				heat.adjustedAmbientRegenRate = heat.baseAmbientRegenRate * ratio;
			} else if (currTime >= sunsetTime && currTime <= nightTime) {
				var ratio = (currTime - sunsetTime + 1) / (nightTime - sunsetTime + 1);
				heat.adjustedAmbientRegenRate = -heat.baseAmbientRegenRate * ratio;
			}
			
			var matchBy = function(entity) {
				if (entity instanceof ig.Character) {
					var heat = entity.getComponent('heat');
					return heat && entity.distanceSquaredTo(self) <= Math.pow(heat.adjustedRadius, 2);
				}
				return false;
			};
					
			var selectedEntities = ig.game.getEntitiesMatching(matchBy, {
				layerName: 'entities',
				distanceSquared: 1000000,
				from: this
			});

			if (selectedEntities.length) {
				var sortedEntities = selectedEntities.sort(function(a, b) {
					var t1 = a.getComponent('heat').regenModifier, t2 = b.getComponent('heat').regenModifier;
					if (t1 < t2) return 1;
					if (t1 > t2) return -1;
					return 0;
				});
				
				var selectedEntity = selectedEntities[0];
				
				var h = selectedEntity.getComponent('heat');
				this.heat.adjustedRegenRate = heat.baseRegenRate * h.regenModifier;
			} else {
				this.heat.adjustedRegenRate = heat.adjustedAmbientRegenRate;
			}
			
			//console.log("Your adjusted heat regen rate: "+this.heat.adjustedRegenRate);
		},
		
        regenerate: function() {
			this.parent();
			
			this.updateHeatRegeneration();
			
			this.receiveHunger(this.hunger.regenRate, this);
            this.receiveHeat(this.heat.adjustedRegenRate, this);
        },
		
		attack: function(creature) {
			/*
			if(!entity.killed && this.attackTimer.delta() >= 0) {
				this.attackTimer.set(this.attackDelay);
				
				entity.receiveDamage(this.attackDamage, this, true);
			}
			this.moveToStop();*/
			
            if(creature) {
				var weaponData = this.equipment.getWeaponData();
                if (weaponData.melee) {
                    ig.combat.attack(creature, this, "melee", weaponData.melee.damage); // TODO: Replace 0 with weapon range
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
			var toolData = this.equipment.getWeaponData()['tool'];
			
		    if(resource) {
				if (!resource.requiredTool || (toolData && toolData.type === resource.requiredTool)) {
					var dmg = toolData && toolData.damage ? toolData.damage : 5;
					resource.onHarvest(dmg);
				} else {
					ig.log("Invalid tool equipped for this resource!");
				}
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
				var use = item.getComponent('use');
				if (use) {
					switch(use) {
						case "equip":
							this.switchContainer(slot, this.inventory, this.equipment);
							this.equipment.logInfo();
							break;
						case "build":
							this.changeInterfaceState(this.STATE_BUILDING);
							this.buildEntity = _b.getFlatpackType(item);
							this.buildSlot = slot;
							break;
						case "eat":
							inv.depleteSlot(slot, 1);
							this.receiveHealing(item.getComponent('eat').healingValue, this);
							this.receiveHunger(item.getComponent('eat').hungerValue, this);
							this.inventory.logInfo();
							break;
						default:
							return;
					}
				}
			}
		},
		
		useSelected: function() {
			this.use(this.inventory.getSelectedSlot());
		},

		transfer: function(slot, entities) {
			var inv = this.inventory;
			var item = inv.getSlot(slot);
			if (entities.length && item) {
				var transfer = item.getComponent('transfer');
				for(var i = 0, il = entities.length; i < il; i++) {
					var entityTransfer = entities[i].getComponent('transfer');
					if (transfer && entityTransfer) {
						if (entityTransfer === "fire" && transfer.fire) {
							var fireTransfer = transfer.fire.fireTransfer;
							switch(fireTransfer) {
								case "cook":
									inv.depleteSlot(slot, 1);
									var name = transfer.fire.cook.resultName;
									if(!this.inventory.isFull()) {
										var n2i = _i.n2i(name);
										inv.addItem(n2i);
									} else {
										var n2g = _i.n2g(name);
										ig.game.spawnEntity(n2g, this.pos.x, this.pos.y);
									}
									return;
								case "fuel":
									inv.depleteSlot(slot, 1);
									var amount = transfer.fire.fuel.healing;
									entities[i].receiveFireHealing(amount, this);
									return;
							}
						}
					}
				}
			}
		},
		
		transferSelected: function(entities) {
			this.transfer(this.inventory.getSelectedSlot(), entities);
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
						if(targetAppendage.text !== text)
							this.ui.targetAppendage.text = text;
							
						if(!targetAppendage.visible)
							this.ui.targetAppendage.visible = true;
						
						this.ui.targetAppendage.moveTo({x: inputTarget.x, y: inputTarget.y}, {
							offsetPct: {x: -1.5, y: -5}
						});
					} else {
						if(targetAppendage.visible)
							this.ui.targetAppendage.visible = false;
					}
			
					// inventory selected slot interaction
					if (ig.input.pressed('inv_interact_1')) {
						this.useSelected();
					} else if(ig.input.pressed('inv_interact_2')) {
						this.inventory.dropSelectedSlot(this.pos.x, this.pos.y);
						this.inventory.logInfo();
					} else if (ig.input.pressed('inv_interact_3')) {
						var entities = _uti.entitiesInAABB(self.pos.x, self.pos.y,
														 self.pos.x + self.size.x, self.pos.y + self.size.y,
														 true, 'entities', false);
						this.transferSelected(entities);
						this.inventory.logInfo();
					}
				
					// move selected inventory slot
					if (ig.input.pressed('inv_left')) {
						this.inventory.moveSelectedSlot(3);
						this.inventory.logInfo();
					} else if (ig.input.pressed('inv_right')) {
						this.inventory.moveSelectedSlot(1);
						this.inventory.logInfo();
					}
					if (ig.input.pressed('inv_up')) {
						this.inventory.moveSelectedSlot(0);
						this.inventory.logInfo();
					} else if (ig.input.pressed('inv_down')) {
						this.inventory.moveSelectedSlot(2);
						this.inventory.logInfo();
					}
				
					// outside interaction handling
					if (ig.input.pressed('interact_1')) {
						var entity = _uti.entitiesInAABB(self.pos.x, self.pos.y,
														 self.pos.x + self.size.x, self.pos.y + self.size.y,
														 true, 'entities', false)[1];
							
						if(entity) {
							if (entity instanceof ig.GroundItem) {
								self.loot(entity);
							}
								/*
								case ig.EntityExtended.TYPE.STATION:
									this.changeInterfaceState(this.STATE_CRAFTING);
									break;*/
						}
					} else if(ig.input.state('interact_1')) {
						var entity = _uti.entitiesInAABB(self.pos.x, self.pos.y,
														self.pos.x + self.size.x, self.pos.y + self.size.y,
														true, 'entities', false)[1];
							
						if(entity) {
							switch(entity.type) {
								case ig.EntityExtended.TYPE.RESOURCE:
									this.harvest(entity);
									break;
							}
						} else {
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
									entity = _uti.entitiesInAABB(left, top, right, bottom, true,  'entities', false)[1];
									if (entity) {
										switch(entity.type) {
											case ig.EntityExtended.TYPE.CREATURE: // TODO: Figure out ig.EntityExtended.TYPE.CREATURE
												this.attack(entity);
												break;
										}
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
