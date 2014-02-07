ig.module('game.abstractities.entity')

.requires(
    'plusplus.core.entity'
)
    
.defines(function () {
    "use strict";

    ig.EntityExtended.inject({
		displayName: "default_string"
    });
});
