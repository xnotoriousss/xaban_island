ig.module('game.entities.sabertooth')
.requires(
    'plusplus.core.config',
    'plusplus.abstractities.creature',
    'plusplus.helpers.utils',
    'plusplus.helpers.pathfinding'
)
.defines(function(){ 

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _pf = ig.pathfinding;
	
    ig.EntitySabertooth = ig.global.EntitySabertooth = ig.Creature.extend(/**@lends ig.Creature.prototype */{
        displayName: "Evil Bitch",
		health: 10000,
		speed: {x:1000, y:1000},
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
        performance: ig.EntityExtended.PERFORMANCE.DYNAMIC,
		
        reactionDistance: _c.CREATURE.REACTION_DISTANCE,
		
        reactionDelay: _c.CREATURE.REACTION_DELAY,
		
        reactionTimer: null,
		
        preyName: '',
		
		preyClass: 'EntityPlayer',
		
        preyType: ig.EntityExtended.TYPE.NONE,
		
        preyGroup: ig.EntityExtended.GROUP.NONE,
		
        prey: null,
		
        needsLineOfSightPrey: false,
		
        detectHiddenPrey: _c.CREATURE.DETECT_HIDDEN_PREY,
		
        moveToPreySettings: _c.CREATURE.MOVE_TO_PREY_SETTINGS,
		
        predatorName: '',
		
        predatorClass: null,
		
        predatorType: ig.EntityExtended.TYPE.NONE,
		
        predatorGroup: ig.EntityExtended.GROUP.NONE,
		
        predatorFromDamage: _c.CREATURE.PREDATOR_FROM_DAMAGE,
		
        canLearnPredators: true,
		
        predator: null,
		
        needsLineOfSightPredator: _c.CREATURE.NEEDS_LINE_OF_SIGHT_PREDATOR,
		
        detectHiddenPredator: _c.CREATURE.DETECT_HIDDEN_PREDATOR,
		
        moveToPredatorSettings: _c.CREATURE.MOVE_TO_PREDATOR_SETTINGS,
		
        canFlee: _c.CREATURE.CAN_FLEE,
		
        fleeHealthPct: _c.CREATURE.FLEE_HEALTH_PCT,
		
        fleeing: false,
		
        fleeingLowHealth: false,
		
        tetherDistance: _c.CREATURE.TETHER_DISTANCE,
		
        canBreakTether: _c.CREATURE.CAN_BREAK_TETHER,
		
        tetherName: '',
		
        tetherToSpawner: _c.CREATURE.TETHER_TO_SPAWNER,
		
        tethering: false,
		
        entityTether: null,
		
        moveToTetherSettings: _c.CREATURE.MOVE_TO_TETHER_SETTINGS,
		
        canWander: true,
		
        canWanderX: _c.CREATURE.CAN_WANDER_X,
		
        canWanderY: _c.CREATURE.CAN_WANDER_Y,
		
        wanderSwitchChance: _c.CREATURE.WANDER_SWITCH_CHANCE,
		
        wanderSwitchChanceStopped: _c.CREATURE.WANDER_SWITCH_CHANCE_STOPPED,
		
        wandering: false,
		
        wanderDirection: { x: 0, y: 0 },
		
        wanderPos: { x: 0, y: 0 },
		
        moveToWanderSettings: _c.CREATURE.MOVE_TO_WANDER_SETTINGS,
		
        _preySearchSettings: {},
		
        _predatorSearchSettings: {},
		

        /**
         * @override
         **/
        initTypes: function () {
            
            this.parent();
			_ut.addType( ig.EntityExtended, this, 'type', "FELINE" );
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
