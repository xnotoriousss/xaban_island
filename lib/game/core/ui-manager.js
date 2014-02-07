ig.module('plusplus.core.ui-manager')
    
.requires(
    'plusplus.core.config',
    'plusplus.core.entity',
    'plusplus.helpers.utils',
    'plusplus.helpers.utilsmath'
)
    
.defines(function () { "use strict";

    var _c = ig.CONFIG;
    var _ut = ig.utils;
    var _utm = ig.utilsmath;

    ig.UIManager = ig.global.UIManager = ig.Class.extend({
        
        components: [],
 
        /**
         * Initializes manager.
         * @param {Object} settings settings that correspond to manager properties
         */
        init: function (settings) {
 
            ig.merge( this, settings );
 
            this.onManageStarted = new ig.Signal();
            this.onManageStopped = new ig.Signal();
 
        },
 
        /**
         * Sets manager as ready. Called automatically at end of {@link ig.GameExtended#buildLevel}.
         **/
        ready: function () {
 
        },
 
        /**
         * Resets manager.
         */
        reset: function () {
 
            this.onManageStarted.removeAll();
            this.onManageStarted.forget();
 
            this.onManageStopped.removeAll();
            this.onManageStopped.forget();
 
            this.manageReleaseFallback();
            this.manageRelease();
 
        },
 
        /**
         * Manages an entity by calling {@link ig.PlayerManager#manageStart} if valid new entity, or {@link ig.PlayerManager#manageRelease} if no entity passed.
         * @param {ig.EntityExtended} [entity] entity to start managing, or none if should stop managing.
         */
        manage: function ( entity ) {
 
            if ( this.entity !== entity ) {
 
                this.manageRelease();
 
                if ( entity instanceof ig.EntityExtended ) {
 
                    this.manageStart( entity );
 
                }
 
            }
 
        },
 
        /**
         * Sets a fallback entity to manage when no other entities to manage.
         * @param {ig.EntityExtended} [entity] entity to set as fallback
         */
        manageFallback: function ( entity ) {
 
            if ( this.entityFallback !== entity ) {
 
                this.entityFallback = entity;
 
                if ( !this.entity ) {
 
                    this.manage( entity );
 
                }
 
            }
 
        },
 
        /**
         * Special case for managing player.
         */
        managePlayer: function () {
 
            var player = ig.game.getPlayer();
 
            if ( player && this.entity !== player ) {
 
                this.manageRelease();
                this.manageFallback( player );
 
                player.onRemoved.add( this.manageReleaseFallback, this );
                player.onAdded.add( this.managePlayer, this );
 
            }
 
        },
 
        /**
         * Starts managing entity, attempts to call entity's "manageStart" method, and dispatches {@link ig.PlayerManager#onManageStarted}.
         * <span class="alert"><strong>IMPORTANT:</strong> do not call this method directly, use {@link ig.PlayerManager#manage}. It is okay to override this method.</span>
         * @param {ig.EntityExtended} entity entity to manage.
         */
        manageStart: function ( entity ) {
 
            this.entity = entity;
            this.entity.onRemoved.addOnce( this.manageRelease, this );
 
            if ( typeof entity.manageStart === 'function' ) {
 
                entity.manageStart();
 
            }
 
            this.onManageStarted.dispatch( entity );
 
        },
 
        /**
         * Releases management by calling {@link ig.PlayerManager#manageStop} if currently managing an entity.
         * @param {ig.EntityExtended} [entity] entity to release, or if none passed releases currently managed entity.
         */
        manageRelease: function ( entity ) {
 
            if ( ( !entity && this.entity ) || ( entity && this.entity === entity ) ) {
 
                this.manageStop();
 
            }
 
        },
 
        /**
         * Stops managing fallback entity.
         * @param {ig.EntityExtended} [entity] entity to release, or if none passed releases fallback entity.
         */
        manageReleaseFallback: function ( entity ) {
 
            if ( ( !entity && this.entityFallback ) || ( entity && this.entityFallback === entity ) ) {
 
                if ( this.entity === this.entityFallback ) {
 
                    this.manageRelease();
 
                }
 
                this.entityFallback = null;
 
            }
 
        },
 
        /**
         * Stops managing entity, attempts to call entity's "manageStop" method, and dispatches {@link ig.PlayerManager#onManageStopped}.
         * <span class="alert"><strong>IMPORTANT:</strong> do not call this method directly, use {@link ig.PlayerManager#manageRelease}. It is okay to override this method.</span>
         */
        manageStop: function () {
 
            var entity = this.entity;
 
            entity.onRemoved.remove( this.manageRelease, this );
 
            this.entity = null;
 
            if ( typeof entity.manageStop === 'function' ) {
 
                entity.manageStop();
 
            }
 
            this.onManageStopped.dispatch( entity );
 
        },
 
        /**
         * Attempts to highlight managed entity if the entity has a "highlight" animation.
         */
        highlightManaged: function () {
 
            if ( this.entity && !this.entity._killed && this.entity.currentAnim == this.entity.anims[ this.entity.getDirectionalAnimName( "idle" ) ] ) {
 
                this.entity.animOverride( this.entity.getDirectionalAnimName( "highlight" ) );
 
            }
 
        },
 
        update: function () {
            
        },

        draw: function() {
            var i, il;
            for(i = 0, il = this.components.length; i < il; i++) {
                this.component.uiDraw();
            }
        }
    });
});