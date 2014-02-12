ig.module('game.items.recipes')

.requires(
    'plusplus.helpers.utils'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.recipes = {};
    
    ig.recipes.data = [
        
        //Basic Tools/Weapons
        {//axe
            name: "Axe",
            
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ]
        },    
        {//pickaxe
            name: "Pickaxe",
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ]
            
        },     
        {//shovel
            name: "Shovel",
            
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ]
        },
        {//spear
            name: "Spear",
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ]
        },
        
        //Fire (tweak the components if needed)
        {//flatpack campfire
            name: "Flatpack Campfire",
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 3
                },
                {
                    name: "Grass",
                    quantity: 1
                }
            ]
        },
        {//torch
            name: "Torch",
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Grass",
                    quantity: 1
                }
            ]
        },
        
        //Shelter (a bit iffy components, check em out)
        {//tent
            name: "Flatpack Tent",
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 3
                },
                {
                    name: "Grass",
                    quantity: 3
                }
            ]
        },
        
        //Food (solid components imo, might need renaming)
        {//meat
            name: "Meat"
        },
    ];
    
    // assumes there is at least one current material
    // assumes the results list is empty
    ig.recipes.getResults = function(currMats, results) {
        if (results.length) return;
        
        var i, il, j, jl,
            data = ig.recipes.data;
        
        for(i = 0, il = data.length; i < il; i++) {
            var pendingResult = data[i];
            var mats = pendingResult.requiredMaterials; if (!mats) continue;

            var valid = true;
            for(j = 0, jl = currMats.length; j < jl; j++) {
                var matchedMat = _ut.indexOfProperty(mats, "name", currMats[j].name);
                if(matchedMat === -1) {
                    valid = false;
                }
            }
            
            if (valid) {
                var packagedResult = {
                    name: pendingResult.name,
                    requiredMaterials: pendingResult.requiredMaterials,
                    currentMaterials: currMats,
                    ready: false
                };
                results.push(packagedResult);
            }
        }
    };
    
    // assumes there is at least one current material
    // assumes there is at least one result
    ig.recipes.updateResults = function(currMats, results) {
        var i, il, j, jl, k;
        
        for(i = results.length - 1; i >= 0; i--) {
            var mats = results[i].requiredMaterials;
            for(j = 0, jl = currMats.length; j < jl; j++) {
                var matchedIndex = _ut.indexOfProperty(mats, "name", currMats[j].name);
                if (matchedIndex < 0) {
                    results.splice(i, 1);
                } else {
                    var matchedIndex2 = _ut.indexOfProperty(results[i].currentMaterials, "name", currMats[j].name);
                    if (matchedIndex2 < 0) {
                        results[i].currentMaterials.push(currMats[j]);
                    } else {
                        results[i].currentMaterials[matchedIndex2].quantity = currMats[j].quantity;
                    }
                }
            }
            if (!results[i]) {
                console.log("Result not found: "+i);
            }
            if (results[i].currentMaterials.length !== currMats.length) {
                var currentMaterials = results[i].currentMaterials;
                for(k = currentMaterials.length - 1; k >= 0; k--) {
                    var matchedIndex3 = _ut.indexOfValue(currMats, currentMaterials[k]);
                    if (matchedIndex3 === -1) {
                        results[i].currentMaterials.splice(matchedIndex3);
                    }
                }
            } else {
                var sortFunction = function(a, b) {
                    if (a.name < b.name) return -1;
                    else if (a.name > b.name) return 1;
                    return 0;
                };
                results[i].currentMaterials.sort(sortFunction);
                results[i].requiredMaterials.sort(sortFunction);
                var ready = true;
                for(var z = 0; z < results[i].currentMaterials.length; z++) {
                    var temp = results[i].currentMaterials[z],
                        temp2 = results[i].requiredMaterials[z];
                    if (temp.name !== temp2.name || temp.quantity < temp2.quantity) {
                        ready = false;
                    }
                }
                results[i].ready = ready;
            }
        }
        
        return results;
    };
});
