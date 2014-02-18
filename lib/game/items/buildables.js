ig.module('game.items.buildables')

.requires(
    'plusplus.helpers.utils',
	
	'game.entities.campfire',
	'game.entities.bonfire',
	'game.entities.tent'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.buildables = {};
    
    ig.buildables.data = [
        
        //Fire
        {//campfire
            
            name: "Campfire",
            
            type: ig.EntityCampfire
        },    
        
        
        //Shelter
        {//tent
            name: "Tent",
            
			type: ig.EntityTent
        }
    ];
    
    ig.buildables.getFlatpackType = function(flatpack) {
		var build = flatpack.getComponent('build');
		if (build) {
			return ig.buildables.getTypeByName(build.resultName);
		}
		
		return null;
    };
    
    ig.buildables.getTypeByName = function(name) {
        return ig.buildables.data[_ut.indexOfProperty(ig.buildables.data, "name", name)].type;
    };
});
