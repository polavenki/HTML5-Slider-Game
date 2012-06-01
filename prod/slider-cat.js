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
/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
	
	s.c.sliderSize = 4;
	
	s.c.isMovelLegal = function(x, y){
		var retValue = {"isLegal" : false};
		if(s.m.emptyRef["x"]===x && s.m.emptyRef["y"]!==y){
			retValue = {"isLegal" : true , "direction" : "y" , "displacement" : s.m.emptyRef["y"]-y};
		}else if(s.m.emptyRef["y"]===y && s.m.emptyRef["x"]!==x){
			retValue = {"isLegal" : true , "direction" : "x" , "displacement" : s.m.emptyRef["x"]-x};
		}
		return retValue;
	};
	
	s.c.swap = function(source, direction , displacement){
		var noOfIterations,previousEmptyRef;
		noOfIterations = (displacement<0) ? displacement * -1  : displacement;
		previousEmptyRef = {"x" : s.m.emptyRef["x"] , "y" : s.m.emptyRef["y"]};
			
		for(var i = 0 , x = tempx = s.m.emptyRef["x"] , y = tempy = s.m.emptyRef["y"] ; i <= noOfIterations ; i++){
			s.m.state[tempx][tempy] = s.m.state[x][y];
			tempx = x;
			tempy = y;
			if(direction==="y"){
				y = (displacement<0) ? y +1  : y -1; 
			}else{
				x = (displacement<0) ? x +1  : x -1;
			}
		}
		// Updating game state in model
		s.m.emptyRef["x"] = source["x"];
		s.m.emptyRef["y"] = source["y"];
		s.m.state[source["x"]][source["y"]] = s.m.emptyTile;
		
		// Swap the tiles in the UI
		s.v.puzzle.swapTiles(previousEmptyRef ,direction , displacement);
	
		(s.m.state.join()===s.m.solution.join()) && alert("You won the game !!!");
		
	};
	
})(window,slider);
/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){

	s.m.emptyTile = "tile10";
	s.m.tileSize = 160;
	s.m.emptyRef = {"x" : 1 , "y" : 0};
	s.m.state =	[["tile00","tile01","tile02","tile03"],
	               ["tile10","tile11","tile12","tile13"],
	               ["tile20","tile21","tile22","tile23"],
	               ["tile30","tile31","tile32","tile33"]];
	
	s.m.solution = [["tile33","tile32","tile01","tile23"],
		               ["tile21","tile00","tile12","tile11"],
		               ["tile31","tile02","tile30","tile22"],
		               ["tile13","tile20","tile03","tile10"]];
	
})(window,slider);
/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
	var Box = function(){
		
		this.placeHolder = s.v.getEl("slider");
		this.sourceHolder = s.v.getEl("source_holder");
		this.solutionHolder = s.v.getEl("solution_holder"); 
		var offsetLeft = this.placeHolder.offsetLeft;
		var offsetTop = this.placeHolder.offsetTop;
		this.previewDrag = s.v.getEl("previewDrag");
		this.isDragged = false;
		var self = this;
		this.paintPuzzle = function(){
			
			// Paint the puzzle by reading the state from model 
			
			self.placeHolder.innerHTML = "";
			self.previewDrag.innerHTML = "";
			
			var puzzleFrag = document.createDocumentFragment(),
				solutinFrag = document.createDocumentFragment();
			
			for(var i = 0 ; i < s.c.sliderSize ; i++){
				
				
				for(var j = 0 ; j < s.c.sliderSize ; j++){
					var ele = s.v.createEl("div", { id : "box"+i+j , className : "tile "+s.m.state[i][j]+" floatleft" }),
						ele1 = s.v.createEl("div", { className : "tile "+s.m.solution[i][j]+" floatleft" });;
					
					s.v.addHandler(ele, "click",function(x,y){
						return function(){
							s.log("isDragged="+self.isDragged,"info");
							if(self.isDragged && !s.isMobile){
								self.isDragged = false;
								return;
							}
							var data = s.c.isMovelLegal(x,y);
							(data["isLegal"]===true) && s.c.swap({"x" : x , "y" : y} , data["direction"], data["displacement"]);  
						};	
					}(i,j));  // Adding the click listener

					self.makeDraggable(ele, {"x" : i ,"y" :j}); // Making tile as draggable only if the tile can be legally movable
					puzzleFrag.appendChild(ele);
					solutinFrag.appendChild(ele1);
				}
			}
			
			self.placeHolder.appendChild(puzzleFrag);
			self.solutionHolder.appendChild(solutinFrag);
			
		};
		
		this.swapTiles = function(targetCords , direction , displacement){
			self.previewDrag.innerHTML = "";
			var noOfTilesToMove = (displacement < 0) ? (displacement * -1) : displacement;
			for(var i = 0 , x = targetCords["x"] , y = targetCords["y"]; i <= noOfTilesToMove ; i++){
				var ref = s.v.getEl("box"+x+y);
				ref.className = "tile "+s.m.state[x][y]+" floatleft";
				if(direction==="y"){
					y = (displacement<0) ? y +1  : y -1; 
				}else{
					x = (displacement<0) ? x +1  : x -1;
				}
			}
		};

		
		this.makeDraggable = function(tile , dragData){

			var clone = null, actualDistance = 0 , draggedDistance =0 , swapInfo ={},lowx = 0 ,lowy =0  , upperx=0 , uppery=0;
			new s.v.Drag(tile, function(eventName, coOrdinates , eventData){
				if(eventName == "dragstart"){
					clone = s.v.createEl("div", {"className": "buddy_drag_clone"});
					var noOfTilesToMove  = swapInfo["displacement"] , tempx = dragData["x"],  tempy = dragData["y"];
					noOfTilesToMove = (swapInfo["displacement"] < 0) ? swapInfo["displacement"] * -1 : swapInfo["displacement"];
					var clickedEle = document.getElementById('box'+dragData['x']+dragData['y']),
						emptyEle = document.getElementById('box'+s.m.emptyRef["x"]+s.m.emptyRef["y"]);
					if(swapInfo["direction"]==="y"){
						clone.style.width = (noOfTilesToMove * s.m.tileSize) + "px";
						lowx = clickedEle.offsetTop; upperx = lowx+clickedEle.offsetHeight;
						if(swapInfo["displacement"] < 0 ){
							tempx = s.m.emptyRef["x"];
							tempy = s.m.emptyRef["y"]+1; 
							uppery = clickedEle.offsetLeft + clickedEle.offsetWidth; lowy = emptyEle.offsetLeft;
						}else{
							uppery = emptyEle.offsetLeft + emptyEle.offsetWidth; lowy = clickedEle.offsetLeft;
						}
					}else{
						clone.style.width = s.m.tileSize + "px";
						lowy = clickedEle.offsetLeft; uppery = lowy+clickedEle.offsetWidth;
						if(swapInfo["displacement"] < 0 ){
							tempx = s.m.emptyRef["x"]+1;
							tempy = s.m.emptyRef["y"];
							upperx = clickedEle.offsetTop + clickedEle.offsetHeight; lowx = emptyEle.offsetTop;
						}else{
							upperx = emptyEle.offsetTop + emptyEle.offsetHeight ; lowx = clickedEle.offsetTop;
						}
						
					}
					s.log("lowx ="+lowx+" upperx="+upperx+" lowy="+lowy+" uppery="+uppery);
					for(var i = 0 ; i < noOfTilesToMove ; i++){
						var ele = s.v.createEl("div", {className : "tile "+s.m.state[tempx][tempy]+" floatleft" });
						clone.appendChild(ele);
						if(swapInfo["direction"]==="y")	tempy++; 
						else tempx++;
					}
					self.previewDrag.appendChild(clone);
					actualDistance = findDistance({"x" : getTileMiddleCoordinate(dragData["x"]) ,"y" : getTileMiddleCoordinate(dragData["y"]) } , {"x" : getTileMiddleCoordinate(s.m.emptyRef["x"]) ,"y" : getTileMiddleCoordinate(s.m.emptyRef["y"]) }); 
				}else if(eventName == "drag"){
					s.log("x="+coOrdinates.lastY+" y="+coOrdinates.lastX);
					if(coOrdinates.lastX >= lowy && coOrdinates.lastX <= uppery && coOrdinates.lastY >= lowx && coOrdinates.lastY <=upperx){
						self.isDragged = true;
						clone.style.left = (coOrdinates.lastX + 5) +"px";
						clone.style.top = (coOrdinates.lastY + 5) +"px";
						clone.style.visibility = "visible";
					}else{
						clone.style.visibility = "hidden";
					}
					
				}else if(eventName == "dragend"){
					if(!eventData["droppedOnMySelf"]) self.isDragged = false; // If drop is happened on some other target then onclick of source won't be triggered. So resetting the flag
					draggedDistance = findDistance({"x" : getTileMiddleCoordinate(dragData["x"]) ,"y" : getTileMiddleCoordinate(dragData["y"]) } , {"x" : coOrdinates.lastY - offsetTop ,"y" : coOrdinates.lastX - offsetLeft}); 
					s.log("actual ="+actualDistance + " draggedDistance="+draggedDistance);
					 if(draggedDistance > (actualDistance/2) && clone.style.visibility == "visible"){  // Allowing only if it is dropped in board and more than halfway
						 s.log("Drag criteria is obeyed");
						 self.isDragged = false;
						var data = s.c.isMovelLegal(dragData["x"],dragData["y"]);
						(data["isLegal"]===true) && s.c.swap({"x" : dragData["x"] , "y" : dragData["y"]} , data["direction"], data["displacement"]);
					}else{
						self.previewDrag.removeChild(clone);	
					}
				}else if(eventName == "dragcancel"){
					self.previewDrag.removeChild(clone);
				}
			}, document, dragData,function(){
				swapInfo = s.c.isMovelLegal(dragData["x"],dragData["y"]); 
				return swapInfo["isLegal"];
			});
			
		};
		
		this.layoutmanager = function(msg){
			switch(msg){
			case "source":
				s.v.removeClass(self.sourceHolder,"hide");
				s.v.addClass(self.placeHolder,"hide");
				s.v.addClass(self.solutionHolder,"hide");
				break;
			case "game":
				s.v.removeClass(self.placeHolder,"hide");
				s.v.addClass(self.sourceHolder,"hide");
				s.v.addClass(self.solutionHolder,"hide");
				break;
			case "solution":
				s.v.removeClass(self.solutionHolder,"hide");
				s.v.addClass(self.placeHolder,"hide");
				s.v.addClass(self.sourceHolder,"hide");
				break;
			}
		};
		
		var findDistance = function(from,to){
			var x1 = to["y"] ,
				y1 = to["x"],
				x2 = from["y"],
				y2 = from["x"];
				distance = Math.sqrt(((x2-x1) * (x2-x1)) + (y2-y1) * (y2-y1));
		
			s.log("empty x="+x1 +" empty y="+y1 );
			s.log("source x="+x2 +" source y="+y2 );
			
				
			return (distance < 0 ? distance * -1 : distance); 
		};
		
		var getTileMiddleCoordinate = function(coord){
			return (coord * s.m.tileSize) + (s.m.tileSize/2);
		};
	};
	
	s.v.Box = Box;
	
	
})(window,slider);
/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
(function(w, s) {
	
	var Drag = function(ele, callback, contextDoc, dragData , amIDraggable){
	
		var self = this;
		this.callback = callback;
		this.ele = ele;
		this.doc = contextDoc || w.document;
		this.dragStarted = false;
		this.mouseIsDown = false;
		this.dragSourceId = null;
		this.dropTargetId = null;
		this.dragData = dragData;
		this.dragThreshold = 5;	//mouse should move minimum this distance before we declare drag.
		
		
		var getTargetId = function(e) {
			var id;
			if (e.touches && e.touches.length) { 
				id = e.touches[0].target.id;
			} else {
				id = (e.target || e.srcElement).id;
			}
			return id;
		};
		
		var getCoors = function(e) {
			var coors = [];
			if (e.touches && e.touches.length) { 
				coors[0] = e.touches[0].clientX;
				coors[1] = e.touches[0].clientY;
			} else {
				coors[0] = e.clientX;
				coors[1] = e.clientY;
			}
			
			return coors;
		};
		
		
		this.touchHandler = function(event){
			var touches = event.changedTouches;
			if(touches.length > 1){
				return false; // No need to react upon multi touch.
			} 
			switch(event.type){
				case "touchstart" :  self.onMouseDown(event); break;
				case "touchmove"  :  self.onMouseMove(event); break;	
				case "touchend"  :  self.onMouseUp(event); break;
				case "touchcancel"  : self.onMouseUp(event,true); break;
			} 
		};
		
		
		this.onMouseDown = function(e){
			e = window.event || e;
			var coors = getCoors(e);
			
			self.startX = self.lastX = coors[0];
			self.startY = self.lastY = coors[1];
			
			if (e.type === 'touchstart') {
				s.v.removeHandler(ele, "mousedown", self.onMouseDown); // Not needed as the firsttouch is triggered
				s.v.addHandler(ele, "touchmove", self.touchHandler);
				s.v.addHandler(ele, "touchend", self.touchHandler);
				s.v.addHandler(document.body, "touchcancel", self.touchHandler);
			}else{
				var leftClick = e.which || e.button;
				if(leftClick != 1)return;
				
				if(self.mouseIsDown) return;	//this can happen, especially in IE
				self.mouseIsDown = true;
			
				s.v.addHandler(self.doc, "mousemove", self.onMouseMove);
				s.v.addHandler(self.doc, "mouseup", self.onMouseUp);
				s.v.addHandler(self.doc, "blur", self.onMouseUp);	//do we need to hook 'selectstart' also?
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			
		};
		
		this.onMouseUp = function(e,isDragCanceled){
			self.mouseIsDown = false;
			e = window.event || e;
			if (e.type === 'touchend' || e.type === 'touchcancel') {
				s.v.removeHandler(ele, "touchmove", self.touchHandler);
				s.v.removeHandler(ele, "touchend", self.touchHandler);
				s.v.removeHandler(document.body, "touchcancel", self.touchHandler);
			}else{
				s.v.removeHandler(self.doc, "mousemove", self.onMouseMove);
				s.v.removeHandler(self.doc, "mouseup", self.onMouseUp);
				s.v.removeHandler(self.doc, "blur", self.onMouseUp);
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			self.dropTargetId = getTargetId(e);
			if(self.dragStarted) isDragCanceled ? self.doCallback("dragcancel") : self.doCallback("dragend",{"droppedEleId" : self.dropTargetId , "droppedOnMySelf" : (self.dragSourceId===self.dropTargetId)});
			self.dragStarted = false;
			
		};
		
		this.onMouseMove = function(e){
			e = window.event || e;
			
				
			var coors = getCoors(e);
			
			self.lastX = coors[0];
			self.lastY = coors[1];
			
			if(s.isIE && e.button == 0 && !window.performance) return self.onMouseUp();	//avoid glitches in IE 7/8
			if(!self.dragStarted) var threshold = Math.max(Math.abs(self.startX - self.lastX), Math.abs(self.startY - self.lastY));
			
			
			if(!self.dragStarted && threshold >= self.dragThreshold){
				self.dragStarted = true;
				self.doCallback("dragstart");
				self.dragSourceId = getTargetId(e);
			}else if(!self.dragStarted){
				return s.v.cancelEvent(e);	//ignore mouse move till we reach threshold
			}
			if (e.type === 'mousemove') {
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			self.doCallback("drag");
		};
				
		this.doCallback = function(eventName,data){
			if(self.callback && typeof self.callback == "function"){
				self.callback.call(self.ele, eventName, {"startX": self.startX, "lastX": self.lastX, "startY": self.startY, "lastY": self.lastY} , data);
			}
		};
		
		s.v.addHandler(ele, "mousedown", function(e){
			amIDraggable() && self.onMouseDown(e);
		});
		s.v.addHandler(ele, "touchstart", function(e){
			amIDraggable() && self.onMouseDown(e);
		}); // Both mousedown and touchstart needed to make touchstart fast
		s.v.addHandler(document.body, "touchmove", function(event) {event.preventDefault();}); 
	};

	
	s.v.Drag = Drag;
	
})(window,slider);
/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
	
	s.v.addHandler = function(){
		if (window.addEventListener ){
			return function(target,eventName,handlerName){
				target.addEventListener(eventName, handlerName, false);
			};
		}else if(window.attachEvent){
			return function(target,eventName,handlerName){
				target.attachEvent("on" + eventName, handlerName);
			};
		}
		
	}();
	
	s.v.removeHandler = function(){
		
		if (window.removeEventListener ){
			return function(target,eventName,handlerName){
				 target.removeEventListener(eventName, handlerName, false);
			};
		}else if(window.attachEvent){
			return function(target,eventName,handlerName){
				 target.detachEvent("on" + eventName, handlerName);
			};
		}
	     
	}();
	
	s.v.createEl = function(tagName, attr){
		if(typeof tagName != "string")
			return null;
		var node = document.createElement(tagName);
		if(attr){
			if(attr.id) node.id = attr.id;
			if(attr.className) node.className = attr.className;
			if(attr["class"]) node.className = attr["class"];
			if(attr.title) node.title = attr.title;
			if(attr.type) node.type = attr.type;
			if(attr.value) node.value = attr.value;
			if(attr.cssText) node.cssText = attr.cssText;
			if(attr.alt) node.alt = attr.alt;
			if(attr.src) node.src = attr.src;
			if(attr.html) node.innerHTML = attr.html;
			if(attr.align) node.align = attr.align;
			if(attr.text) p.View.text(node, attr.text);
			if(attr.name) node.name = attr.name;
			if(attr.tabIndex) node.tabIndex = attr.tabIndex;
		}		
		return node; 
	};
	
	
	
	
	s.v.stopEventPropogation = function(e){
		if(e && e.stopPropagation) e.stopPropagation();
		if (e) e.cancelBubble = true;
	};
	
	s.v.cancelEvent = function(e) {
	    if (typeof e.preventDefault == "function") e.preventDefault();
	    else e.returnValue = false;
	};
	
	
	
	s.v.getEl = function(elementID){	//custom DOM getElementById		
		return document.getElementById(elementID);
	};
	
	s.v.hasClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.contains(cls);
		return (" " + ele.className + " ").indexOf(" "+cls+" ") > -1;
	};
	
	s.v.addClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.add(cls);
		if (!s.v.hasClass(ele, cls)) {
			ele.className = s.v.getTrimString(ele.className + " " + cls);
		}
	};
	
	s.v.setClass = function(ele, cls) {
		ele.className = cls;
	};
	
	s.v.removeClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.remove(cls);
		
		if (s.v.hasClass(ele, cls)) {
			ele.className = s.v.getTrimString(ele.className.replace(new RegExp("(^|\\s)" + cls + "(\\s|$)"), " "));
		}
	};
	s.v.getTrimString = function(st){
		if(st){
			var re = /^\s+|\s+$/g;
		    return st.replace(re, "");
		}else return "";
	};
	
	s.v.addHandler(w,"load",function(){
		s.v.puzzle = new s.v.Box();
		s.v.puzzle.paintPuzzle();
		if(!('ontouchstart' in document.documentElement) && s.isMobile) 
			alert("Your mobile web browser is not HTML5 touch compatible, Dragging feature wouldn't work");
	});
	
})(window,slider);
