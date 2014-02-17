ig.module('game.abstractities.character')

.requires(
    'plusplus.abstractities.character'
)
    
.defines(function () {
    "use strict";

    ig.Character.inject({
		displayName: null,
		
		components: {},
		
		addComponent: function(comp) {
			this.components.push(comp);
		},
		
		removeComponent: function() {
			
		},
		
		getComponent: function(name) {
			return this.components[name];
		},
		
		dropItems: function(name, amount) {
				
			ig.log(amount);
			for(var i = 0; i < amount; i++) {
				var n2g = _i.n2g(name);
				var random = (Math.random()*10)-5;
				ig.game.spawnEntity(n2g, this.pos.x+random, this.pos.y+random);
			}
		},
    });
});
