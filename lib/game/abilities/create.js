ig.module('game.abilities.create')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    
    'plusplus.abilities.ability'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityCreate = ig.Ability.extend({
        
        requiresTarget: false,
		canFindTarget: false,
		canTargetSelf: false,
        
        buildPosition: {
            x: 0,
            y: 0
        },
        
        buildSize: {
            x: 0,
            y: 0
        },
        
        buildEntity: null,
        buildTrigger: null,
        
        buildSlot: -1,

        activateSetupCastSettings: {
            animName: 'interactSetup'
        },

        activatePassCastSettings: {
            delay: 1,
            animName: 'interactPass',
        },

        activateCastSettings: {
            animName: 'interactActivate',
        },

        deactivateFromExecuteCastSettings: {
            animName: 'interactDeactivate'
        },

        initTypes: function () {

            _ut.addType(ig.Ability, this, 'type', "SPAMMABLE CREATE");

        },

        hasValidTarget: function () {
            return this.buildEntity;
        },
        
        setBuildSize: function(size) {
            this.buildSize = size;    
        },
        
        setBuildPosition: function(pos) {
            this.buildPosition = pos;
        },
        
        setBuildEntity: function(entity) {
            this.buildEntity = entity;    
        },
        
        setBuildSlot: function(slot) {
            this.buildSlot = slot;    
        },
        
        activateSetup: function() {
			this.parent();
			
            this.entity.lookAt( this.buildPosition );

		},
        
        fail: function(failReason) {
            this.buildTrigger.kill(true);
            this.buildTrigger = null;
            this.buildEntity = null;
            
            this.parent(failReason);  
        },

        activateComplete: function () {
            var basePos = this.buildPosition;
            var size = this.buildSize;
            var entity = this.entity;
            
            var temp = new (this.buildEntity)();
					
            var temp = ig.game.spawnEntity(temp, basePos.x - size.x * 0.5, basePos.y - size.y * 0.5);
			entity.inventory.removeSlot(this.buildSlot);
            entity.changeInterfaceState(entity.STATE_NEUTRAL);
            entity.inventory.logInfo();
						
            this.buildTrigger.kill(true);
            this.buildTrigger = null;
			this.buildEntity = null;
            
            this.parent();
        },

        deactivateComplete: function () {
            this.parent();
        },
    });
});