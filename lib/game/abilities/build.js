ig.module('game.abilities.build')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    
    'game.abilities.create'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityBuild = ig.AbilityCreate.extend({

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
    });
});