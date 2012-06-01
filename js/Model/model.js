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