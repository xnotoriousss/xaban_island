ig.module('game.abstractities.creature')

.requires(
    'plusplus.abstractities.creature'
)
    
.defines(function () {
    "use strict";
	var _ut = ig.utils;

    ig.Creature.inject({
		predatorFromDamage:true,
		reactionDistance: 500,
		collides: ig.EntityExtended.COLLIDES.LITE,
		canFlee: true,
		fleeHealthPct: .15,
		wanderSwitchChance: .05,
		wanderSwitchChanceStopped: .5,
        canLearnPredators: true,
		explodingDamage: false,
		moveToWanderSettings: {
            simple: true,
            avoidUngrounded: false,
            avoidSlopes: false
        },
		moveToPreySettings: {
            avoidEntities: true,
            searchDistance: 500
        },
		moveToPredatorSettings: {
            avoidEntities: true,
            searchDistance: 500
        
		},
			
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



