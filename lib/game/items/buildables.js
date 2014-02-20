ig.module('game.items.buildables')

.requires(
    'plusplus.helpers.utils',
	
	'game.entities.campfire',
	'game.entities.bonfire',
	'game.entities.tent',
	'game.entities.forge'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.buildables = {};
    
    ig.buildables.data = [
        
        //Fire
        {//campfire
            name: "Campfire",
            type: ig.EntityCampfire,
			size: {x: 32, y: 38}
        },
		
        //Shelter
        {//tent
            name: "Tent",
			type: ig.EntityTent,
			size: {x: 62, y: 100}
        },
		
		//Crafting
        {//forge
            name: "Forge",
			type: ig.EntityForge,
			size: {x: 48, y: 48}
        }
    ];
    
    ig.buildables.getFlatpackType = function(flatpack) {
		var build = flatpack.getComponent('build');
		if (build) {
			return ig.buildables.getDataByName(build.resultName).type;
		}
		
		return null;
    };
	
	ig.buildables.getFlatpackSize = function(flatpack) {
		var build = flatpack.getComponent('build');
		if (build) {
			return ig.buildables.getDataByName(build.resultName).size;
		}
		
		return null;
    };
    
    ig.buildables.getDataByName = function(name) {
        return ig.buildables.data[_ut.indexOfProperty(ig.buildables.data, "name", name)];
    };
});
