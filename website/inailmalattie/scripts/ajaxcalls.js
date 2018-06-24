// JavaScript Document
addressPoints = [];

(function($){
	
	
		serverURL = "server/handler.php" 
		
		//AGGIUNGERE I GESTORI DI EVENTI SUI PULSANTI !!
			
		filterData();
		loadData();
			
		 function loadData() {
				console.log("loadData");
				request_type = "load";
				
				$.ajax({
					url: serverURL,
					type: "POST",
					//contentType: 'application/json; charset=utf-8',
					data: {"action" : request_type}, //invio la richiesta al server
					dataType: "json",
					success:function(data){ //data contiene la risposta dal server
						handleLoad(data);
					},
					error: function(XHR, err) {
						alert( "Request failed: " + err );
					}
					//dataType: "json",
				});
	 
				
			}
			
			
			function handleLoad(data) {
				console.log("handleLoad");
				//data a questo punto è un array che contiene 106 elementi ognuno con latitudine, longitudine e count. 
				/*console.log(data[0]);
				var a = data[0]; 
				var lat = a.latitudine;
				var lng = a.longitudine
				var count = a.count;
				console.log(" " + lat + lng + count);*/
				
				var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
				for (var i = 0; i < data.length; i++) {
					var a = data[i]; 
					var lat = a.latitudine;
					var lng = a.longitudine
					var count = a.count;
					var marker = L.marker(L.latLng(lat, lng), { count: count }); //creo marker con coordinate del vettore
					marker.bindPopup(count); //metodo per far apparire il titolino sul cursore
					markers.addLayer(marker); //aggiungo il marcatore
				}

				map.addLayer(markers); // aggiungo I marcatori
			}
			
			
			function filterData(){ //questa funzione verrò chiamata ogni volta che si varia un valore nel filtro 
				console.log("filterData");
				request_type = "filter";	
				var tumore = 1; //qui bisogna prendere il valore del filtro da jquery (metto 1 solo per i test)
				var amianto = 0; 
				var morto = 1;
				var dataInizio=0;
				var dataFine=0;
				
				$.ajax({
					url: serverURL,
					type: "POST",
					data: {"action" : request_type, "tumore" : tumore, "amianto" : amianto, "morto" : morto, "dataInizio" : dataInizio, "dataFine" : dataFine},
					dataType: "json",
					success:function(data){
						handleFilter(data);
					},
					error: function(XHR, err) {
						alert( "Request failed: " + err );
					}
				});
			}
			
			function handleFilter(data){
				console.log("handleLoadF");
				//data a questo punto è un array che contiene elementi ognuno con latitudine, longitudine e count. 
			}
})(jQuery);


latlng = L.latLng(42.56, 12.50);
var map = L.map('map', {center: latlng, zoom: 13});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiOWV0dG9yZTYiLCJhIjoiY2ppb3FpOXlxMGM5ODN2dDl6Mjh2cTUwOCJ9.QoSRENS3F5CVJSIjLywTxg'
}).addTo(map);
/*
console.log(addressPoints);
var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
for (var i = 0; i < addressPoints.length; i++) {
	var a = addressPoints[i];
	var title = a[2];
	var marker = L.marker(L.latLng(a[0], a[1]), { title: title }); //creo marker con coordinate del vettore
	marker.bindPopup(title); //metodo per far apparire il titolino sul cursore
	markers.addLayer(marker); //aggiungo il marcatore
}

map.addLayer(markers); // aggiungo I marcatori */
