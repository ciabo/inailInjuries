// JavaScript Document

//var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
//var marks = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster per filtri
(function($){
		var amianto = 0;
		var morto = 0;
		var tumore = 0;
		var dataInizio = 0;
		var dataFine = 0;
		var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster	
		serverURL = "server/handler.php" 
		loadData();
		//AGGIUNGERE I GESTORI DI EVENTI SUI PULSANTI !!
		$("#filtra").on('click', function(){
			if($(".amianto").is(":checked")){
				amianto = 1;
			}else
				amianto = 0;
			if($(".morto").is(":checked")){
				morto = 1;
			}else
				morto = 0;
			if($(".tumore").is(":checked")){
				tumore = 1;
			}else
				tumore = 0;
			dataInizio = parseDate(new Date($(".dataI").val()));
			dataFine = parseDate(new Date($(".dataF").val()));
			if(dataInizio != 0)
				if(dataFine == 0)
					alert("Non hai selezionato la data finale!");
				/*else{
					if (dataInizio.substring(0,4) < dataFine.substring(0,4){
						//mettere controllo data
					}
				}*/
			filterData();
		})
		
		function parseDate(date){
			if(isNaN(date))
				return data = 0;
			data = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
			return data;
		}
			
			
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
			console.log(data); //è un array		
			//console.log(data[0]); //oggetto con lat lng e count	
			markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine;
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
			console.log("amianto: " + amianto); //qui bisogna prendere il valore del filtro da jquery (metto 1 solo per i test)
			console.log("tumore: " + tumore); 
			console.log("morto: " + morto); 
			console.log("dataI: " + dataInizio);
			console.log("dataF: " + dataFine);
			
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
			console.log(data); //è un oggetto con l'array in data
			markers.clearLayers();//tolgo i marcatori caricati da handle
			//data a questo punto è un array che contiene elementi ognuno con latitudine, longitudine e count. 
			data = data.data;
			console.log(data);
			var marks = L.markerClusterGroup({ chunkedLoading: true, animate: true, animateAddingMarkers: true }); //creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine
				var count = a.count;
				var marker = L.marker(L.latLng(lat, lng), { count: count }); //creo marker con coordinate del vettore
				marker.bindPopup(count); //metodo per far apparire il titolino sul cursore
				marks.addLayer(marker); //aggiungo il marcatore
			}
			//trovare un modo per aggiungere un minimo di ritardo per enfatizzare il cambiamento dei marcatori sulla mappa
			map.addLayer(marks); // aggiungo I marcatori*/
		}
})(jQuery);


latlng = L.latLng(42.56, 12.50);
var map = L.map('map', {center: latlng, zoom: 8});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiOWV0dG9yZTYiLCJhIjoiY2ppb3FpOXlxMGM5ODN2dDl6Mjh2cTUwOCJ9.QoSRENS3F5CVJSIjLywTxg'
}).addTo(map);

