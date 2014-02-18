ig.module('game.abstractities.creature')

.requires(
    'plusplus.abstractities.creature',
	
	'game.items.items'
)
    
.defines(function () {
    "use strict";
	var _ut = ig.utils;
	var _i = ig.items;

    ig.Creature.inject({
		collides: ig.EntityExtended.COLLIDES.LITE,
		canRetaliate: true,
		
		attackDamage: 20,
		attackDelay: 1,
		attackTimer: null,
		
		droppedItems: [],
		
		initTypes: function () {
            _ut.addType( ig.EntityExtended, this, 'type', "CREATURE" );
        },
		
		initProperties: function() {
			this.parent();
			
			this.attackTimer = new ig.Timer();
		},
		
		pause: function() {
			this.parent();
			
			this.attackTimer.pause();
		},
		
		unpause: function() {
			this.parent();
			
			this.attackTimer.unpause();
		},
		
        updatePrey: function () {
            var prey = this.prey;
            if( prey && !this.managed ) {
                
                if ( prey._killed || ( prey.hidden && !this.detectHiddenPrey ) || this.distanceSquaredTo( prey ) > this.reactionDistance * this.reactionDistance ) {
                    
                    return this.removePrey();
                    
                }
                else if ( !this.fleeing && !this.fleeingLowHealth ) {

                    // get closer and attack when not fleeing and not in survival mode

                    this.attacking = this.closeDistance( prey );

                    if ( this.attacking ) {

                        this.attack(prey);
						

                    }
                    else {

                        this.moveTo( prey, this.moveToPreySettings );

                    }

                }

            }

        },
		
		receiveDamage : function( amount, from, unblockable ) {

            var res = this.parent(amount, from, unblockable);

            if ( from && !this._killed ) {

                // learn about new predators that are not prey

                if ( this.canRetaliate && !this.fleeing) {

                    this.prey = from;

                }

                // health is below flee percent
                // force from entity as predator

                if ( this.predatorFromDamage && this.health < this.healthMax * this.fleeHealthPct ) {

                    this.fleeing = this.fleeingLowHealth = true;
                    this.predator = from;

                }

            }

            return res;

        },
        closeDistance: function ( entity ) {

            var distanceMax = Math.max( this.size.x * 0.25, this.size.y * 0.25, ig.game.collisionMap && ig.game.collisionMap.tilesize || 0 );
			
            return this.distanceSquaredEdgeTo( entity ) <= distanceMax * distanceMax;

        },
        
        attack: function(entity) {
			if(!entity.killed && this.attackTimer.delta() >= 0) {
				this.attackTimer.set(this.attackDelay);
				
				entity.receiveDamage(this.attackDamage, this, true);
			}
			this.moveToStop();
		},
		
		dropItems: function() {
			var i, il, j, jl,
				n2g,
				droppedItem, quantityMax, quantity,
				pos = this.pos,
				size = this.size;
				
			var droppedItems = this.droppedItems;
				
			for(i = 0, il = droppedItems.length; i < il; i++) {
				droppedItem = droppedItems[i];
				quantity = droppedItem.quantityMin + Math.floor(Math.random() * ((droppedItem.quantityMax - droppedItem.quantityMin) + 1));
				for(j = 0, jl = quantity; j < jl; j++) {
					n2g = _i.n2g(droppedItem.name);
					ig.game.spawnEntity(n2g, pos.x + Math.random() * size.x - n2g.size.x * 0.5, pos.y + Math.random() * size.y - n2g.size.y * 0.5);
				}
			}
		},
		
		kill: function(silent) {
			if (!silent)
				this.dropItems();
			
			this.parent(silent);
		}
    });
});



