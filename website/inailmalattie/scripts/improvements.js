//JavaScript Document
//jQuery

(function($){
	console.log("jQuery: " + $);
	
	$(document).ready(function(){
			$(".toggle-menu").on("click", function() {
  				$(this).toggleClass("on");
                $("#menu-secondary li").appendTo("#menu-primary"); //sposto contacts insieme agli altri
				$("#menu-primary").toggleClass("menu-mobile"); //toggleClass sostituisce il campo class di "#.."
				return false;
			});
			if($(window.matchMedia("(max-width:768px)").matches)) {
				$("#filter").children().wrap("<div></div>");
			}
		}   
	);
	
})(jQuery);