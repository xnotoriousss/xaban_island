ig.module('game.entities.sabertooth')
.requires(
    'plusplus.core.config',
    'plusplus.abstractities.character',
    'plusplus.helpers.utils',
    'plusplus.helpers.pathfinding'
)
.defines(function(){ 
    "use strict";

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _pf = ig.pathfinding;
	
    ig.EntitySabertooth = ig.global.EntitySabertooth = ig.Creature.extend(/**@lends ig.Creature.prototype */{
        
		size: {x: 24, y: 40},
		offset: {x: 22, y: 14},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/sabertooth.png', 64, 64),
		
		animInit: "idleX",
		
		animSettings: {
			idleX: {
				frameTime: 0.5,
				sequence: [0]
			},
			idleUp: {
				frameTime: 0.5,
				sequence: [0]
			},
			idleDown: {
				frameTime: 0.5,
				sequence: [0]
			},
			moveX: {
				frameTime: 0.07,
				sequence: [0]
			},
			moveDown: {
				frameTime: 0.07,
				sequence: [0]
			},
			moveUp: {
				frameTime: 0.07,
				sequence: [0]
			},
		},
		
        /**
         * Creature is dynamic.
         * @override
         * @default dynamic
         */  
        performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,

        /**
         * Creature collides lite.
         * @override
         * @default lite
         */
        collides: ig.EntityExtended.COLLIDES.LITE,
        //reactionDistance: _c.CREATURE.REACTION_DISTANCE,
        //reactionDelay: _c.CREATURE.REACTION_DELAY,
        //reactionTimer: null,
        //preyName: '',

        /**
         * Entity class that this creature will prey on, i.e. creature will attack them.
         * <br>- priority 2 in finding prey, overrides type and group but overriden by name.
         * @type String|ig.EntityExtended
         * @default
         */
        preyClass: player, //never ask craig anything about javascript. ever
        //preyType: ig.EntityExtended.TYPE.NONE,
        //preyGroup: ig.EntityExtended.GROUP.NONE,
        //prey: null,

        /**
         * Whether needs line of sight for prey.
         * @type Boolean
         * @default
         * @see ig.CONFIG.CREATURE.NEEDS_LINE_OF_SIGHT_PREY
         */
        needsLineOfSightPrey: true,
        //detectHiddenPrey: _c.CREATURE.DETECT_HIDDEN_PREY,
        //moveToPreySettings: _c.CREATURE.MOVE_TO_PREY_SETTINGS,

        
        //predatorName: '',
        //predatorClass: null,
        //predatorType: ig.EntityExtended.TYPE.NONE,
        //predatorGroup: ig.EntityExtended.GROUP.NONE,
        //predatorFromDamage: _c.CREATURE.PREDATOR_FROM_DAMAGE,
        //canLearnPredators: _c.CREATURE.CAN_LEARN_PREDATORS,

        //predator: null,
        //needsLineOfSightPredator: _c.CREATURE.NEEDS_LINE_OF_SIGHT_PREDATOR,
        //detectHiddenPredator: _c.CREATURE.DETECT_HIDDEN_PREDATOR,
        //moveToPredatorSettings: _c.CREATURE.MOVE_TO_PREDATOR_SETTINGS,

        /**
         * Whether creature can flee.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_FLEE
         */
        canFlee: true,

        /**
         * Percentage of health, between 0 and 1, when creature begins to flee.
         * @type Number
         * @see ig.CONFIG.CREATURE.FLEE_HEALTH_PCT
         */
        fleeHealthPct: 10,

        /**
         * Whether creature is currently fleeing.
         * <span class="alert alert-info"><strong>Tip:</strong> creature can start with flee mode on.</span>
         * @type Boolean
         * @default
         * @readonly
         */
        fleeing: false,

        /**
         * Whether creature is currently fleeing due to low health.
         * @type Boolean
         * @default
         * @readonly
         */
        fleeingLowHealth: false,

        /**
         * Distance creature can move around its tether.
         * <span class="alert alert-info"><strong>Tip:</strong> a spawned creature will use its spawner as a tether, unless {@link ig.Creature#tetherName} is set and matches a valid entity in the game.</span>
         * @type Number
         * @see ig.CONFIG.CREATURE.TETHER_DISTANCE
         * @example
         * // a creature can have a tether by:
         * // 1. it was spawned by a spawner
         * // 2. it has a tether name that matches a entity
         * // otherwise, tethering will be skipped
         * // when tether distance is <= 0
         * // a creature can go as far as it wants
         * myCreature.tetherDistance = 0;
         * // when tether distance is > 0
         * // a creature will only go up to that distance
         * myCreature.tetherDistance = 100;
         * // unless it can break its tether
         * // to follow prey or flee from a predator
         * myCreature.canBreakTether = true;
         */
        tetherDistance: 0,
        //canBreakTether: true,
        //tetherName: '',
        //tetherToSpawner: _c.CREATURE.TETHER_TO_SPAWNER,
        //tethering: false,
        //entityTether: null,
        //moveToTetherSettings: _c.CREATURE.MOVE_TO_TETHER_SETTINGS,

        /**
         * Whether creature can wander, set automatically during update based on current status.
         * @type Boolean
         * @readonly
         */
        canWander: true,

        canWanderX: true,
        canWanderY: true,

        /**
         * Chance as a percent between 0 and 1 that direction will switch while wandering.
         * <span class="alert alert-info"><strong>Tip:</strong> setting this above 0.005 will cause creature to switch direction often and this can look rather stupid!</span>
         * @type Number
         * @see ig.CONFIG.CREATURE.WANDER_SWITCH_CHANCE
         */
        wanderSwitchChance: .25,
        //wanderSwitchChanceStopped: _c.CREATURE.WANDER_SWITCH_CHANCE_STOPPED,

        /**
         * Whether creature is currently wandering.
         * @type Boolean
         * @default
         * @readonly
         */
        wandering: false,

        /**
         * Direction of wander movement.
         * @type Vector2|Object
         * @default
         * @readonly
         */
        wanderDirection: { x: 0, y: 0 },

        /**
         * Target position of random movement.
         * @type Vector2|Object
         * @default
         * @readonly
         */
        wanderPos: { x: 0, y: 0 },

        /**
         * Settings for random move. For options, see {@link ig.Character#moveTo}.
         * @type Object
         * @default
         */
        moveToWanderSettings: _c.CREATURE.MOVE_TO_WANDER_SETTINGS,

        // internal properties, do not modify

        _preySearchSettings: {},
        _predatorSearchSettings: {},

        /**
         * @override
         **/
        initTypes: function () {
            
            this.parent();
            
            _ut.addType( ig.EntityExtended, this, 'type', "CREATURE" );

        },

        /**
         * @override
         **/
        initProperties: function () {

            this.parent();

            this.reactionTimer = new ig.Timer();

        },

		/**
		 * @override
		 **/
		resetCore: function (x, y, settings) {
			
			if ( settings && !ig.global.wm ) {
				
				if ( settings.preyType ) {
					
					_ut.addType(ig.EntityExtended, this, 'preyType', settings.preyType);
					delete settings.preyType;
					
				}

				if ( settings.preyGroup ) {

					_ut.addType(ig.EntityExtended, this, 'preyGroup', settings.preyGroup, "GROUP");
					delete settings.preyGroup;

				}

                if ( settings.predatorType ) {

                    _ut.addType(ig.EntityExtended, this, 'predatorType', settings.predatorType);
                    delete settings.predatorType;

                }
				
				if ( settings.predatorGroup ) {
					
					_ut.addType(ig.EntityExtended, this, 'predatorGroup', settings.predatorGroup, "GROUP");
					delete settings.predatorGroup;
					
				}
				
			}

			this.parent(x, y, settings);

		},

		/**
		 * @override
		 **/
		resetExtras: function () {
			
			// check wander
			
			if ( this.canWanderX ) {
				
				this.wanderDirection.x = Math.random() < 0.5 ? -1 : 1;
				
			}
			else {
				
				this.wanderDirection.x = 0;
				
			}
			
			if ( this.canWanderY ) {
				
				this.wanderDirection.y = Math.random() < 0.5 ? -1 : 1;
				
			}
			else {
				
				this.wanderDirection.y = 0;
				
			}

            // set prey/predator search settings

            var preySearchSettings = this._preySearchSettings;
            var predatorSearchSettings = this._preySearchSettings;

            preySearchSettings.from = predatorSearchSettings.from = this;
            preySearchSettings.layerName = predatorSearchSettings.layerName = this.layerName;
            preySearchSettings.byDistance = predatorSearchSettings.byDistance = true;
            preySearchSettings.distanceSquared = predatorSearchSettings.distanceSquared = this.reactionDistance * this.reactionDistance;

            preySearchSettings.lineOfSight = this.needsLineOfSightPrey;
            predatorSearchSettings.lineOfSight = this.needsLineOfSightPredator;
            preySearchSettings.nonHidden = this.detectHiddenPrey;
            predatorSearchSettings.nonHidden = this.detectHiddenPredator;

			this.parent();

		},

        /**
         * @override
         */
        spawn: function () {

            // get tether

            if ( this.tetherDistance > 0 && !this.entityTether ) {

                // try by name

                if ( this.tetherName ) {

                    this.entityTether = ig.game.getEntityByName( this.tetherName );

                }

                // try spawner

                if ( !this.entityTether && this.tetherToSpawner ) {

                    this.entityTether = this.spawner;

                }

            }

            this.parent();

        },

        /**
         * @override
         **/
        pause: function () {

            this.parent();

            this.reactionTimer.pause();

        },

        /**
         * @override
         **/
        unpause: function () {

            this.parent();

            this.reactionTimer.unpause();

        },

        /**
         * Finds and sets the closest predator and prey.
         * @param {Boolean} [force=false] whether to get new
        */
        findPredatorPrey: function ( force ) {

            if ( this.tethering && !this.canBreakTether ) {

                return;

            }

            // only find a new target if we don't have one

            if ( force || !this.prey ) {

                if ( this.preyName ) {

                    var prey = ig.game.getEntityByName( this.preyName );

                    if ( prey && !prey._killed
                        && ( this.detectHiddenPrey || !prey.hidden )
                        && this.distanceSquaredTo( prey ) <= this.reactionDistance * this.reactionDistance
                        && ( !this.needsLineOfSightPrey || this.lineOfSight( prey ) ) ) {

                        this.prey = prey;

                    }

                }
                else if ( this.preyClass ) {

                    this.prey = ig.game.getEntitiesByClass( this.preyClass, this._preySearchSettings )[ 0 ];

                }
                else if ( this.preyType ) {

                    this.prey = ig.game.getEntitiesByType( this.preyType, this._preySearchSettings )[ 0 ];

                }
                else if ( this.preyGroup ) {

                    this.prey = ig.game.getCharactersByGroup( this.preyGroup, this._preySearchSettings )[0];

                }

            }

            if ( force || !this.predator ) {

                if ( this.predatorName ) {

                    var predator = ig.game.getEntityByName( this.predatorName );

                    if ( predator && !predator._killed
                        && ( this.detectHiddenPredator || !predator.hidden )
                        && this.distanceSquaredTo( predator ) <= this.reactionDistance * this.reactionDistance
                        && ( !this.needsLineOfSightPredator || this.lineOfSight( predator ) ) ) {

                        this.predator = predator;

                    }

                }
                else if ( this.predatorClass ) {

                    this.predator = ig.game.getEntitiesByClass( this.predatorClass, this._predatorSearchSettings )[ 0 ];

                }
                else if ( this.predatorType ) {

                    this.predator = ig.game.getEntitiesByType( this.predatorType, this._predatorSearchSettings )[ 0 ];

                }
                else if ( this.predatorGroup ) {

                    this.predator = ig.game.getCharactersByGroup( this.predatorGroup, this._predatorSearchSettings )[0];

                }

            }

        },

        /**
         * Removes prey as target.
         */
        removePrey: function () {

            if ( this.prey ) {

                var prey = this.prey;
                this.prey = null;

                this.moveToStop();

                this.abilities.forAllDescendants( function () {

                    if ( this.entityTarget === prey ) {

                        this.deactivate();

                    }

                } );

            }

        },

        /**
         * Removes predator as target.
         */
        removePredator: function () {

            if ( this.predator ) {

                var predator = this.predator;
                this.predator = null;

                this.fleeing = this.fleeingLowHealth = false;

                this.moveToStop();

                this.abilities.forAllDescendants( function () {

                    if ( this.entityTarget === predator ) {

                        this.deactivate();

                    }

                } );

            }

        },

        /**
         * Removes prey as target and clears all prey targeting methods, effectively disabling the creature from finding prey.
         */
        clearPrey: function () {

            this.preyName = "";
            this.preyClass = null;
            this.preyType = ig.EntityExtended.TYPE.NONE;
            this.preyGroup = ig.EntityExtended.GROUP.NONE;

            this.removePrey();

        },

        /**
         * Removes predator as target and clears all predator targeting methods, effectively disabling the creature from finding predators.
         */
        clearPredator: function () {

            this.predatorName = "";
            this.predatorClass = null;
            this.predatorType = ig.EntityExtended.TYPE.NONE;
            this.predatorGroup = ig.EntityExtended.GROUP.NONE;

            this.removePredator();

        },

        /**
         * Attacks a target (does nothing except a simple distance check by default).
         * <span class="alert"><strong>IMPORTANT:</strong> override this with a class specific method!</span>
         * @param {ig.EntityExtended} entity target entity to attack
         * @returns {Boolean} whether creature is close enough to attack target
         */
        attack: function ( entity ) {

            var distanceMax = Math.max( this.size.x * 0.25, this.size.y * 0.25, ig.game.collisionMap && ig.game.collisionMap.tilesize || 0 );

            return this.distanceSquaredEdgeTo( entity ) <= distanceMax * distanceMax;

        },

        /**
         * Flees from a target.
         * @param {ig.EntityExtended} target target entity to flee from
         * @param {Object} settings settings for move
         * @returns {Boolean} whether creature started fleeing (not if is fleeing)
         */
        flee: function ( entity, settings ) {

            this.fleeing = true;

            return this.moveFrom( entity, settings );

        },

        /**
         * Damages creature.
         * <br>- if {@link ig.Creature#canLearnPredators}, adds the from entity's group to creature's predator group.
         * <br>- if {@link ig.Creature#health} is below {@link ig.Creature#fleeHealthPct}, will force damaging entity as predator and flee.
         * @override
         **/
        receiveDamage : function( amount, from, unblockable ) {

            var res = this.parent(amount, from, unblockable);

            if ( from && !this._killed ) {

                // learn about new predators that are not prey

                if ( this.canLearnPredators ) {

                    this.predatorType |= from.type;
                    this.predatorGroup |= from.group;

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

        /**
         * Heals creature.
         * <br>- if {@link ig.Creature#health} is above {@link ig.Creature#fleeHealthPct}, will drop predator and stop fleeing.
         * @override
         **/
        receiveHealing: function (amount, from) {

            this.parent( amount, from );

            // health above flee amount and has a predator
            // when predator is in prey group or not in predator group

            if ( this.fleeing && this.health >= this.healthMax * this.fleeHealthPct ) {

                this.removePredator();

            }

        },

        /**
         * @override
         */
        cleanup: function () {

            this.removePrey();
            this.removePredator();
            this.tethering = this.wandering = this.fleeing = this.fleeingLowHealth = false;

            this.parent();

        },

        /**
         * Checks closest targets and reacts accordingly.
         * @override
         **/
        updateChanges: function () {

            this.parent();

            // get closest target

            if ( this.reactionTimer.delta() >= 0 ) {

                this.reactionTimer.set( this.reactionDelay );

                this.findPredatorPrey();

            }

            // handle targets

            this.updatePrey();
            this.updatePredator();

            this.updateTether();
            this.updateWander();

        },

        /**
         * Checks prey and reacts to it by moving closer and attacking.
         */
        updatePrey: function () {

            var prey = this.prey;

            if( prey && !this.managed ) {

                if ( prey._killed || ( prey.hidden && !this.detectHiddenPrey ) || this.distanceSquaredTo( prey ) > this.reactionDistance * this.reactionDistance ) {

                    return this.removePrey();
                    
                }
                else if ( !this.fleeing && !this.fleeingLowHealth ) {

                    // get closer and attack when not fleeing and not in survival mode

                    this.attacking = this.attack( prey );

                    if ( this.attacking ) {

                        this.moveToStop();

                    }
                    else {

                        this.moveTo( prey, this.moveToPreySettings );

                    }

                }

            }

        },

        /**
         * Checks predator and reacts to it.
         */
        updatePredator: function () {

            var predator = this.predator;

            if( predator && !this.managed ) {

                if ( predator._killed || ( predator.hidden && !this.detectHiddenPredator ) || !this.fleeingLowHealth && this.distanceSquaredTo( predator ) > this.reactionDistance * this.reactionDistance ) {

                    return this.removePredator();

                }
                else if ( this.canFlee ) {

                    this.flee( predator, this.moveToPredatorSettings );

                }

            }

        },

        /**
         * Checks tether and moves back to it as necessary.
         */
        updateTether: function () {

            if ( this.tetherDistance > 0 && !this.managed ) {

                var tether = this.entityTether;

                if ( tether ) {

                    // tethering

                    if ( this.tethering ) {

                        var distanceSafe = Math.min( ig.pathfinding.tilesize, this.size.x, this.size.y );

                        if ( this.distanceSquaredEdgeTo( this.entityTether ) <= distanceSafe * distanceSafe ) {

                            this.tethering = false;
                            this.fleeing = this.fleeingLowHealth;

                            this.moveToStop();

                        }
                        else {

                            this.moveTo( tether, this.moveToTetherSettings );

                        }

                    }
                    else {

                        // has tether

                        if ( ( !this.canBreakTether || ( !this.prey && !this.predator ) )
                            && this.distanceSquaredEdgeTo( this.entityTether ) > this.tetherDistance * this.tetherDistance ) {

                            this.removePrey();
                            this.removePredator();

                            this.tethering = true;

                        }

                    }

                }

            }

        },

        /**
         * @returns {Boolean} whether creature can wander.
         */
        isSafeToWander: function () {

            return !this.tethering && !this.prey && !this.predator && !this.managed && !this.abilities.getUsing();

        },

        /**
         * Moves around randomly.
         */
        updateWander: function () {

            if ( ( this.canWanderX || this.canWanderY ) && this.isSafeToWander() ) {

                this.wandering = true;

                var wanderSwitchChance = this.wanderDirection.x === 0 && this.wanderDirection.y === 0 ? this.wanderSwitchChanceStopped : this.wanderSwitchChance;
					
				// moved to an unsafe location
				// wander should switch
				
				if ( this.moveToUnsafe ) {
					
					this._wanderSwitchedHorizontal = false;
					
					if ( this.canWanderX && ( !this.canWanderY || Math.random() < 0.5 ) ) {
						
						this._wanderSwitchedHorizontal = true;
						this.wanderDirection.x = -this.wanderDirection.x || 1;
						
					}
					
					if ( this.canWanderY && ( !this._wanderSwitchedHorizontal || Math.random() < 0.5 ) ) {
						
						this.wanderDirection.y = -this.wanderDirection.y || 1;
						
					}

				}
				// random switch chance
				else if ( wanderSwitchChance > 0 && Math.random() < wanderSwitchChance ) {
					
					var ran = Math.random();
					
					if ( this.canWanderX && ran > 0.5 ) {
						
						this.wanderDirection.x = Math.round( ran * 2 - 1 );
						
					}
					else if ( this.canWanderY ) {
						
						this.wanderDirection.y = Math.round( ran * 2 - 1 );
						
					}

				}
				// switch when at max tether distance
				else if ( this.tetherDistance > 0 && this.entityTether ) {
					
					if ( this.canWanderX ) {
						
						var tetherCenterX = this.entityTether.pos.x + this.entityTether.size.x * 0.5;

						if ( tetherCenterX - this.tetherDistance >= this.pos.x ) {

							this.wanderDirection.x = 1;

						}
						else if ( tetherCenterX + this.tetherDistance <= this.pos.x + this.size.x ) {

							this.wanderDirection.x = -1;

						}
						
					}
					
					if ( this.canWanderY ) {
						
						var tetherCenterY = this.entityTether.pos.y + this.entityTether.size.y * 0.5;

						if ( tetherCenterY - this.tetherDistance >= this.pos.y ) {

							this.wanderDirection.y = 1;

						}
						else if ( tetherCenterY + this.tetherDistance <= this.pos.y + this.size.y ) {

							this.wanderDirection.y = -1;

						}
						
					}

				}

                // no wander direction

                if ( this.wanderDirection.x === 0 && this.wanderDirection.y === 0 ) {

                    this.moveToStop();

                }
                // has direction
                else {

                    this.wanderPos.x = _pf.getEntityNeighborPositionX( this.pos.x, this.size.x, this.wanderDirection.x );
                    this.wanderPos.y = _pf.getEntityNeighborPositionY( this.pos.y, this.size.y, this.wanderDirection.y, !this.hasGravity );

                    if ( this.wanderDirection.x === 0 )

                        this.moveToHereHorizontal();{

                    }
					
					if ( this.wanderDirection.y === 0 ) {

                        this.moveToHereVertical();

                    }

                    this.moveTo( this.wanderPos, this.moveToWanderSettings );

                }

            }
            else {

                this.wandering = false;

            }

        }

    } );
});
