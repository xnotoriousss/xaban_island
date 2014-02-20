ig.module('game.abilities.gather')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    
    'game.abilities.interact-casted'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityGather = ig.AbilityInteractCasted.extend({

        activateSetupCastSettings: {
            animName: 'interactSetup'
        },

        activatePassCastSettings: {
            delay: 0.75,
            animName: 'interactPass',
        },

        activateCastSettings: {
            animName: 'interactActivate',
        },

        deactivateFromExecuteCastSettings: {
            animName: 'interactDeactivate'
        },

        initTypes: function () {

            _ut.addType(ig.Ability, this, 'type', "SPAMMABLE INTERACT");
            _ut.addType(ig.EntityExtended, this, 'typeTargetable', "GATHERABLE");

        },

        hasValidTarget: function () {
            return this.parent();
        },

        activateComplete: function () {
            this.entityTarget.onHarvest(9999);
            
            this.parent();
        },

        deactivateComplete: function () {
            this.parent();
        },
    });
});