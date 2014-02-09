ig.module('game.items.recipes')

.requires(
    'plusplus.helpers.utils',
    
    'game.items.ground-item'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.recipes = {};
    
    ig.recipes.data = [
        
        //Basic Tools/Weapons
        {//axe
            
            name: "Axe",
            
            materials: [
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
            materials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ],
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-pickaxe.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-pickaxe.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            components: {
                durability: 100,
                weapon: {
                    type: "melee",
                    damage: 20,
                    duraLoss: 4
                },
                tool: {
                    type: "pickaxe",
                    damage: 20,
                    duraLoss: 4
                },
                tossable: {
                    range: 15,
                    speed: 3,
                    damage: 20
                }
            }
        },     
        {//shovel
            
            name: "Shovel",
            
            ingredients: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ],
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-shovel.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-shovel.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            components: {
                durability: 100,
                weapon: {
                    type: "melee",
                    damage: 20,
                    duraLoss: 4
                },
                tool: {
                    type: "shovel", /*for a shovel, i want it to create
                        a hole so the player can grow trees, berry bushes,
                        plants, etc. if you've played harvest moon before
                        this would be like a hoe*/
                    duraLoss: 4
                },
                tossable: {
                    range: 15,
                    speed: 3,
                    damage: 20
                }
            }
        },
        
        {//spear
            name: "Spear",
            materials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Flint",
                    quantity: 1
                }
            ],
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-spear.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-spear.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            components: {
                durability: 100,
                weapon: {
                    type: "melee",
                    damage: 35,
                    duraLoss: 4
                },
                tossable: {
                    range: 30,
                    speed: 10,
                    damage: 35
                }
            }
        },
        
        //Fire (tweak the components if needed)
        {//campfire
            name: "Campfire",
            materials: [
                {
                    name: "Stick",
                    quantity: 3
                },
                {
                    name: "Grass",
                    quantity: 1
                }
            ],
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-campfire.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-campfire.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
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
                }
            }
        },
        {//torch
            name: "Torch",
            materials: [
                {
                    name: "Stick",
                    quantity: 1
                },
                {
                    name: "Grass",
                    quantity: 1
                }
            ],
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-torch.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-torch.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            components: {
                durability: 100,
                weapon: {
                    type: "melee",
                    damage: 5,
                    duraLoss: 4
                },
                tool: {
                    type: "torch",
                    duraLoss: 1
                },
                tossable: {
                    range: 15,
                    speed: 5,
                    damage: 5
                },
                light: { 
                    range: 5 //radius
                },
                heat: {
                    range: 5, //provides heat in vicinity
                    temperature: 100, //threshold
                    tempGain: .1, //persecond gain temp if within threshold
                    cookable: false //cant cook shit with a torch
                }
            }
        },
        
        //Shelter (a bit iffy components, check em out)
        {//tent
            name: "Tent",
            materials: [
                {
                    name: "Stick",
                    quantity: 3
                },
                {
                    name: "Grass",
                    quantity: 3
                }
            ],
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-tent.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-tent.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            components: {
                sleep: {
                    energy: 40, //gain energy
                    hunger: 20, //get more hungry
                    temperature: 100,
                    tempGain: .25,
                    time: 6, //sleep for hours
                }
                
            }
        },
        
        //Food (solid components imo, might need renaming)
        {//meat
            name: "Meat",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-meat.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-meat.png',
                
            stackable: true,
            maxStacks: 10,
            value: 15,
            components: {
                cookable: true,
                eatable: {
                    hungerVal: 5,
                    healthVal: -5 //eating raw meat not healthy
                }
            }
        },
        
        //Basic Materials
        {//log
            name: "Log",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-log.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-log.png',
                
            stackable: true,
            maxStacks: 10,
            value: 15
        },
        {//rock
            
            name: "Rock",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-rock.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-rock.png',
            stackable: true,
            maxStacks: 10,
            value: 15
        },
        {//stick
            
            name: "Stick",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-stick.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-stick.png',
            stackable: true,
            maxStacks: 20,
            value: 15
        },
        {//grass
            
            name: "Grass",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-grass.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-grass.png',
            stackable: true,
            maxStacks: 20,
            value: 15
        },
        {//flint
            
            name: "Flint",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-flint.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-flint.png',
            stackable: true,
            maxStacks: 20,
            value: 15
        },
    
    
    ];
    
    ig.recipes.getResult(ingredients) {
        var matchIngredient = function(match, data) {
            for(var i = 0, il = 
        };
    }
});