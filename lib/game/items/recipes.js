ig.module('game.items.recipes')

.requires(
    'plusplus.helpers.utils'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.recipes = {};
    
    ig.recipes.TYPES = {
        DEFAULT: 0,
        WORKSHOP: 1,
        WORKBENCH: 2,
        FORGE: 3,
        HERBOLOGY: 4
    };
    
    // base player recipes
    ig.recipes.data = [
        
        //Basic Tools/Weapons
        {//axe
            name: "Axe",
            description: "Cut down both trees and your foes.",
            
            iconPath: 'img/item-axe.png',
            
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
            description: "Dredge the minerals from rocks.",
            
            iconPath: 'img/item-pickaxe.png',
            
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
            description: "Put a hole in someone from out of arm's reach.",
            
            iconPath: 'img/item-spear.png',
            
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
		{//leash
            name: "Leash",
            description: "Bring wild beasts under your protection.",
            
            iconPath: 'img/item-leash.png',
            
            requiredMaterials: [
                {
                    name: "Meat",
                    quantity: 3
                }
            ]
        },
        {//torch
            name: "Torch",
            description: "A mobile source of light and heat.",
            
            iconPath: 'img/item-torch-icon.png',
            
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
        
        // Structures (tweak the components if needed)
        {//workbench
            name: "Flatpack Workbench",
            description: "Your first foray into crafting.",
            
            iconPath: 'img/item-workbench.png',
            
            requiredMaterials: [
                {
                    name: "Stick",
                    quantity: 3
                },
            ]
        },
        {//campfire
            name: "Flatpack Campfire",
            description: "Your base starts here.",
            
            iconPath: 'img/item-campfire.png',
            
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
        {//tent
            name: "Flatpack Tent",
            description: "Sleep soundly at night.",
            
            iconPath: 'img/item-tent.png',
            
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
    ];
    
    // recipes for the workshop
    ig.recipes.dataWorkbench = [
        
        // Weapons / Tools
        {//shovel
            name: "Shovel",
            description: "Relocate plants for your own needs.",
            
            iconPath: 'img/item-shovel.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 2
                }
            ]
        },
        {//poisoned spear
            name: "Poisoned Spear",
            description: "Lesson one...",
            
            iconPath: 'img/item-spear-poison.png',
            
            requiredMaterials: [
                {
                    name: "Poison",
                    quantity: 1
                },
                {
                    name: "Spear",
                    quantity: 1
                }
            ]
        },
        
        // Structures
        {//wooden barricade
            name: "Flatpack Wooden Barricade",
            description: "It won't hold them forever.",
            
            iconPath: 'img/item-barricade-wooden.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Grass",
                    quantity: 1
                },
            ]
        },
        {//stone barricade
            name: "Flatpack Stone Barricade",
            description: "Heavy-duty defense for a heavy-duty base.",
            
            iconPath: 'img/item-barricade-stone.png',
            
            requiredMaterials: [
                {
                    name: "Stone",
                    quantity: 2
                },
                {
                    name: "Grass",
                    quantity: 1
                },
            ]
        },
        {//cauldron
            name: "Flatpack Cauldron",
            description: "Make useful remedies. And drugs.",
            
            iconPath: 'img/item-cauldron.png',
            
            requiredMaterials: [
                {
                    name: "Stone",
                    quantity: 8
                },
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 1
                },
            ]
        },
        {//forge
            name: "Flatpack Forge",
            description: "For all your combative needs.",
            
            iconPath: 'img/item-forge.png',
            
            requiredMaterials: [
                {
                    name: "Stone",
                    quantity: 10
                },
                {
                    name: "Log",
                    quantity: 4
                },
                {
                    name: "Flint",
                    quantity: 2
                },
            ]
        },
        {//workshop
            name: "Flatpack Workshop",
            description: "Build tools of the modern age.",
            
            iconPath: 'img/item-workshop.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 3
                },
                {
                    name: "Iron",
                    quantity: 2
                }
            ]
        },
    ],
    
    // recipes for the workshop
    ig.recipes.dataForge = [
        
        {//sword
            name: "Sword",
            description: "A needle of your own.",
            
            iconPath: 'img/item-sword.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 2
                },
                {
                    name: "Iron",
                    quantity: 2
                }
            ]
        },
        {//battle axe
            name: "Battle Axe",
            description: "A solution to your moral problems.",
            
            iconPath: 'img/item-battleaxe.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 2
                },
                {
                    name: "Iron",
                    quantity: 3
                }
            ]
        },
    ],
    
    // recipes for the workshop
    ig.recipes.dataWorkshop = [
        
        {//net
            name: "Net",
            description: "If you can't catch up to them, catch them.",
            
            iconPath: 'img/item-net.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 2
                }
            ]
        },
        {//snare
            name: "Snare",
            description: "Catch small animals. Then probably murder them.",
            
            iconPath: 'img/item-snare.png',
            
            requiredMaterials: [
                {
                    name: "Log",
                    quantity: 2
                },
                {
                    name: "Flint",
                    quantity: 2
                }
            ]
        },
    ],
    
    // recipes for the workshop
    ig.recipes.dataHerbology = [
        
        {//poison
            name: "Poison",
            description: "Poison your enemies. Try not to drink it.",
            
            iconPath: 'img/item-poison.png',
            
            requiredMaterials: [
                {
                    name: "Nightshade",
                    quantity: 2
                },
            ]
        },
        {//salve
            name: "Salve",
            description: "Treat your wounds. You need this.",
            
            iconPath: 'img/item-salve.png',
            
            requiredMaterials: [
                {
                    name: "Marigold",
                    quantity: 2
                },
            ]
        },
    ],
    
    // assumes there is at least one current material
    // assumes the results list is empty
    ig.recipes.getResults = function(type, currMats, results) {
        if (results.length) return;
        
        var i, il, j, jl;
        
        var data;
        switch(type) {
            case ig.recipes.TYPES.WORKBENCH:
                data = ig.recipes.dataWorkbench;
                break;
            case ig.recipes.TYPES.FORGE:
                data = ig.recipes.dataForge;
                break;
            case ig.recipes.TYPES.WORKSHOP:
                data = ig.recipes.dataWorkshop;
                break;
            case ig.recipes.TYPES.HERBOLOGY:
                data = ig.recipes.dataHerbology;
                break;
            default:
                data = ig.recipes.data;
                break;
        }
        
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
                    description: pendingResult.description,
                    iconPath: pendingResult.iconPath,
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
                    break;
                } else {
                    var matchedIndex2 = _ut.indexOfProperty(results[i].currentMaterials, "name", currMats[j].name);
                    if (matchedIndex2 < 0) {
                        results[i].currentMaterials.push(currMats[j]);
                    } else {
                        results[i].currentMaterials[matchedIndex2].quantity = currMats[j].quantity;
                    }
                }
            }
            
            if (!results[i]) continue;
            
            if (results[i].currentMaterials.length !== currMats.length) {
                var currentMaterials = results[i].currentMaterials;
                for(k = currentMaterials.length - 1; k >= 0; k--) {
                    var matchedIndex3 = _ut.indexOfValue(currMats, currentMaterials[k]);
                    if (matchedIndex3 === -1) {
                        results[i].currentMaterials.splice(matchedIndex3, 1);
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
