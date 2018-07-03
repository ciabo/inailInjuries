// JavaScript Document

//var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
//var marks = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster per filtri
(function($){
		var amianto = 0;
		var morto = 0;
		var tumore = 0;
		var dataInizio = "2010-10-1";
		var dataFine = "2018-10-1";
		var dataInizioMorte="2010-10-1";
		var dataFineMorte="2018-10-1";
		var settr = 0;
		var filtra = 0;
		var block = 0;
		var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster	dell'handle
		var marks = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster	del filter
		serverURL = "server/handler.php" 
		loadData();
		//AGGIUNGERE I GESTORI DI EVENTI SUI PULSANTI !!
		$("#filtra").on('click', function(){
			amianto = $(".amianto").is(":checked") ? 1 : 0;
			morto = $(".morto").is(":checked") ? 1 : 0;
			tumore = $(".tumore").is(":checked") ? 1 : 0;
			block = $(".block").is(":checked") ? 1 : 0;
			settr = $(".settori").val()
			block == 0 ? dataInizio = parseDate(new Date($(".dataI").val())) : dataInizio = "2010-10-1";
			block == 0 ? dataFine = parseDate(new Date($(".dataF").val())) : dataFine = "2018-10-1";
			morto == 1 ? dataInizioMorte = parseDate(new Date($(".dataIM").val())) : dataInizioMorte = "2010-10-1";
			morto == 1 ? dataFineMorte = parseDate(new Date($(".dataFM").val())) : dataFineMorte = "2018-10-1";
			if(tumore == 1 || morto == 1 || amianto == 1)
				filtra = 1;
			if(dataInizio != 0)
				if(dataFine == 0)
					alert("Non hai selezionato la data finale!");
			if(dataInizioMorte!=0)
				if(dataFineMorte==0)
					alert("Non hai selezionato la data di morte finale!");
			marks.clearLayers();
			filterData();
		})
		
		$("#remove").on('click', function(){
			amianto = 0;
			morto = 0;
			tumore = 0;
			settr = 0;
			dataInizio = "2010-10-1";
			dataFine = "2018-10-1";
			dataInizioMorte = "2010-10-1";
			dataFineMorte = "2018-10-1";
			filtra = 0;
			$(".morto").is(":checked") ? $('.morto').prop('checked', false) : 0;
			$(".amianto").is(":checked") ? $('.amianto').prop('checked', false) : 0;
			$(".tumore").is(":checked") ? $('.tumore').prop('checked', false) : 0;
			$(".settori").val("0");
			$(".dataI").val("2010-10");
			$(".dataF").val("2018-10");
			$(".dataIM").val("2010-10");
			$(".dataFM").val("2018-10");
			$(".dataIM").prop("disabled", true);
			$(".dataFM").prop("disabled", true);
			marks.clearLayers();
			filterData();
		})
		
		function parseDate(date){
			if(isNaN(date))
				return data = 0;
			data = [date.getFullYear(),date.getMonth()+1,"1"].join('-');
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
			filterData(); //chiamo filter con tutti i filtri disattivati
			//console.log(data[0]); //oggetto con lat lng e count	
			/*markers = L.markerClusterGroup({iconCreateFunction: function(cluster) {
					// iterate all markers and count
					var markers = cluster.getAllChildMarkers();
					var weight = 0;
					for (var i = 0; i < markers.length; i++) {
						if(markers[i].options.hasOwnProperty("customWeight")){
						weight += parseInt(markers[i].options.customWeight);      
						var a =1;
					  }
					}
					var c = ' marker-cluster-';
					if (weight < 2000) {
						c += 'small';
					} else if (weight < 4000) {
						c += 'medium';
					} else {
						c += 'large';
					}
					// create the icon with the "weight" count, instead of marker count
					return L.divIcon({ 
						html: '<div><span>' + weight + '</span></div>',
						className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
					});
				}
			});//creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine;
				var count = a.count;
				var marker=new weightMarker([lat, lng], { customWeight: count });
				marker.bindPopup(count);
				markers.addLayer(marker);
	
			}
			map.addLayer(markers);
			 // aggiungo I marcatori*/
		}
		
		
		function filterData(){ //questa funzione verrò chiamata ogni volta che si varia un valore nel filtro 
			console.log("filterData");
			request_type = "filter";	
			console.log("amianto: " + amianto); //qui bisogna prendere il valore del filtro da jquery (metto 1 solo per i test)
			console.log("tumore: " + tumore); 
			console.log("morto: " + morto); 
			console.log("blocca filtro data pratiche: " + block); 
			console.log("dataI: " + dataInizio);
			console.log("dataF: " + dataFine);
			console.log("dataIM: " + dataInizioMorte);
			console.log("dataFM: " + dataFineMorte);
			console.log("settore: " + settr + " (1 agr, 2 ind, 3 stat)");
			
			$.ajax({
				url: serverURL,
				type: "POST",
				data: {"action" : request_type, "tumore" : tumore, "amianto" : amianto, "morto" : morto, "dataInizio" : dataInizio, "dataFine" : dataFine, "dataInizioM" : dataInizioMorte, "dataFineM" : dataFineMorte},
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
			if(data.length == 0)
				alert("Per i filtri selezionati la ricerca ha restituito 0 risultati");
			console.log(data);
			//console.log(data.settore);
			marks = L.markerClusterGroup({iconCreateFunction: function(cluster) {
					// iterate all markers and count
					var markers = cluster.getAllChildMarkers();
					var weight = 0;
					for (var i = 0; i < markers.length; i++) {
						if(markers[i].options.hasOwnProperty("customWeight")){
						weight += parseInt(markers[i].options.customWeight);      
						var a =1;
					  }
					}
					//console.log("Cambia colore cluster(0 normale, 1 ridotto): " + filtra)
					if(filtra == 0){
						//console.log("Sono in filtra 0: " + filtra)
						var c = ' marker-cluster-';
						if (weight < 2000) {
							c += 'small';
						} else if (weight < 4000) {
							c += 'medium';
						} else {
							c += 'large';
						}
					} else{
						//console.log("Sono in filtra 1: " + filtra);
						var c = ' marker-cluster-';
						if (weight < 50) {
							c += 'small';
						} else if (weight < 150) {
							c += 'medium';
						} else {
							c += 'large';
						}
					}
					// create the icon with the "weight" count, instead of marker count
					return L.divIcon({ 
						html: '<div><span>' + weight + '</span></div>',
						className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
					});
				}
			});//creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine
				var count = a.count;
				var settore = a.settore;
				var nummaschi = a.countMaschi;
				var numdonne = count - nummaschi;
				var numeroMalattiaPiuDiffusa1 = a.countMalattia1;
				var numeroMalattiaPiuDiffusa2 = a.countMalattia2;
				var numeroMalattiaPiuDiffusa3 = a.countMalattia3;
				var descrizioneMalattiaPiuDiffusa1 = a.malattia1;
				var descrizioneMalattiaPiuDiffusa2 = a.malattia2;
				var descrizioneMalattiaPiuDiffusa3 = a.malattia3;
				if(settore=="Agricoltura" && data.length>i+1 && data[i+1].settore=="Industria" && data.length>i+2 && data[i+2].settore != "Stato"){
					var agricolturaIcon = L.icon({
					  iconUrl: 'img/agricoltura.png',
					  //shadowUrl: 'leaf-shadow.png',

					  iconSize:     [55, 55], // size of the icon
					  //shadowSize:   [50, 64], // size of the shadow
					  iconAnchor:   [0, 53], // point of the icon which will correspond to marker's location
					  //shadowAnchor: [4, 62],  // the same for the shadow
					  popupAnchor:  [-3, -45] // point from which the popup should open relative to the iconAnchor
				});
				var industriaIcon = L.icon({
					  iconUrl: 'img/industria.png',
					  iconSize:     [55, 55], // size of the icon
				});
				var statoIcon = L.icon({
					  iconUrl: 'img/stato.png',
					  iconSize:     [55, 55], // size of the icon
					  iconAnchor:   [10, 30],
					  popupAnchor:  [18, -17]
				});
				}else{
				var agricolturaIcon = L.icon({
					  iconUrl: 'img/agricoltura.png',
					  //shadowUrl: 'leaf-shadow.png',

					  iconSize:     [55, 55], // size of the icon
					  //shadowSize:   [50, 64], // size of the shadow
					  iconAnchor:   [40, 53], // point of the icon which will correspond to marker's location
					  //shadowAnchor: [4, 62],  // the same for the shadow
					  popupAnchor:  [-3, -45] // point from which the popup should open relative to the iconAnchor
				});
				var industriaIcon = L.icon({
					  iconUrl: 'img/industria.png',
					  iconSize:     [55, 55], // size of the icon
				});
				var statoIcon = L.icon({
					  iconUrl: 'img/stato.png',
					  iconSize:     [55, 55], // size of the icon
					  iconAnchor:   [10, 30],
					  popupAnchor:  [18, -17]
				});
				}
				
				switch(settore){
					case 'Agricoltura':
						if (settr == 1 || settr == 0){
						var marker=new weightMarker([lat, lng], {customWeight: count, 
																 malattia1: numeroMalattiaPiuDiffusa1, 
																 malattia2: numeroMalattiaPiuDiffusa2, 
																 malattia3: numeroMalattiaPiuDiffusa3, 
																 descrizione1: descrizioneMalattiaPiuDiffusa1,  
																 descrizione2: descrizioneMalattiaPiuDiffusa2,  
																 descrizione3: descrizioneMalattiaPiuDiffusa3,  
																 numM: nummaschi,
																 numF: numdonne,
																 icon: agricolturaIcon });
						break;
						}
						break;
					case 'Industria':
						if(settr == 2 || settr == 0){
							var marker=new weightMarker([lat, lng], {customWeight: count, 
																	 malattia1: numeroMalattiaPiuDiffusa1, 
																	 malattia2: numeroMalattiaPiuDiffusa2, 
																	 malattia3: numeroMalattiaPiuDiffusa3, 
																	 descrizione1: descrizioneMalattiaPiuDiffusa1,  
																	 descrizione2: descrizioneMalattiaPiuDiffusa2,  
																	 descrizione3: descrizioneMalattiaPiuDiffusa3,    
																	 numM: nummaschi,
																	 numF: numdonne,
																	 icon: industriaIcon });
							break;
						}
						break;
					case 'Statale':
						if(settr == 3 || settr == 0){
							var marker=new weightMarker([lat, lng], {customWeight: count, 
																	 malattia1: numeroMalattiaPiuDiffusa1, 
																	 malattia2: numeroMalattiaPiuDiffusa2, 
																	 malattia3: numeroMalattiaPiuDiffusa3, 
																	 descrizione1: descrizioneMalattiaPiuDiffusa1,  
																	 descrizione2: descrizioneMalattiaPiuDiffusa2,  
																	 descrizione3: descrizioneMalattiaPiuDiffusa3,  
																	 numM: nummaschi,
																	 numF: numdonne,
																	 icon: statoIcon });
							break;
						}
						break;
				}
				//var marker=new weightMarker([lat, lng], { customWeight: count});
				if(!(typeof marker === "undefined")){
					marker.bindPopup("<b>Numero di malati totale</b>: " + marker.options.customWeight + "<br>" +
					"<b>Percentuale Uomini malati</b>: " + new Number((marker.options.numM/marker.options.customWeight)*100).toPrecision(3) + 
					"%<br>" + "<b>Percentuale Donne malate</b>: " + 
					new Number((marker.options.numF/marker.options.customWeight)*100).toPrecision(3) + "%<br>" + "<b> 1° Malattia più diffusa</b>: " 
					+ marker.options.descrizione1 + "<br>" + "<b>Persone colpite</b>: " + marker.options.malattia1 + "<br>" + "<b> 2° Malattia più diffusa</b>: " 
					+ marker.options.descrizione2 + "<br>" + "<b>Persone colpite</b>: " + marker.options.malattia2 + "<br>" + "<b> 3° Malattia più diffusa</b>: " 
					+ marker.options.descrizione3 + "<br>" + "<b>Persone colpite</b>: " + marker.options.malattia3).openPopup();
				}
				if(!(typeof marker === "undefined")){
					marks.addLayer(marker);
				}
			}
			//trovare un modo per aggiungere un minimo di ritardo per enfatizzare il cambiamento dei marcatori sulla mappa
			markers.clearLayers();
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

var weightMarker = L.Marker.extend({
   options: { 
      customWeight: 0,
	  malattia1: 0,
	  malattia2: 0,
	  malattia3: 0,
	  descrizione1: "",
	  descrizione2: "",
	  descrizione3: "",
	  numM: 0,
	  numF: 0,
   }
});

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'infolegend'),
        grades = ["&#160&#160Agricoltura", "&#160&#160Industria", "&#160&#160Enti pubblici"], //&#160 carattere per forzare lo sapazio
        labels = ["img/agricoltura.png","img/industria.png", "img/stato.png"];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML = "<b>&#160Settore colpito:</b> <br>"
	div.style.backgroundColor = "lightblue";
	div.style.border = "3px solid black";
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML += grades[i] + (" <img src="+ labels[i] +" height='35' width='35' align='middle'>") +'<br>';
    }
    return div;
};

legend.addTo(map); 