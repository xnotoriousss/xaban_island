ig.module('game.abstractities.creature')

.requires(
    'plusplus.abstractities.creature'
)
    
.defines(function () {
    "use strict";
	var _ut = ig.utils;
	var _i = ig.items;

    ig.Creature.inject({
		collides: ig.EntityExtended.COLLIDES.ACTIVE,
		performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
		canRetaliate: true,
		explodingDamage: true,
		
		attackDamage: 10,
		attackDelay: 1,
		attackTimer: null,
		
		droppedItems: [],
		
		tameable: false,
		tamerName: '',
        tamerClass: null,
        tamerType: ig.EntityExtended.TYPE.NONE,
        tamerGroup: ig.EntityExtended.GROUP.NONE,

		tamer: null,
		
		_tamerSearchSettings: {},
		
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
		receiveTame: function(from){
			ig.log('receive tame');
			if(this.tameable){
				this.tamer = from;
				this.canBreakTether = this;
				this.entityTether = this.tamer;
			}else{
				ig.log('untameable');
			}
			
		},
		updateChanges: function(){
			this.parent();
			this.updateTamer();
			
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
		updateTamer: function () {
            var tamer = this.tamer;
            if( tamer ) {
                if ( tamer._killed ) {
                    this.entityTether = null;
                    return this.removeTamer();
                    
                }else if(this.prey === tamer){
					this.prey = null;
					
                }else if (tamer.currentTarget && !tamer.currentTarget._killed && this.distanceSquaredTo(tamer.currentTarget) < this.tetherDistance * this.tetherDistance){
					if(!this.prey && tamer.currentTarget != this){
						this.prey = tamer.currentTarget;
						ig.log(this.prey.health);
					}
				}

            }else{
				this.getTamer();
			}

        },
		removeTamer: function () {

            if ( this.tamer ) {

                var tamer = this.tamer;
                this.tamer = null;

                this.moveToStop();

                this.abilities.forAllDescendants( function () {

                    if ( this.entityTarget === tamer ) {

                        this.deactivate();

                    }

                } );

            }

        },
		resetExtras: function () {

            var tamerSearchSettings = this._tamerSearchSettings;

            tamerSearchSettings.from =  this;
            tamerSearchSettings.layerName =  this.layerName;
            tamerSearchSettings.byDistance =  true;
            tamerSearchSettings.distanceSquared =  this.reactionDistance * this.reactionDistance;

            tamerSearchSettings.lineOfSight = false;
            tamerSearchSettings.nonHidden = true;

			this.parent();

		},
		getTamer: function(force) {
				if ( force || !this.tamer ) {
					if ( this.tamerName && !this.managed ) {
							var tamer = ig.game.getEntityByName( this.tamerName,this._tamerSearchSettings );
							if(tamer){
								
								this.tamer = tamer;
								this.canBreakTether = true;
								this.entityTether = tamer;
							}
					}
		
					else if ( this.tamerClass && !this.managed) {
							ig.log('tamerClass');
							var tamer = ig.game.getEntitiesByClass( this.tamerClass ,this._tamerSearchSettings)[ 0 ];
							if(tamer){ig.log('tamer');
								this.tamer = tamer;
								this.canBreakTether = true;
								this.entityTether = tamer;
							}
					}
					else if ( this.tamerType && !this.managed) {
							ig.log('tamerType');
							var tamer = ig.game.getEntitiesByType( this.tamerType ,this._tamerSearchSettings)[ 0 ];
							if(tamer){
								
								this.tamer = tamer;
								this.canBreakTether = true;
								this.entityTether = tamer;
							}
					}
					else if ( this.tamerGroup && !this.managed) {
							ig.log('tamerGroup');
							var tamer = ig.game.getCharactersByGroup( this.tamerGroup ,this._tamerSearchSettings)[0];
							if(tamer){
								ig.log('tamer');
								this.tamer = tamer;
								this.canBreakTether = true;
								this.entityTether = tamer;
							}
				}
				return tamer;
				
			}
	
		},
		receiveDamage : function( amount, from, unblockable ) {

            var res = this.parent(amount, from, unblockable);

            if ( from && !this._killed ) {

                // learn about new predators that are not prey

                if ( this.canRetaliate && !this.fleeing && amount > 0) {
					
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



