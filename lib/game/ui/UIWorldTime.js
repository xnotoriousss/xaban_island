ig.module(
	'game.ui.ui-world-time'
)
.requires(
	'plusplus.core.config',
    'plusplus.ui.ui-element',
	'plusplus.abilities.glow'
)
.defines(function(){ "use strict";

	var _c = ig.CONFIG;
	
	ig.UIWorldTime = ig.global.UIWorldTime = ig.UIElement.extend({
		
		animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'img/sunmoon.png', 50, 50),
				
		animInit: 'day',
		
		animSettings: {
			day: {
				frameTime: 0.5,
				sequence: [0]
			},
			night: {
				frameTime: 0.5,
				sequence: [1]
			},
		},
		
		minuteSpan: 1,
		hourSpan: 60,
		daySpan: 1440,
		
		timeInDay: 0,
		timeInMinutes: 840,
		timeInHours: 14,
		lastHour: 13,
		
		minuteDelay: 0.1,
		//minuteDelay: 0.833,
		minuteTimer: null,
		
		initProperties: function() {
			this.parent();
			
			this.minuteTimer = new ig.Timer();
		},
		
		pause: function() {
			this.parent();
			
			this.minuteTimer.pause();
		},
		
		unpause: function() {
			this.parent();
			
			this.minuteTimer.unpause();
		},
		
		update: function() {
			this.parent();
			
			if (!this.paused) {

                if (this.minuteTimer.delta() >= 0) {
						
                    this.minuteTimer.set(this.minuteDelay);

                    this.updateWorldTime();

                }
			}
		},
		
		updateWorldTime: function() {
			//reset time on a new day
			if(this.timeInMinutes >= this.daySpan){
				this.timeInDay++;
				this.timeInMinutes = 0;
				this.timeInHours = 0;
			}
			
			this.timeInMinutes++;
			ig.UIWorldTime.timeInMinutes = this.timeInMinutes;
			
			//increments hours of the day
			if(this.timeInMinutes / this.hourSpan >= this.timeInHours + 1)
			{
				this.timeInHours++;
				this.lastHour = this.timeInHours - 1;
				ig.UIWorldTime.timeInHours = this.timeInHours;
			}
			
			//check for night time and resets if alpha is not .9, the darkest,
			//also checks for other time of the day and remove old atmosphere
			if(this.checkNight() && ig.game.camera.atmosphereSettings.alpha != .9){
				ig.game.camera.removeAtmosphere(0);
				ig.game.camera.atmosphereSettings.alpha = .9;
				ig.game.camera.addAtmosphere(0);
			}else if(this.checkNight() && ig.game.camera.atmosphereSettings.alpha == .9){
				ig.game.camera.addAtmosphere(0);
			}else if(this.checkNight() == false){
				if(this.lastHour != this.timeInHours){
					ig.game.camera.removeAtmosphere(0);
				}
			}
			
			//handles morning transition to day
			if(this.checkMorning() && this.lastHour != this.timeInHours){
				ig.game.camera.atmosphereSettings.alpha -= .18;
				ig.game.camera.addAtmosphere(0);
				this.lastHour++;
			}
			
			//handles sunset transition to night
			if(this.checkSunset() && this.lastHour != this.timeInHours){
				ig.game.camera.atmosphereSettings.alpha += .18;
				ig.game.camera.addAtmosphere(0);
				this.lastHour++;
			}
			
			//handles day time
			if(this.checkDay()){
				ig.game.camera.atmosphereSettings.alpha = 0;	
			}
		},
		
		//checks minutes of the day
		checkDay: function(){
			if(960 >= this.timeInMinutes && this.timeInMinutes >= 480){
				if(this.currentAnim != this.anims.day)
					this.currentAnim = this.anims.day;
				return true;
			}
				
			return false;
		},
		
		//checks for minutes of the night
		checkNight: function(){
			if((1440 >= this.timeInMinutes && this.timeInMinutes >= 1200) || (240 >= this.timeInMinutes && this.timeInMinutes >= 0)){
				if(this.currentAnim != this.anims.night)
					this.currentAnim = this.anims.night;
				return true;
			}
			return false;
		},
		
		//checks for morning transition time
		checkMorning: function(){
			if(480 > this.timeInMinutes && this.timeInMinutes > 240)
				return true;
				
			return false;
		},
		
		//checks for night transition time
		checkSunset: function(){
			if(1200 > this.timeInMinutes && this.timeInMinutes > 960)
				return true;
				
			return false;
		}
	});
	
	ig.UIWorldTime.THRESHOLDS = {
		MORNING: 4,
		DAY: 8,
		SUNSET: 16,
		NIGHT: 20
	};
	
	ig.UIWorldTime.timeInMinutes;
	
	ig.UIWorldTime.timeInHours;
});
