<?php
	header('Content-Type: text/json');
	require_once("config.php");
	$action = $_POST['action'];
	
	switch($action) {
		case "load" :
			loadData();
		break;
		case "filter" :
			filterData();
		break; 	
	}

	
	function loadData() {
		try{
		//$query = 'SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice'; 
			$query = 'SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia, count(*) AS count FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice group by singolesedi.latitudineProvincia, singolesedi.longitudineProvincia';
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 
			$result = $mysqli->query($query); 
			$data = array();	
			
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				
				$latitudine = $row['latitudineProvincia'];
				$longitudine = $row['longitudineProvincia'];
				$count = $row['count'];
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine, "count" => $count);
				array_push($data, $dataElement);
			}
			
			//fwrite($myfile, json_encode($response));
			//fclose();
			$JSON = json_encode($data);
			echo $JSON;
		}
		catch (Exception $e) {
			$myfile = fopen("logs.txt", "w") or die("Unable to open file!");
			fwrite($myfile, $e->getMessage());
			fclose();
		}
	
	}
	function filterData(){
		try{
			$myfile = fopen("logs.txt", "w") or die("Unable to open file!");
			$tumore=$_POST['tumore']; //tumore può essere 1 (se il filtro è attivo) oppure 0
			$amianto=$_POST['amianto']; //amianto può essere 1 (se il filtro è attivo) oppure 0
			//$genere=$_POST['genere'];//genere può essere 1 (se cerchiamo maschi), 2 (se cerchiamo donne) oppure 0 se se il filtro non è attivo
			$dataInizio=$_POST['dataInizio'];//una data oppure 0
			$dataFine=$_POST['dataFine'];//una data oppure 0
			$morto=$_POST['morto']; //morto può essere 1 (se il filtro è attivo) oppure zero
			
			$query = "SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore, count(*) AS count 
			FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice ".
			( $tumore==1 ? "JOIN tumori on datisemestrali.ICD10denunciato=tumori.id" : "" ) ."
			WHERE ". (($morto==1) ? " datisemestrali.dataMorte is not NULL" : "datisemestrali.dataMorte is not NULL or datisemestrali.dataMorte is NULL") ."
			".($amianto==1 ? "AND datisemestrali.asbestoCorrelata=1" : "") ."
			". ($dataInizio!=0 ? "AND datisemestrali.data>\'".$dataInizio."\' AND datisemestrali.data<\'".$dataFine."\'" : "" )." GROUP BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore";
			fwrite($myfile, $query);
			
			
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 
			$result = $mysqli->query($query); 
			$data = array();	
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				$latitudine = $row['latitudineProvincia'];
				$longitudine = $row['longitudineProvincia'];
				$count = $row['count'];
				$settore = $row['settore'];
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, "count" => $count);
				array_push($data, $dataElement);
			}
		
			$response = array("data" => $data, "type" => "load");
			echo json_encode($response);	
		}
		catch(Exception $e){
			$myfile = fopen("logs.txt", "w") or die("Unable to open file!");
			fwrite($myfile, $e->getMessage());
			fclose();
		}
	}
	
	
?>