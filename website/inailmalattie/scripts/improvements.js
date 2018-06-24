//JavaScript Document

latlng = L.latLng(-37.89, 175.46);
	
var map = L.map('map', {center: latlng, zoom: 13});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiOWV0dG9yZTYiLCJhIjoiY2ppb3FpOXlxMGM5ODN2dDl6Mjh2cTUwOCJ9.QoSRENS3F5CVJSIjLywTxg'
}).addTo(map);


var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
//vettore delle cordinate esempio con poche coordinate
var addressPoint = [
	[-37.8839, 175.3745188667, "571"],
	[-37.8869090667, 175.3657417333, "486"], //ultimo numero valore che compare quando passo sopra con il mouse al cursore(non cluster)
	[-37.8894207167, 175.4015351167, "807"],
	[-37.8927369333, 175.4087452333, "899"],
	[-37.90585105, 175.4453463833, "1273"],
	[-37.9064188833, 175.4441556833, "1258"],
	[-37.90584715, 175.4463564333, "1279"],
	[-37.9033391333, 175.4244005667, "1078"],
	[-37.9061991333, 175.4492620333, "1309"],
	[-37.9058955167, 175.4445613167, "1261"],
	[-37.88888045, 175.39146475, "734"]]
	
for (var i = 0; i < addressPoints.length; i++) {
	var a = addressPoints[i];
	var title = a[2];
	var marker = L.marker(L.latLng(a[0], a[1]), { title: title }); //creo marker con coordinate del vettore
	marker.bindPopup(title); //metodo per far apparire il titolino sul cursore
	markers.addLayer(marker); //aggiungo il marcatore
}

map.addLayer(markers); // aggiungo I marcatori

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
		}   
	);
	
	
})(jQuery);