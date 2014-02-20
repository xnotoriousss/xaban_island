ig.module('game.abilities.harvest')

.requires(
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsvector2',
    
    'game.abilities.interact-casted'
)

.defines(function () {
    "use strict";

    var _ut = ig.utils;
    var _utv2 = ig.utilsvector2;

    ig.AbilityHarvest = ig.AbilityInteractCasted.extend({
        
        harvestDamage: 0,

        activateSetupCastSettings: {
            animName: 'harvestSetup'
        },

        activatePassCastSettings: {
        },

        activateCastSettings: {
        },

        deactivateFromExecuteCastSettings: {
        },

        initTypes: function () {

            // types

            _ut.addType(ig.Ability, this, 'type', "SPAMMABLE INTERACT");

            // able to target mimicable

            _ut.addType(ig.EntityExtended, this, 'typeTargetable', "HARVESTABLE");

        },

        hasValidTarget: function () {
            return this.parent();
        },

        activateComplete: function () {

            if (this.entity.name === "player") {
                var equip = this.entity.equipment;
                var weaponData = equip.getWeaponData();
                if (weaponData) {
                    equip.damageWeapon(weaponData.tool.duraLoss);
                }
            }
            this.entityTarget.onHarvest(this.harvestDamage);

            this.parent();

        },

        deactivateComplete: function () {
            this.parent();
        },
    });
});