/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
var slider = {};
slider.m = {};
slider.v = {};
slider.c = {};
slider.logLevel = 4;
slider.isIE = (navigator.appName.indexOf("Microsoft") != -1)?true:false;
slider.userAgent = navigator.userAgent.toLowerCase();
if(slider.userAgent.search("iphone") > -1 || slider.userAgent.search("ipad") > -1 || slider.userAgent.search("android") > -1){
	slider.isMobile = true;
}
	


slider.helpclick = function(msg){
	if(slider.v.puzzle) slider.v.puzzle.layoutmanager(msg);
};

slider.log = function(message, type){
	if(typeof(console) == 'undefined' || console == null || !slider.logLevel) return;
	try{
		if(type=="error")
			console.error("slider: "+message);
		else if(type=="warn" && slider.logLevel >= 2)
			console.warn("slider: "+message);
		else if(type=="info" && slider.logLevel >= 3)
			console.info("slider: "+message);
		else if(slider.logLevel >= 4)
			console.log("slider: "+message);
	}catch(e){
	}
};