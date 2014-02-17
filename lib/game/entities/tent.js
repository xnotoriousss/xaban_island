ig.module('game.entities.tent')

.requires(
    'plusplus.core.config',

	'game.abstractities.station'
)
    
.defines(function () {

    var _c = ig.CONFIG;
        
	ig.EntityTent = ig.global.EntityTent = ig.Station.extend(/**@lends ig.EntityCheckpoint.prototype */{
		
	    displayName: "Tent",
	    size: {x: 62, y: 100},
	    offset: {x: 17, y: 14},
        
        components: {
        },
		
		droppedItems: [
			{
				name: "Stick",
				quantityMin: 2,
				quantityMax: 3
			},
			{
				name: "Grass",
				quantityMin: 1,
				quantityMax: 3
			}
		],
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/tent.png', 96, 128),
	
		animInit: "idleX",
        
        animSettings: {
            idleX: {
                frameTime: 1,
                sequence: [0]
            }
        },

        initProperties: function () {
            this.parent();
        },
    });
});
