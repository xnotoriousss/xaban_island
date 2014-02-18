ig.module('game.entities.campfire')

.requires(
    'plusplus.core.config',
	'plusplus.abilities.glow',
	
	'game.abstractities.station'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityCampfire = ig.global.EntityCampfire = ig.Station.extend({
		
	    displayName: "Campfire",
	    size: {x: 32, y: 38},
	    offset: {x: 0, y: 0},
        
        components: {
			transfer: "fire",
            heat: {
                baseRadius: 100, // the heat source's effective distance
				adjustedRadius: 100, 
                regenModifier: 1.5 // how much to multiply player heat regeneration by
            },
        },
		
		droppedItems: [
			{
				name: "Stick",
				quantityMin: 1,
				quantityMax: 2
			}
		],
		
		fireHealth: 100,
		fireHealthMax: 100,
		fireBaseDegeneration: 1,
		fireAdjustedDegeneration: 1,
		regen: true,
		regenDelay: 1,
		
		// REMEMBER: The radius of the light is calculated with this formula:
		// size.y * 0.5 * sizeMod
		// so with size.y = 32 like in this the size will be 32 * .5 * 6 = 96
		// so the above baseradius (100) is correct enough
		glowSettings: {
			baseSizeMod: 6,
			sizeMod: 6,
			// these directly correlate
			// to ig.Entity light properties
			light: {
				r: 1,
				g: 0.85,
				b: 0.7,
				performance: ig.EntityExtended.PERFORMANCE.MOVABLE,
				castsShadows: false
			}
		},

		fireActive: true,
		lastRatio: 1,
		glowAbility: null,
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/campfire.png', 32, 38),
	
		animInit: "idleX",
        
        animSettings: {
            idleX: {
                frameTime: 0.1,
                sequence: [0,1,2,3]
            }
        },
		
		initTypes: function () {
            _ut.addType(ig.EntityExtended, this, 'type', "STATION");
        },

        initProperties: function () {
            this.parent();
			this.glowAbility = new ig.AbilityGlow(this);
			this.abilities.addDescendant( this.glowAbility );
        },
		
		resetExtras: function() {
			this.parent();
			
			this.fireHealthMax = this.fireHealth;
			this.glowSettings.sizeMod = this.glowSettings.baseSizeMod;
		},
		
		adjustRadius: function(ratio) {
			if (!this.fireActive) return;
			
			var heat = this.components.heat;
			heat.adjustedRadius = heat.baseRadius * ratio + this.size.y * 0.5;
			//console.log(ratio);
			this.glowSettings.sizeMod = this.glowSettings.baseSizeMod * ratio;
			this.glowAbility.deactivateComplete();
			this.glowAbility.activateComplete();
		},
		
        receiveFireHealing: function (amount, from) {
			if (amount) {
				if(!this.fireActive) this.reviveFire();
				
				this.fireHealth = Math.min(this.fireHealthMax, this.fireHealth + amount);
				
				var curr = this.fireHealth,
					max = this.fireHealthMax;
				var ratio = curr / max,
					newRatio = this.lastRatio + 0.25;
				
				if (newRatio <= 1 && ratio >= this.lastRatio) {
					ratio = newRatio;
					this.lastRatio = newRatio;
					this.adjustRadius(ratio);
				}
			}
        },
		
        receiveFireDamage: function (amount, from) {
			if (!this.fireActive) return;
			
            if (amount) {
                this.fireHealth = Math.max(this.fireHealth - amount, 0);
				
				var curr = this.fireHealth,
					max = this.fireHealthMax;
				var ratio = curr / max,
					newRatio = this.lastRatio - 0.25;
				console.log(ratio);
				if (ratio <= newRatio) {
					if (newRatio > 0) {
						ratio = newRatio;
						this.lastRatio = newRatio;
						this.adjustRadius(ratio);
					} else {
						this.killFire();
					}
				}
				
                return true;
            }

            return false;
        },
		
		reviveFire: function() {
			this.regen = true;
			this.regenTimer.unpause();
			
			this.fireActive = true;
		},
		
		killFire: function() {
			this.lastRatio = 0;
			
			this.fireActive = false;
			this.glowAbility.deactivateComplete();
			
			this.regen = false;
			this.regenTimer.reset();
			this.regenTimer.pause();
			
			var heat = this.components.heat;
			heat.adjustedRadius = 0;
		},
		
        regenerate: function() {
			if (this.fireActive)
				this.receiveFireDamage(this.fireAdjustedDegeneration, this);
        },
		
		update: function() {
			this.parent();
			
			if (!this.paused && !this.frozen) {
				// regen

                if (this.regen && this.regenTimer.delta() >= 0) {

                    this.regenTimer.set(this.regenDelay);

                    this.regenerate();

                }
			}
		}
    });
});
