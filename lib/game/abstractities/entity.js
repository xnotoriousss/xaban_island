ig.module('game.abstractities.entity')

.requires(
	'game.items.items',
	
    'plusplus.core.entity'
)
    
.defines(function () {
    "use strict";

    ig.EntityExtended.inject({
		displayName: "default_string",
		
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
