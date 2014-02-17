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
                baseRadius: 100, // the distance at which a calculated adjusted temperature will equal optimum temperature
				adjustedRadius: 100,
                regenModifier: 1.5 // the temperature that the player will experience at the optimum distance
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
		fireBaseDegeneration: 0.0167,
		fireAdjustedDegeneration: 0.0167,
		regen: true,
		
		// REMEMBER: The radius of the light is calculated with this formula:
		// size.y * 0.5 * sizeMod
		// so with size.y = 32 like in this the size will be 32 * .5 * 6 = 96
		// so the above baseradius (100) is correct enough
		glowSettings: {
			sizeMod: 6,
			// these directly correlate
			// to ig.Entity light properties
			light: {
				r: 1,
				g: 0.85,
				b: 0.7,
				// cast shadows only on static entities
				castsShadows: false
			}
		},
	    
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
			this.abilities.addDescendant( new ig.AbilityGlow( this ) );
        },
		
		resetExtras: function() {
			this.parent();
			
			this.fireHealthMax = this.fireHealth;
		},
		
		adjustRadius: function() {
			var curr = this.fireHealth,
				max = this.fireHealthMax;
			
			var heat = this.components.heat;
			var ratio = curr / max;
			heat.adjustedRadius = heat.baseRadius * ratio;
			this.glowSettings.sizeMod *= ratio;
		},
		
        receiveFireHealing: function (amount, from) {
            this.fireHealth = Math.min(this.fireHealthMax, this.fireHealth + amount);
			
			this.adjustRadius();
        },
		
        receiveFireDamage: function (amount, from) {
            if (amount) {
                this.fireHealth = Math.max(this.fireHealth - amount, 0);
				this.adjustRadius();
				
                return true;
            }

            return false;
        },
		
        regenerate: function() {
			this.receiveFireDamage(this.fireAdjustedDegeneration, this);
        },
		
		update: function() {
			this.parent();
			if (!this.paused && !this.frozen) {
				this.regenerate();
			}
		}
    });
});
