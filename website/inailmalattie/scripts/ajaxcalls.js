// JavaScript Document

(function($){
	console.log("JQUERY: " + $);
	
	
		serverURL = "server/handler.php" 
		
		//AGGIUNGERE I GESTORI DI EVENTI SUI PULSANTI !!
			
		filterData();
			
		 function loadData() {
				console.log("loadData");
				request_type = "load";
				
				$.ajax({
					url: serverURL,
					type: "POST",
					//contentType: 'application/json; charset=utf-8',
					data: {"action" : request_type},
					dataType: "json",
					success:function(data){
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
				console.log("handleLoad");
				//data a questo punto è un array che contiene elementi ognuno con latitudine, longitudine, settore e count.
				//bisogna quindi gestire il fatto del settore: se il filtro è attivato si fa apparire di colore diverso
				//i vari settori, altrimenti tutto normale
			}
})(jQuery);
