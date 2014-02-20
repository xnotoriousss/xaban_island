ig.module('game.abstractities.creature')

.requires(
    'plusplus.abstractities.creature',
	'game.ui.ui-world-time',
	'game.core.group',
	'game.core.creatures'
)
    
.defines(function () {
    "use strict";
	var _ut = ig.utils;
	var _i = ig.items;
	
    ig.Creature.inject({
		displayName: "Unknown Creature",
		displayNameLeader: null,
		
		collides: ig.EntityExtended.COLLIDES.PASSIVE,
		performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
		canRetaliate: true,
		explodingDamage: true,
		
		gender: '',
		leader: false,
		social: true,
		groupIndex: -1,
		memberIndex: -1,
		findGroupDelay: 1,
		setPreyDelay: 1,
		findGroupTimer: null,
		setPreyTimer: null,
		
		
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
	
		wanders: true,
		sleeping: false,
		sleepDelay: 20,
		sleepTimer: null,
		sleeps: true,
		nocturnal: false,
		
		initTypes: function () {
            
            _ut.addType( ig.EntityExtended, this, 'type', "CREATURE" );

        },
		initProperties: function() {
			this.parent();
			if(!this.displayNameLeader)this.displayNameLeader = "Alpha "+this.displayName;
			
			var gender = Math.floor(Math.random()*2);
			if(gender == 0){
				this.gender = 'male';
			}else{
				this.gender = 'female';
			}
			this.attackTimer = new ig.Timer();
			this.sleepTimer = new ig.Timer();
			this.findGroupTimer = new ig.Timer();
			this.setPreyTimer = new ig.Timer();
			//does it auto set?
			/*
			this.findGroupTimer.set(this.findGroupDelay);
			this.setPreyTimer.set(this.setPreyDelay);
			*/
		},
		
		pause: function() {
			this.parent();
			
			this.attackTimer.pause();
			this.sleepTimer.pause();
		},		
		unpause: function() {
			this.parent();
			
			this.attackTimer.unpause();
			this.sleepTimer.unpause();
		},
		
		updateChanges: function(){
			if(this.canWanderX || this.canWanderY) this.wanders = true;
			if(!this.sleeping){
				this.parent();
				this.updateTamer();
				this.updateSocial();
			}
			this.updateSleep();
			 
		},		
		updateSleep: function(){
			if(this.sleeps){ //if this creature sleeps
				var currTime = ig.UIWorldTime.timeInHours;
				var morningTime = ig.UIWorldTime.THRESHOLDS.MORNING;
				var dayTime = ig.UIWorldTime.THRESHOLDS.DAY;
				var sunsetTime = ig.UIWorldTime.THRESHOLDS.SUNSET;
				var nightTime = ig.UIWorldTime.THRESHOLDS.NIGHT;
				if(!this.nocturnal){ //and is not nocturnal
					if(!this.sleeping){  //and is not sleeping
						if(currTime>= 0 && currTime <= morningTime || currTime >= nightTime && currTime <= 24){
							if(this.sleepTimer.delta() >= 0){ //and it's night time
								this.receiveSleep();
							}
						}else{
							
						}
					}else{ //if it's not sleeping and it's not nocturnal
						if(currTime <= nightTime && currTime >= morningTime){
							this.receiveWake();
						}
					}
					
				}else{ //if it is nocturnal
					if(!this.sleeping){  //and is not sleeping
						if(currTime<= nightTime && currTime >= morningTime){
							if(this.sleepTimer.delta() >= 0){ //and it's morning time
								this.receiveSleep();
							}
						}else{
							
						}
					}else{ //if it's not sleeping and it's nocturnal
						if(currTime>= 0 && currTime <= morningTime || currTime >= nightTime && currTime <= 24){ // and its night
							this.receiveWake();
						}
					}
				}
			}
		},		
		updateSocial: function(){
			if(this.social && !this.tamer){
				if(this.leader)this.displayName = this.displayNameLeader;
				if(this.groupIndex!= -1){
					if(!this.leader){//if is in a group and not the leader then
						if(ig.Group.group[this.groupIndex].leader){// follow leader
							if(this.findGroupTimer.delta()>=0){ //kwik fix
								
								this.findGroupTimer.set(this.findGroupDelay);
								this.entityTether = ig.Group.group[this.groupIndex].leader;
								this.canBreakTether = true;
								this.tetherDistance = 100;
								this.canWanderX = true;
								this.canWanderY = true;
							}
						}else{ // determine leader
							this.entityTether = null;
							this.canWanderX = true;
							this.canWanderY = true;
							//TODO: determine leader
						}
					}else {
						
					}
					if(this.setPreyTimer.delta() >= 0 ){
						if(!this.prey && ig.Group.group[this.groupIndex].target)this.prey = ig.Group.group[this.groupIndex].target;
						this.setPreyTimer.set(this.setPreyDelay);
					}
				}else{
					//find group
					if(this.findGroupTimer.delta() >= 0){
						this.findGroupTimer.set(this.findGroupDelay);
						var matchBy = function(entity) {
							if (entity instanceof ig.Creature) {
								return entity;
							}
							return false;
						};
						var entities = ig.game.getEntitiesMatching(matchBy, {
							layerName: 'entities',
							distanceSquared: this.reactionDistance * this.reactionDistance,
							from: this
						});
						var entity;
						for (var i = 0; i < entities.length; i++) {
							if (entities[i].leader == true) {
								if(!ig.Group.group[entities[i].groupIndex].family || ig.Group.group[entities[i].groupIndex].family === ig.Creatures.getCreatureFamily(this)){
									ig.log('I made it.');
									entity = entities[i];
									ig.log(entity.displayName);
									if(entity.groupIndex!=-1){
										this.memberIndex = ig.Group.addMember(this, entity.groupIndex);
										if(this.memberIndex!= -1){
											this.groupIndex = entity.groupIndex;
											ig.log(this.displayName + " was added to " + entity.displayName + "'s group. (" + entity.groupIndex + ").");
										}else{
											ig.log(this.displayName + " not added.");
										}
									}
								}
							}
						}
						if(!entity){
							this.groupIndex = ig.Group.createGroup(this, ig.Creatures.getCreatureFamily(this));
						}
					}
				}
			}
		},		
        updatePrey: function () {
            var prey = this.prey;
            if( prey && !this.managed ) {
                this.sleepTimer.set(this.sleepDelay);
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
				this.findTamer();
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
		
		findTamer: function(force) {
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
		
		receiveWake: function(){
			if(this.sleeping){
				this.sleeping = false;
				if(this.wanders){
					this.canWanderX = true;
					this.canWanderY = true;
				}
			}			
		},
		receiveSleep: function(force){
			if(force || this.sleeps){
				this.moveAllStop();
				this.sleeping = true;
				
				if(this.wanders){
					this.canWanderX = false;
					this.canWanderY = false;
				}
			}			
		},
		receiveTame: function(from){
			ig.log('receive tame');
			if(this.tameable){
				this.tamer = from;
				this.canBreakTether = true;
				this.entityTether = this.tamer;
			}else{
				ig.log('untameable');
			}
			
		},
		receiveDamage : function( amount, from, unblockable ) {

            var res = this.parent(amount, from, unblockable);

            if ( from && !this._killed ) {
				if(this.sleeping)this.receiveWake();
				
				
				if(this.groupIndex != -1 && !ig.Group.group[this.groupIndex].target){
					ig.Group.group[this.groupIndex].target = from;
				}
				
                if ( this.canRetaliate && !this.fleeing && amount > 0) {
					
                    this.prey = from;

                }

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



