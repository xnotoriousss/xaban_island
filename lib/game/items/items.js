ig.module('game.items.items')

.requires(
    'plusplus.helpers.utils'
)

.defines(function () { "use strict";
    var _ut = ig.utils;
    
    ig.items = {};
    
    ig.items.TOOLTYPES = {
        NONE: 0,
		WOODCUTTING: 1,
		MINING: 2,
		DIGGING: 3,
		HEAT: 4
	};
    
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
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
                        damage: 20,
                        duraLoss: 4
                    },
                    tool: {
                        type: ig.items.TOOLTYPES.WOODCUTTING,
                        damage: 20,
                        duraLoss: 4
                    },
                    tossable: {
                        range: 15,
                        speed: 3,
                        damage: 20
                    }
                },
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
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
                        damage: 20,
                        duraLoss: 4
                    },
                    tool: {
                        type: ig.items.TOOLTYPES.MINING,
                        damage: 20,
                        duraLoss: 4
                    },
                    tossable: {
                        range: 15,
                        speed: 3,
                        damage: 20
                    }
                },
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
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
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
                },
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
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
                        damage: 100,
                        duraLoss: 4
                    },
                    tossable: {
                        range: 30,
                        speed: 10,
                        damage: 35
                    }
                },
            }
        },
		{//leash
            name: "Leash",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-leash.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-leash.png',
            stackable: false,
            maxStacks: 1,
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
                        damage: 0,
                        duraLoss: 0
                    },
                    tool: {
                        type: "leash", 
                        duraLoss: 100
                    },
                },
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
			unbreakable: true,
            value: 35,
            itemComponents: {
                use: "build",
                build: {
                    resultName: "Campfire"
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
			unbreakable: false,
            value: 15,
            itemComponents: {
                use: "equip",
                equip: {
                    slot: 'weapon',
                    melee: {
                        damage: 5,
                        duraLoss: 4
                    },
                    tool: {
                        type: ig.items.TOOLTYPES.HEAT,
                        duraLoss: 1
                    },
                    tossable: {
                        range: 15,
                        speed: 5,
                        damage: 5
                    },
					entitySettings: {
						components: {
							heat: {
								baseRadius: 32,
								adjustedRadius: 32, 
								regenModifier: 0.75
							},
						},
						glowSettings: {
							sizeMod: 2,
							light: {
								r: 1,
								g: 0.85,
								b: 0.7,
								alpha: 0.25,
								castsShadows: false
							}
						}
					}
                },
            },
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
			unbreakable: true,
            value: 50,
            itemComponents: {
                use: "build",
                build: {
                    resultName: "Tent"
                }
            }
        },
		{//flatpack forge
            name: "Flatpack Forge",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-forge.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-forge.png',
            stackable: false,
            maxStacks: 1,
			unbreakable: true,
            value: 75,
            itemComponents: {
                use: "build",
                build: {
                    resultName: "Forge"
                }
            }
        },
        
        //Food (solid components imo, might need renaming)
        {//meat
            name: "Meat",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-meat.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-meat.png',
            stackable: true,
            maxStacks: 10,
			unbreakable: true,
            value: 15,
            itemComponents: {
                use: "eat",
                transfer: {
                    fire: {
                        fireTransfer: "cook",
                        cook: {
                            resultName: "Cooked Meat",
                            time: 5
                        }
                    }
                },
                eat: {
                    hungerValue: 5,
                    healingValue: -5
                }
            }
        },
        {//cooked meat
            name: "Cooked Meat",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-meat.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-meat.png',
            stackable: true,
            maxStacks: 10,
			unbreakable: true,
            value: 15,
            itemComponents: {
                use: "eat",
                eat: {
                    hungerValue: 15,
                    healingValue: 5
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
			unbreakable: true,
            value: 15,
            itemComponents: {
                transfer: {
                    fire: {
                        fireTransfer: "fuel",
                        fuel: {
                            healing: 20
                        }
                    }
                }
            }
        },
        {//stone
            
            name: "Stone",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-stone.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-stone.png',
            stackable: true,
            maxStacks: 10,
			unbreakable: true,
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
			unbreakable: true,
            value: 15,
            itemComponents: {
                transfer: {
                    fire: {
                        fireTransfer: "fuel",
                        fuel: {
                            healing: 10
                        }
                    }
                }
            }
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
			unbreakable: true,
            value: 15,
            itemComponents: {
                transfer: {
                    fire: {
                        fireTransfer: "fuel",
                        fuel: {
                            healing: 5
                        }
                    }
                }
            }
        },
        {//flint
            
            name: "Flint",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-flint.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-flint.png',
            stackable: true,
            maxStacks: 20,
			unbreakable: true,
            value: 15
        },
        {//iron
            
            name: "Iron",
            
            spriteSize: {x: 32, y: 32},
            spriteOffset: {x: 0, y: 0},
            spriteFrameSize: {x: 32, y: 32},
            spritePath: 'img/item-flint.png',
            iconSize: {x: 32, y: 32},
            iconOffset: {x: 0, y: 0},
            iconFrameSize: {x: 32, y: 32},
            iconPath: 'img/item-flint.png',
            stackable: true,
            maxStacks: 5,
			unbreakable: true,
            value: 15
        }
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
        return new ig.EntityGroundItem(0,0,ig.items.n2s_g(name));
    };
    
    ig.items.n2s_i = function(name) {
        var data = ig.items.getDataFromName(name);
        
        var settings = {
            size: data.iconSize,
            offset: data.iconOffset,
            iconPath: data.iconPath,
            displayName: data.name,
            stackable: data.stackable,
            stacks: 1,
            maxStacks: data.maxStacks,
			unbreakable: data.unbreakable,
			durability: 100,
            value: data.value,
            components: data.itemComponents,
			entitySettings: data.entitySettings
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
			unbreakable: data.unbreakable,
			durability: 100,
            value: data.value,
            components: data.entityComponents,
			entitySettings: data.entitySettings
        };
        
        return settings;
    };
    
    ig.items.getDataFromName = function(name) {
        return ig.items.data[_ut.indexOfProperty(ig.items.data, "name", name)];
    };
});
