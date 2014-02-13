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
	    ig.EntityTree = ig.global.EntityTree = ig.EntityExtended.extend(/**@lends ig.EntityCheckpoint.prototype */{
            layerName: 'resources',

            performance: ig.EntityExtended.PERFORMANCE.STATIC,
            targetable: true,
            health: 100,
            healthMax: 100,
            regen: false,
            deathSettings: {
                spawnCountMax: _c.CHARACTER.EXPLODING_DEATH_PARTICLE_COUNT,
                spawnSettings: {
                    animTileOffset: ig.EntityParticleColor.colorOffsets.GREEN
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
			
		    onHarvest: function(tool, damage){
                //if player has this tool equipped
				this.receiveDamage(damage, this, true);
			},
			
			dropItems: function(name, amount){
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
