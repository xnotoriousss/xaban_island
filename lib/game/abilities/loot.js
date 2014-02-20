ig.module('game.abilities.loot')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    
    'game.abilities.interact-casted'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityLoot = ig.AbilityInteractCasted.extend({

        activateSetupCastSettings: {
            animName: 'lootSetup'
        },

        activatePassCastSettings: {
        },
        
        activateCastSettings: {
        },

        deactivateFromExecuteCastSettings: {
        },

        initTypes: function () {

            _ut.addType(ig.Ability, this, 'type', "SPAMMABLE INTERACT");
            _ut.addType(ig.EntityExtended, this, 'typeTargetable', "LOOTABLE");

        },

        hasValidTarget: function () {
            return this.parent();
        },

        activateComplete: function () {
            this.entityTarget.onLoot(this.entity);
            
            this.parent();
        },

        deactivateComplete: function () {
            this.parent();
        },
    });
});