ig.module(
        'game.entities.tree'
    )
    .requires(
        'plusplus.core.config',
        'plusplus.core.entity',
        'plusplus.entities.explosion',
		'plusplus.abstractities.character',
		'game.items.items'
		
    )
    .defines(function () {

        var _c = ig.CONFIG;
        var _ut = ig.utils;
		var _i = ig.items;
	    ig.EntityTree = ig.global.EntityTree = ig.EntityResources.extend(/**@lends ig.EntityCheckpoint.prototype */{
	    displayName: "tree",
        	collides: ig.EntityExtended.COLLIDES.FIXED,
	    size: {x: 49, y: 50},
	    offset: {x: 0, y: 0},
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/tree.png', 49, 50),
				
				animInit: "idleX",
				animSettings: {
					idleX: {
						frameTime: 0.5,
						sequence: [0]
					},
					idleUp: {
						frameTime: 0.5,
						sequence: [0]
					},
					idleDown: {
						frameTime: 0.5,
						sequence: [0]
					},
					moveX: {
						frameTime: 0.07,
						sequence: [0]
					},
					moveDown: {
						frameTime: 0.07,
						sequence: [0]
					},
					moveUp: {
						frameTime: 0.07,
						sequence: [0]
					},
				},
            health: 100,
            healthMax: 100,
            regen: false,

            initTypes: function () {
				this.parent();

            },

            initProperties: function () {

                this.parent();
            },

            resetExtras: function () {

                this.parent();
				},

			placeholdAnims: function () {

                this.parent()
			},
            spawn: function () {

                this.parent();

            },

            pause: function () {

                this.parent();

            },

            unpause: function () {

                this.parent();

            },

            receiveDamage: function (amount, from, unblockable) {

                return this.parent(amount, from, unblockable);

            },

            explode: function (settings) {

                this.parent(settings);

            },
			
		    onHarvest: function(tool, damage){
				//if player is using tool
				this.parent(tool, damage);
			},
			
			dropItems: function(name, amount){
				this.parent(name,amount);
			},

            kill: function ( silent ) {
                this.parent( silent );

            },

            die: function () {
				this.dropItem("Stick", 3);
				this.parent();

            },

            cleanup: function () {
                this.parent();

            },

            updateVisible: function () {
				this.parent();

            },
            updateCurrentAnim: function () {
				return this.parent();
			}

        });

    });
