ig.module('game.entities.forge')

.requires(
    'plusplus.core.config',
	'plusplus.abilities.glow',
	
	'game.abstractities.station'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityForge = ig.global.EntityForge = ig.Station.extend({
		
	    displayName: "Forge",
	    size: {x: 48, y: 48},
	    offset: {x: 0, y: 0},
        
        components: {
            heat: {
				active: true,
                baseRadius: 50, // the heat source's effective distance
				adjustedRadius: 50, 
                regenModifier: 1 // how much to multiply player heat regeneration by
            },
        },
		
		droppedItems: [
			{
				name: "Stone",
				quantityMin: 3,
				quantityMax: 4
			}
		],
		
		glowSettings: {
			sizeMod: 2,
			// these directly correlate
			// to ig.Entity light properties
			light: {
				r: 1,
				g: 0.75,
				b: 0.62,
				performance: ig.EntityExtended.PERFORMANCE.STATIC,
				castsShadows: false
			}
		},
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/forge.png', 48, 48),
	
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
			
			this.abilities.addDescendant( new ig.AbilityGlow(this) );
        },
		
		resetExtras: function() {
			this.parent();
		},
    });
});
