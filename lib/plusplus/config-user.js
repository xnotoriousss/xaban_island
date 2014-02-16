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
            FORCE_ENTITY_EXTENDED: false,
            AUTO_SORT_LAYERS: true,
            
            // top down configuration
            TOP_DOWN: true,
            ENTITY: {
                CAN_FLIP_X: true,
                CAN_FLIP_Y: false,
            },
            CREATURE: {
                REACTION_DISTANCE: 100,
                REACTION_DELAY: .5,
                CAN_WANDER_X: true,
                CAN_WANDER_Y: true,
                CAN_FLEE: true,
                FLEE_HEALTH_PCT: 0.15,
                CAN_LEARN_PREDATORS: false,
                NEEDS_LINE_OF_SIGHT_PREY: true,
                PREDATOR_FROM_DAMAGE: true,
                NEEDS_LINE_OF_SIGHT_PREDATOR: true,
                WANDER_SWITCH_CHANCE: .05,
                WANDER_SWITCH_CHANCE_STOPPED: .1,
                MOVE_TO_WANDER_SETTINGS: {
                    simple: true,
                    avoidUngrounded: false,
                    avoidSlopes: false
                  }
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
                
                IGNORE_SYSTEM_SCALE: false
            },
            
            UI: {
                SCALE: 3,
                IGNORE_SYSTEM_SCALE: false
            },
        };
    });
