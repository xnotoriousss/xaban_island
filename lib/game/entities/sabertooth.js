ig.module('game.entities.sabertooth')
.requires(
    'plusplus.core.config',
    'plusplus.abstractities.creature',
    'plusplus.helpers.utils',
    'plusplus.helpers.pathfinding',
	'game.entities.player'
)
.defines(function(){ 
    "use strict";

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _pf = ig.pathfinding;
	
    ig.EntitySabertooth = ig.global.EntitySabertooth = ig.Creature.extend(/**@lends ig.Creature.prototype */{
        displayName: "Evil Bitch",
		healt: 100,
		speed: {x:100, y:100},
		size: {x: 32, y: 32},
		offset: {x: 0, y: 0},
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/sabertooth.png', 43,44),
		
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

        /**
         * Distance at which creature reacts to other creatures in {@link ig.Creature#preyGroup} and {@link ig.Creature#predatorGroup}.
         * <span class="alert alert-info"><strong>Tip:</strong> for best results, reaction distance should be <= pathfinding distance!</span>
         * @type Number
         * @see ig.CONFIG.CREATURE.REACTION_DISTANCE
         */
        reactionDistance: _c.CREATURE.REACTION_DISTANCE,

        /**
         * Distance at which creature reacts to other creatures in {@link ig.Creature#preyGroup} and {@link ig.Creature#predatorGroup}.
         * @type Number
         * @see ig.CONFIG.CREATURE.REACTION_DELAY
         */
        reactionDelay: _c.CREATURE.REACTION_DELAY,

        /**
         * Timer for reaction ticks.
         * <br>- created on init
         * @type ig.Timer
         * @readonly
         */
        reactionTimer: null,

        /**
         * Name of unique entity that this creature will prey on, i.e. creature will attack them.
         * <br>- priority 1 in finding prey, overrides type, group, and class.
         * @type String
         * @default
         */
        preyName: '',

        /**
         * Entity class that this creature will prey on, i.e. creature will attack them.
         * <br>- priority 2 in finding prey, overrides type and group but overriden by name.
         * @type String|ig.EntityExtended
         * @default
         */
        preyClass: ig.global.EntityPlayer,
		
        /**
         * Entity type that this creature will prey on, i.e. creature will attack them.
         * <br>- priority 3 in finding predator, overrides group, overriden by name and class.
         * @type ig.EntityExtended
         * @default
         */
        preyType: ig.EntityExtended.TYPE.NONE,

        /**
         * Groups that this creature will prey on, i.e. creature will attack them.
         * <br>- priority 4 in finding prey, overrides none.
         * @type Bitflag
         * @default
         * @see ig.utils.getType
         */
        preyGroup: ig.EntityExtended.GROUP.NONE,

        /**
         * Target prey entity.
         * @type ig.EntityExtended
         * @default
         */
        prey: null,

        /**
         * Whether needs line of sight for prey.
         * @type Boolean
         * @default
         * @see ig.CONFIG.CREATURE.NEEDS_LINE_OF_SIGHT_PREY
         */
        needsLineOfSightPrey: false,

        /**
         * Whether creature can detect hidden prey.
         * @type Boolean
         * @default
         * @see ig.CONFIG.CREATURE.DETECT_HIDDEN_PREDATOR
         */
        detectHiddenPrey: _c.CREATURE.DETECT_HIDDEN_PREY,

        /**
         * Settings for moving to prey. For options, see {@link ig.Character#moveTo}.
         * @type Object
         * @default
         */
        moveToPreySettings: _c.CREATURE.MOVE_TO_PREY_SETTINGS,

        /**
         * Name of unique entity that this creature is prey for, i.e. creature should run away from them.
         * <br>- priority 1 in finding predator, overrides group, type, and class.
         * @type String
         * @default
         */
        predatorName: '',

        /**
         * Entity class that this creature is prey for, i.e. creature should run away from them.
         * <br>- priority 2 in finding predator, overrides group and type, overriden by name.
         * @type ig.EntityExtended
         * @default
         */
        predatorClass: ig.global.EntityGorilla,

        /**
         * Entity type that this creature is prey for, i.e. creature should run away from them.
         * <br>- priority 3 in finding predator, overrides group, overriden by name and class.
         * @type ig.EntityExtended
         * @default
         */
        predatorType: ig.EntityExtended.TYPE.NONE,

        /**
         * Groups that this creature is prey for, i.e. creature should run away from them.
         * <br>- priority 4 in finding predator, overrides none.
         * @type Bitflag
         * @default
         * @see ig.utils.getType
         */
        predatorGroup: ig.EntityExtended.GROUP.NONE,

        /**
         * Whether creature sets predator to anything that damages it below flee threshold.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.PREDATOR_FROM_DAMAGE
         */
        predatorFromDamage: _c.CREATURE.PREDATOR_FROM_DAMAGE,

        /**
         * Whether creature can learn about new predators based on what it takes damage from.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_LEARN_PREDATORS
         */
        canLearnPredators: _c.CREATURE.CAN_LEARN_PREDATORS,

        /**
         * Target predator entity.
         * @type ig.EntityExtended
         * @default
         */
        predator: null,

        /**
         * Whether needs line of sight for predator.
         * @type Boolean
         * @default
         * @see ig.CONFIG.CREATURE.NEEDS_LINE_OF_SIGHT_PREDATOR
         */
        needsLineOfSightPredator: _c.CREATURE.NEEDS_LINE_OF_SIGHT_PREDATOR,

        /**
         * Whether creature can detect hidden predators
         * @type Boolean
         * @default
         * @see ig.CONFIG.CREATURE.DETECT_HIDDEN_PREDATOR
         */
        detectHiddenPredator: _c.CREATURE.DETECT_HIDDEN_PREDATOR,

        /**
         * Settings for moving to predator. For options, see {@link ig.Character#moveTo}.
         * @type Object
         * @default
         */
        moveToPredatorSettings: _c.CREATURE.MOVE_TO_PREDATOR_SETTINGS,

        /**
         * Whether creature can flee.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_FLEE
         */
        canFlee: _c.CREATURE.CAN_FLEE,

        /**
         * Percentage of health, between 0 and 1, when creature begins to flee.
         * @type Number
         * @see ig.CONFIG.CREATURE.FLEE_HEALTH_PCT
         */
        fleeHealthPct: _c.CREATURE.FLEE_HEALTH_PCT,

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
        tetherDistance: _c.CREATURE.TETHER_DISTANCE,

        /**
         * Whether creature can break tether range to follow a prey or flee from a predator.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_BREAK_TETHER
         */
        canBreakTether: _c.CREATURE.CAN_BREAK_TETHER,

        /**
         * Name of tether entity.
         * @type String
         */
        tetherName: '',

        /**
         * Try to use spawner as tether.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.TETHER_TO_SPAWNER
         */
        tetherToSpawner: _c.CREATURE.TETHER_TO_SPAWNER,

        /**
         * Whether creature is tethering, i.e. returning back to its tether.
         * @type Boolean
         * @default
         * @readonly
         */
        tethering: false,

        /**
         * Tether entity.
         * @type ig.EntityExtended
         * @default
         * @readonly
         */
        entityTether: null,

        /**
         * Settings for moving to tether. For options, see {@link ig.Character#moveTo}.
         * @type Object
         * @default
         */
        moveToTetherSettings: _c.CREATURE.MOVE_TO_TETHER_SETTINGS,

        /**
         * Whether creature can wander, set automatically during update based on current status.
         * @type Boolean
         * @readonly
         */
        canWander: true,

        /**
         * Whether creature can wander in x direction.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_WANDER_X
         */
        canWanderX: _c.CREATURE.CAN_WANDER_X,

        /**
         * Whether creature can wander in y direction.
         * @type Boolean
         * @see ig.CONFIG.CREATURE.CAN_WANDER_Y
         */
        canWanderY: _c.CREATURE.CAN_WANDER_Y,

        /**
         * Chance as a percent between 0 and 1 that direction will switch while wandering.
         * <span class="alert alert-info"><strong>Tip:</strong> setting this above 0.005 will cause creature to switch direction often and this can look rather stupid!</span>
         * @type Number
         * @see ig.CONFIG.CREATURE.WANDER_SWITCH_CHANCE
         */
        wanderSwitchChance: _c.CREATURE.WANDER_SWITCH_CHANCE,

        /**
         * Chance as a percent between 0 and 1 that direction will switch while not wandering.
         * <span class="alert alert-info"><strong>Tip:</strong> setting this above 0.015 will cause creature to never really stop moving.</span>
         * @type Number
         * @see ig.CONFIG.CREATURE.WANDER_SWITCH_CHANCE_STOPPED
         */
        wanderSwitchChanceStopped: _c.CREATURE.WANDER_SWITCH_CHANCE_STOPPED,

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

        },

		/**
		 * @override
		 **/
		resetCore: function (x, y, settings) {
			this.parent(x, y, settings);
		},

		/**
		 * @override
		 **/
		resetExtras: function () {
			this.parent();
		},

        /**
         * @override
         */
        spawn: function () {
            this.parent();

        },

        /**
         * @override
         **/
        pause: function () {

            this.parent();

        },

        /**
         * @override
         **/
        unpause: function () {

            this.parent();

        },

        /**
         * Finds and sets the closest predator and prey.
         * @param {Boolean} [force=false] whether to get new
        */
        findPredatorPrey: function ( force ) {

            return this.parent(force);

        },

        /**
         * Removes prey as target.
         */
        removePrey: function () {

            this.parent();

        },

        /**
         * Removes predator as target.
         */
        removePredator: function () {

            this.parent();

        },

        /**
         * Removes prey as target and clears all prey targeting methods, effectively disabling the creature from finding prey.
         */
        clearPrey: function () {

            this.parent();

        },

        /**
         * Removes predator as target and clears all predator targeting methods, effectively disabling the creature from finding predators.
         */
        clearPredator: function () {

            this.parent();

        },
		attack: function(entity){
			this.parent(entity);
		},
        /**
         * (does nothing except a simple distance check by default).
         * <span class="alert"><strong>IMPORTANT:</strong> override this with a class specific method!</span>
         * @param {ig.EntityExtended} entity target entity to attack
         * @returns {Boolean} whether creature is close enough to attack target
         */
        closeDistance: function ( entity ) {

            return this.parent(entity);

        },

        /**
         * Flees from a target.
         * @param {ig.EntityExtended} target target entity to flee from
         * @param {Object} settings settings for move
         * @returns {Boolean} whether creature started fleeing (not if is fleeing)
         */
        flee: function ( entity, settings ) {
            return this.parent( entity, settings );

        },

        /**
         * Damages creature.
         * <br>- if {@link ig.Creature#canLearnPredators}, adds the from entity's group to creature's predator group.
         * <br>- if {@link ig.Creature#health} is below {@link ig.Creature#fleeHealthPct}, will force damaging entity as predator and flee.
         * @override
         **/
        receiveDamage : function( amount, from, unblockable ) {

            

            return this.parent(amount, from, unblockable);

        },

        /**
         * Heals creature.
         * <br>- if {@link ig.Creature#health} is above {@link ig.Creature#fleeHealthPct}, will drop predator and stop fleeing.
         * @override
         **/
        receiveHealing: function (amount, from) {

            this.parent( amount, from );

        },

        /**
         * @override
         */
        cleanup: function () {
            this.parent();

        },

        /**
         * Checks closest targets and reacts accordingly.
         * @override
         **/
        updateChanges: function () {
			
            this.parent();
        },

        /**
         * Checks prey and reacts to it by moving closer and attacking.
         */
        updatePrey: function () {
			
            return this.parent();

        },

        /**
         * Checks predator and reacts to it.
         */
        updatePredator: function () {

            return this.parent();

        },

        /**
         * Checks tether and moves back to it as necessary.
         */
        updateTether: function () {

            this.parent();

        },

        /**
         * @returns {Boolean} whether creature can wander.
         */
        isSafeToWander: function () {

            return this.parent();

        },

        /**
         * Moves around randomly.
         */
        updateWander: function () {
	
            this.parent();

        }

    } );
});
