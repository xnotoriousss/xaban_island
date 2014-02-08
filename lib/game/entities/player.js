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
	'game.items.crafting'
)

.defines(function(){ "use strict";
		 
	var _c = ig.CONFIG;
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
    
		hasWeapon: function() {
			return false;
		},
		
		handleInput: function() {
		    this.parent();
			
		    var self = this;
			
			var mousePoint = ig.input.inputPoints[0];
			
			var logInv = false;
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
			
			if (ig.input.released('interact_1')) {

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
