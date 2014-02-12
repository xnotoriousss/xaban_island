ig.module('game.entities.tent')

.requires(
    'plusplus.core.config',
    'plusplus.core.entity',
    'plusplus.entities.explosion',
	'plusplus.abstractities.character'
)
    
.defines(function () {

    var _c = ig.CONFIG;
    var _ut = ig.utils;
        
	ig.EntityTent = ig.global.EntityTent = ig.Character.extend(/**@lends ig.EntityCheckpoint.prototype */{
		
	    displayName: "Tent",
	    size: {x: 62, y: 100},
	    offset: {x: 17, y: 14},
        
        components: {
        },
	    
	    animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/tent.png', 96, 128),
	
		animInit: "idleX",
        
        animSettings: {
            idleX: {
                frameTime: 1,
                sequence: [0]
            }
        },

        performance: ig.EntityExtended.PERFORMANCE.STATIC,
		collides: ig.EntityExtended.COLLIDES.FIXED,
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
            _ut.addType(ig.EntityExtended, this, 'type', "STATION");
        },

        initProperties: function () {
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

        kill: function ( silent ) {
            this.parent( silent );
        },

        die: function () {
			this.dropItems("Stick", 2);
			this.dropItems("Grass", 2);
			this.parent();
        },
    });
});
