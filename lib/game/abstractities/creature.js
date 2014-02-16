ig.module('game.abstractities.creature')

.requires(
    'plusplus.abstractities.creature'
)
    
.defines(function () {
    "use strict";
	var _ut = ig.utils;

    ig.Creature.inject({
		collides: ig.EntityExtended.COLLIDES.LITE,
		canRetaliate: true,
		explodingDamage: false,
		initTypes: function () {
            
            _ut.addType( ig.EntityExtended, this, 'type', "CREATURE" );

        },
        updatePrey: function () {
            var prey = this.prey;
            if( prey && !this.managed ) {
                
                if ( prey._killed || ( prey.hidden && !this.detectHiddenPrey ) || this.distanceSquaredTo( prey ) > this.reactionDistance * this.reactionDistance ) {
                    
                    return this.removePrey();
                    
                }
                else if ( !this.fleeing && !this.fleeingLowHealth ) {

                    // get closer and attack when not fleeing and not in survival mode

                    this.attacking = this.closeDistance( prey );

                    if ( this.attacking ) {

                        this.attack(prey);
						

                    }
                    else {

                        this.moveTo( prey, this.moveToPreySettings );

                    }

                }

            }

        },
		receiveDamage : function( amount, from, unblockable ) {

            var res = this.parent(amount, from, unblockable);

            if ( from && !this._killed ) {

                // learn about new predators that are not prey

                if ( this.canRetaliate && !this.fleeing) {

                    this.prey = from;

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
        closeDistance: function ( entity ) {

            var distanceMax = Math.max( this.size.x * 0.25, this.size.y * 0.25, ig.game.collisionMap && ig.game.collisionMap.tilesize || 0 );
			
            return this.distanceSquaredEdgeTo( entity ) <= distanceMax * distanceMax;

        },
        
        attack: function(entity){
			if(!entity.killed){
				entity.receiveDamage(2, this, true);
			}
			this.moveToStop();
		}
    });
});



