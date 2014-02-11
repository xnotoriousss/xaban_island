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
	    ig.EntityGrass = ig.global.EntityGrass = ig.Character.extend(/**@lends ig.EntityCheckpoint.prototype */{
				
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

            performance: ig.EntityExtended.PERFORMANCE.STATIC,
            targetable: true,
            health: 1,
            healthMax: 1,
            regen: false,
            deathSettings: {
                spawnCountMax: _c.CHARACTER.EXPLODING_DEATH_PARTICLE_COUNT,
                spawnSettings: {
                    animTileOffset: ig.EntityParticleColor.colorOffsets.WHITE
                }
            },

            initTypes: function () {
                _ut.addType(ig.EntityExtended, this, 'type', "RESOURCE");

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

                ig.game.spawnEntity(ig.EntityExplosion, this.pos.x, this.pos.y, ig.merge({
                    size: { x: this.size.x, y: this.size.y }
                }, settings || this.damageSettings));

            },
			
		    onHarvest: function(){
				this.receiveDamage(1, this, true);
			},
			
			dropItem: function(name, amount){
				
				for(var i = 0; i < amount; i++) {
						var n2g = _i.n2g(name);
						var random = (Math.random()*10)-5;
						ig.game.spawnEntity(n2g, this.pos.x+random, this.pos.y+random);
				}
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
