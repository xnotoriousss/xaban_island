ig.module(
        'plusplus.config-user'
    )
    .defines(function () {

        /**
         * User configuration of Impact++.
         * <span class="alert alert-info"><strong>Tip:</strong> it is recommended to modify this configuration file!</span>
         * @example
         * // in order to add your own custom configuration to Impact++
         * // edit the file defining ig.CONFIG_USER, 'plusplus/config-user.js'
         * // ig.CONFIG_USER is never modified by Impact++ (it is strictly for your use)
         * // ig.CONFIG_USER is automatically merged over Impact++'s config
         * @static
         * @readonly
         * @memberof ig
         * @namespace ig.CONFIG_USER
         * @author Collin Hover - collinhover.com
         **/
        ig.CONFIG_USER = {
            
            // top down configuration
            TOP_DOWN: true,
            ENTITY: {
                CAN_FLIP_X: true,
                CAN_FLIP_Y: false,
            },
            CREATURE: {
                CAN_WANDER_X: true,
                CAN_WANDER_Y: true
            },
            
            GAME_WIDTH_PCT: 1,
            GAME_HEIGHT_PCT: 1,
            
            GAME_WIDTH_VIEW: 900,
            GAME_HEIGHT_VIEW: 300,
            
            SCALE_MIN: 1,
            SCALE_MAX: 4,
            
            CAMERA: {
                KEEP_CENTERED: false,
                LERP: 0.025,
                
                BOUNDS_TRAP_AS_PCT: true,
                BOUNDS_TRAP_PCT_MINX: -0.2,
                BOUNDS_TRAP_PCT_MINY: -0.3,
                BOUNDS_TRAP_PCT_MAXX: 0.2,
                BOUNDS_TRAP_PCT_MAXY: 0.3,
                
                KEEP_INSIDE_LEVEL: true
            },
            
            FONT: {
                MAIN_NAME: "font_04b03_white_16.png",
                ALT_NAME: "font_04b03_white_8.png",
                CHAT_NAME: "font_04b03_black_8.png",
                
                IGNORE_SYSTEM_SCALE: true
            },
            
            UI: {
                SCALE: 1,
                IGNORE_SYSTEM_SCALE: true
            },
        };
    });