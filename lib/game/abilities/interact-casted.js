ig.module('game.abilities.interact-casted')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    'plusplus.abilities.interact'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityInteractCasted = ig.AbilityInteract.extend({
        
        rangeX: 1,
        rangeY: 1,
        
        // requires target?
        requiresTarget: true,
        // auto find target?
        canFindTarget: false,
        canTargetSelf: false,

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

            // types

            _ut.addType(ig.Ability, this, 'type', "SPAMMABLE INTERACT");

            // able to target mimicable

            _ut.addType(ig.EntityExtended, this, 'typeTargetable', "INTERACTIVE");

        },

        hasValidTarget: function () {
            return this.parent();
        },

        activateComplete: function () {
            
            this.parent();

        },

        deactivateComplete: function () {
            this.parent();
        },
        
        castEnd: function () {

            this.parent();
            
            // ensure release of animation
            this.entity.animRelease(null, true);
        },
    });
});