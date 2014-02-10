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
	    ig.EntityTree = ig.global.EntityTree = ig.Character.extend(/**@lends ig.EntityCheckpoint.prototype */{
				
	    displayName: 'tree',
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

            performance: ig.EntityExtended.PERFORMANCE.STATIC,
            targetable: true,
            health: 100,
            healthMax: 100,
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
				this.receiveDamage(50, this, true);
			},
			
			dropItem: function(name, amount){
				var n2g = _i.n2g(name);
				ig.log(amount);
				for(var i = 0; i < amount; i++) {
						ig.log(amount);
						var random = (Math.random()*10)-5;
						ig.game.spawnEntity(n2g, this.pos.x+random, this.pos.y+random);
						ig.log('check');
				}
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
				ig.log(this.health);
				this.parent();

            },
            updateCurrentAnim: function () {
				return this.parent();
			}

        });

    });
