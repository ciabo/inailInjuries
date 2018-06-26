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
var modal = document.getElementById('myModal');

// pigiando su contacts si apre il modal
var contact = document.getElementById('contacts');
var togmen= document.getElementById('togmen');
// toggle menu è l'elemento che chiude il menu pigiandoci soopra
var span = document.getElementsByClassName("toggle-menu")[0];
contact.addEventListener('click',openModal);
span.addEventListener('click',closeModal);
window.addEventListener('click',outsideClick);            
function openModal(){
    
    modal.style.display='block';
    
}
function closeModal(e){
    if(e.target!=togmen)
        modal.style.display='none';
    else
        if(e.target==modal)
            modal.style.display='none';    
}
function outsideClick(e){
    if(e.target==modal)
        modal.style.display='none';
}