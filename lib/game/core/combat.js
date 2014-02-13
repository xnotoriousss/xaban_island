ig.module('game.core.combat')
.requires(
    'plusplus.abilities.ability-shoot',
    'plusplus.abstractities.projectile'
)

.defines(function() { "use strict";
         
    ig.combat = {};
    
    ig.combat.attack = function(to, from, type, amount) {
        if (type == "melee") {
            var dealt = to.receiveDamage(amount, from, true);
            ig.log(to.health);
            ig.log(from.health);
            if (dealt) {
                return true;
            } else {    
                return false;
            }   
        } /*else if (range >= 1) { // TODO: Possibly separate from this function in player.js determine if throwning
            from.shoot = new ig.AbilityShoot(from); // Get rid of this shit
            ig.EntityBullet = ig.Projectile.extend({ // TODO: Fix image not drawing
                size: { x: 32, y: 32 },
                animSheet: new ig.AnimationSheet (ig.CONFIG.PATH_TO_MEDIA + 'img/item-stick.png', 32, 32),
                lifeDuration: from.equipment.items[0].component.tossable.range, // TODO: Calculate a duration based on range and ticks
                damage: amount
            });
            from.shoot.spawningEntity = ig.EntityBullet;
            var shootSettings = {
                offsetX: from.facing.x,
                offsetY: from.facing.y
            };
            from.shoot.offsetAccelX = 1; // TODO: Modify acceleration and velocity to match weapon
            from.shoot.offsetAccelY = 1;
            from.shoot.offsetVelX = 1;
            from.shoot.offsetVelY = 1;
            from.shoot.activate(shootSettings);
        }*/
    };
});
