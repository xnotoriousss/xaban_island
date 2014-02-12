ig.module('game.entities.campfire')

.requires(
    'plusplus.core.config',
    'plusplus.core.entity',
	'plusplus.abilities.glow',
    'plusplus.entities.explosion',
	'plusplus.abstractities.character'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityCampfire = ig.global.EntityCampfire = ig.Character.extend(/**@lends ig.EntityCheckpoint.prototype */{
		
	    displayName: "Campfire",
	    size: {x: 32, y: 38},
	    offset: {x: 0, y: 0},
        
        components: {
            light: { 
                range: 10 //radius
            },
            
            heat: {
                range: 10,
                temperature: 105, //threshold for player gain heat(fahrenheit)
                tempGain: .25, /*degree fahrenheit you gain
                               per second until you reach temperature*/ 
                cookable: true
            },
        },
		
		// settings for glow
		
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

        performance: ig.EntityExtended.PERFORMANCE.STATIC,
		collides: ig.EntityExtended.COLLIDES.FIXED,
        targetable: true,
        health: 100,
        healthMax: 100,
        regen: false,
        deathSettings: {
            spawnCountMax: _c.CHARACTER.EXPLODING_DEATH_PARTICLE_COUNT,
            spawnSettings: {
                animTileOffset: ig.EntityParticleColor.colorOffsets.WHITE
            }
        },

        initTypes: function () {
            _ut.addType(ig.EntityExtended, this, 'type', "STATION");
        },

        initProperties: function () {
            this.parent();
			
			this.abilities.addDescendant( new ig.AbilityGlow( this ) );
        },

        receiveDamage: function (amount, from, unblockable) {
            return this.parent(amount, from, unblockable);
        },

        explode: function (settings) {
            ig.game.spawnEntity(ig.EntityExplosion, this.pos.x, this.pos.y, ig.merge({
                size: { x: this.size.x, y: this.size.y }
            }, settings || this.damageSettings));
        },

        kill: function ( silent ) {
            this.parent( silent );
        },

        die: function () {
			this.dropItems("Stick", 2);
			this.parent();
        },
    });
});