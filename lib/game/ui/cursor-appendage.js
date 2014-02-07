ig.module('game.ui.cursor-appendage')

.requires(
    
)

.defines(function() { "use strict";
         
    ig.CursorAppendage = ig.global.CursorAppendage = ig.Class.extend({
        
        
        
        uiUpdate: function() {
            
        },
        
        uiDraw: function() {
            var ctx = ig.system.context;
            
            ctx.save();
            
            var color = 'rgb(255,255,255)';
            var text = entity.name,
                x = (entity.x + 8) * this.scale,
                y = (entity.y + entity.nameOffsetY) * this.scale,
                centered = true,
                color;
            
            var strokeSize;
        
            switch(this.scale) {
                case 1:
                    strokeSize = 3; break;
                case 2:
                    strokeSize = 3; break;
                case 3:
                    strokeSize = 5;
            }
            
            if(centered) {
                ctx.textAlign = "center";
            }
            ctx.strokeStyle = strokeColor || "#373737";
            ctx.lineWidth = strokeSize;
            ctx.strokeText(text, x, y);
            ctx.fillStyle = color || "white";
            ctx.fillText(text, x, y);
            ctx.restore();
            this.context.restore();
        }
        
    });
    
});