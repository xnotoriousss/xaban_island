ig.module('game.entities.bonfire')

.requires(
    'plusplus.core.config',
	'plusplus.abilities.glow',
	
	'game.entities.campfire'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityBonfire = ig.global.EntityBonfire = ig.EntityCampfire.extend(/**@lends ig.EntityCheckpoint.prototype */{
		
	    displayName: "Bonfire",
	    size: {x: 32, y: 38},
	    offset: {x: 0, y: 0},
        
        components: {
            heat: {
                baseRadius: 200, // the distance at which a calculated adjusted temperature will equal base temperature
				adjustedRadius: 200,
                regenModifier: 2, //threshold for player gain heat(fahrenheit) at the opt dist
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
			sizeMod: 12,
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
		
		fireHealth: 250,
		
		initTypes: function () {
            _ut.addType(ig.EntityExtended, this, 'type', "STATION");
        }
    });
});
