ig.module('game.entities.bonfire')

.requires(
    'plusplus.core.config',
	'plusplus.abilities.glow',
	
	'game.entities.campfire'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityBonfire = ig.global.EntityBonfire = ig.EntityCampfire.extend({
		
	    displayName: "Bonfire",
	    size: {x: 32, y: 38},
	    offset: {x: 0, y: 0},
        
        components: {
			transfer: "fire",
            heat: {
				active: true,
                baseRadius: 200,
				adjustedRadius: 200,
                regenModifier: 2,
            },
        },
		
		droppedItems: [
			{
				name: "Stick",
				quantityMin: 3,
				quantityMax: 8
			}
		],
		
		// settings for glow
		
		glowSettings: {
			baseSizeMod: 12,
			sizeMod: 12,
			// these directly correlate
			// to ig.Entity light properties
			light: {
				r: 1,
				g: 0.85,
				b: 0.7,
				performance: ig.EntityExtended.PERFORMANCE.STATIC,
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
		
		fireHealth: 250,
		
		initTypes: function () {
            _ut.addType(ig.EntityExtended, this, 'type', "STATION");
        }
    });
});
