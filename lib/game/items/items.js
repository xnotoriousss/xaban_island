ig.module('game.items.items')

.requires(
    'plusplus.helpers.utils',
    
    'game.items.ground-item',
    
    'game.entities.campfire',
    'game.entities.tent'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.items = {};
    
    ig.items.data = [
        
        //Basic Tools/Weapons
        {//axe
            
            name: "Axe",
            
            spriteSize: {x: 24, y: 24},
            spriteOffset: {x: 4, y: 6},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-axe.png',
            iconSize: {x: 24, y: 24},
            iconOffset: {x: 4, y: 6},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-axe.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: "weapon"    
                },
                durability: 100,
                weapon: {
                    type: "melee",
                    damage: 20,
                    duraLoss: 4
                },
                tool: {
                    type: "axe",
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
        {//pickaxe
            
            name: "Pickaxe",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-pickaxe.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-pickaxe.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: "weapon"
                },
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
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-shovel.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-shovel.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: "weapon"
                },
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
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-spear.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-spear.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: "weapon"
                },
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
        {//flatpack campfire
            name: "Flatpack Campfire",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-campfire.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-campfire.png',
            stackable: false,
            maxStacks: 1,
            value: 35,
            itemComponents: {
                use: "build",
                build: {
                    type: ig.EntityCampfire
                }
            }
        },
        {//torch
            name: "Torch",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-torch.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-torch-icon.png',
            stackable: false,
            maxStacks: 1,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: "weapon"
                },
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
            },
            entityComponents: {
                light: { 
                    range: 5 //radius
                },
                heat: {
                    range: 5, //provides heat in vicinity
                    temperature: 100, //threshold
                    tempGain: .1, //persecond gain temp if within threshold
                    cookable: false //cant cook shit with a torch
                }
            },
            entitySettings: {
                glowSettings: {
                    sizeMod: 3,
                    // these directly correlate
                    // to ig.Entity light properties
                    light: {
                        r: 1,
                        g: 0.85,
                        b: 0.7,
                        // cast shadows only on static entities
                        castsShadows: false
                    }
                }
            }
        },
        
        //Shelter (a bit iffy components, check em out)
        {//tent
            name: "Flatpack Tent",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-tent.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-tent.png',
            stackable: false,
            maxStacks: 1,
            value: 50,
            itemComponents: {
                use: "build",
                build: {
                    type: ig.EntityTent
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
            itemComponents: {
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
    
    ig.items.g2i = function(groundItem) {
        return ig.items.n2i(groundItem.displayName);
    };
    
    ig.items.i2g = function(inventoryItem) {
        return ig.items.n2g(inventoryItem.displayName);
    };
    
    ig.items.n2i = function(name) {
        return new ig.InventoryItem(ig.items.n2s_i(name));
    };
    
    ig.items.n2g = function(name) {
        return new ig.GroundItem(0,0,ig.items.n2s_g(name));
    };
    
    ig.items.n2s_i = function(name) {
        var data = ig.items.getDataFromName(name);
        
        var settings = {
            size: data.iconSize,
            offset: data.iconOffset,
            animSheetPath: data.iconPath,
            animSheetWidth: data.iconFrameSize.x,
            animSheetHeight: data.iconFrameSize.y,
            displayName: data.name,
            stackable: data.stackable,
            stacks: 1,
            maxStacks: data.maxStacks,
            value: data.value,
            components: data.itemComponents
            
        };
        
        return settings;
    };
    
    ig.items.n2s_g = function(name) {
        var data = ig.items.getDataFromName(name);
        
        var settings = {
            size: data.spriteSize,
            offset: data.spriteOffset,
            animSheetPath: data.spritePath,
            animSheetWidth: data.spriteFrameSize.x,
            animSheetHeight: data.spriteFrameSize.y,
            displayName: data.name,
            stackable: data.stackable,
            stacks: 1,
            maxStacks: data.maxStacks,
            value: data.value,
            components: data.entityComponents,
            settings: data.entitySettings
        };
        
        return settings;
    };
    
    ig.items.getDataFromName = function(name) {
        return ig.items.data[_ut.indexOfProperty(ig.items.data, "name", name)];
    };
});
