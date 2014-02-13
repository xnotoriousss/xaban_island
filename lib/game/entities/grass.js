ig.module(
        'game.entities.grass'
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
	    ig.EntityGrass = ig.global.EntityGrass = ig.EntityResources.extend(/**@lends ig.EntityCheckpoint.prototype */{
	    displayName: "Patch of Grass",
	    size: {x: 45, y: 45},
	    offset: {x: 0, y: 0},
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/grass.png', 45, 45),
				
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
            health: 1,
            healthMax: 1,
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
				this.parent(tool, damage);
			},
			
			dropItems: function(name, amount){
				this.parent(name,amount);
			},

            kill: function ( silent ) {
                this.parent( silent );

            },

            die: function () {
				this.dropItem("Grass", 3);
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
