//JavaScript Document
//jQuery

(function($){
	console.log("jQuery: " + $);
	
	$(document).ready(function(){
			$(".toggle-menu").on("click",function() {
					$(".toggle-menu").toggleClass("on");
					$("#menu-primary").toggleClass("menu-mobile"); //toggleClass sostituisce il campo class di "#.."
				return false;
			})
			$(".block").on("click",function() {
				if($(".block").is(":checked")){
					$(".dataI").prop("disabled", true);
					$(".dataF").prop("disabled", true);
				} else{
					$(".dataI").prop("disabled", false);
					$(".dataF").prop("disabled", false);
				}
			})
			$(".dataIM").prop("disabled", true);
			$(".dataFM").prop("disabled", true);
			$(".morto").on("click",function() {
				if($(".morto").is(":checked")){
					$(".dataIM").prop("disabled", false);
					$(".dataFM").prop("disabled", false);
				} else{
					$(".dataIM").prop("disabled", true);
					$(".dataFM").prop("disabled", true);
				}
			})
		})
})(jQuery);
           
