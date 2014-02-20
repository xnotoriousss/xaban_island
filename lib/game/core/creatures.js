ig.module('game.core.creatures')

.requires(
    'plusplus.helpers.utils'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.Creatures = {};
    
    ig.Creatures.data = [
        
        //Felines
        {//Sabertooth
            
            name: "Sabertooth",
            family: "Feline",
            cls: ig.EntitySabertooth
        },    
        
        
        //Primates
        {//Gorilla
            name: "Gorilla",
            family: "Primate",
			cls: ig.EntityGorilla
        },
        
        //Canines
        {//Wolf
            name: "Wolf",
            family: "Canine",
            cls: ig.EntityWolf
        }
    ];
    
    ig.Creatures.getCreatureClass = function(entity) {
		if (entity)return ig.Creatures.data[_ut.indexOfProperty(ig.Creatures.data, "name", entity.resultName)].cls;
		return null;
    };
    
    ig.Creatures.getCreatureFamily = function(entity) {
        if(entity)return ig.Creatures.data[_ut.indexOfProperty(ig.Creatures.data, "name", entity.resultName)].family;
        return null;
    };
});
