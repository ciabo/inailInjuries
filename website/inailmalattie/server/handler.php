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
			$dataInizio=$_POST['dataInizio'];//una data oppure 0
			$dataFine=$_POST['dataFine'];//una data oppure 0
			$morto=$_POST['morto']; //morto può essere 1 (se il filtro è attivo) oppure zero
			$dataInizioMorte=$_POST['dataInizioM'];
			$dataFineMorte=$_POST['dataFineM'];
			fwrite($myfile,$dataFineMorte);
			/*
			$query00 = "CREATE OR REPLACE VIEW icd10info AS SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,
			settore,datisemestrali.ICD10denunciato, count(*) AS count, SUM(datisemestrali.sesso) as numeroMaschi 
			FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice ".
			( $tumore==1 ? "JOIN tumori on datisemestrali.ICD10denunciato=tumori.id" : "" ) ."
			WHERE ". (($morto==1) ? " datisemestrali.dataMorte is not NULL" : "datisemestrali.dataMorte is not NULL or datisemestrali.dataMorte is NULL") ."
			".($amianto==1 ? "AND datisemestrali.asbestoCorrelata=1" : "") ."
			". ($dataInizio!=0 ? "AND datisemestrali.data>'".$dataInizio."' AND datisemestrali.data<'".$dataFine."'" : "" )." GROUP BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore,ICD10denunciato;";
				
			$query01="CREATE OR REPLACE VIEW icd10max AS SELECT latitudineProvincia, longitudineProvincia, settore,MAX(count) as max, SUM(numeroMaschi) as numMaschi, SUM(count) as countTotale
			FROM icd10info
			GROUP BY latitudineProvincia, longitudineProvincia, settore;";
			//fwrite($myfile, $query);
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 
			$resultinutile00 = $mysqli->query($query00);
			$resultinutile01 = $mysqli->query($query01);
			fwrite($myfile, $mysqli->error);

			$queryuno = "SELECT icd10max.latitudineProvincia, icd10max.longitudineProvincia, icd10max.settore, ICD10denunciato, max,numMaschi,countTotale, descrizione FROM icd10max JOIN icd10info on icd10max.latitudineProvincia=icd10info.latitudineProvincia and icd10max.longitudineProvincia=icd10info.longitudineProvincia and icd10max.settore=icd10info.settore 
						JOIN codici on icd10info.ICD10denunciato=codici.id
						WHERE max=count 
						GROUP BY icd10max.latitudineProvincia, icd10max.longitudineProvincia, icd10max.settore,max;";
			*/
			//fwrite($myfile, $queryuno);
			$queryInit="set @num := 0, @type := '', @type2 := '', @type3 := '';";
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
			$resultInutile=$mysqli->query($queryInit);
			fwrite($myfile, $queryInit);
			fwrite($myfile, $mysqli->error);
			
			$query1="SELECT descrizione, lat, lon,settore, icd, conto, @num := if(@type = lat and @type2 = lon and @type3 = settore, @num + 1, 1) as row_number, @type := lat, @type2 := lon, @type3 := settore 
			FROM ( SELECT singolesedi.latitudineProvincia AS lat, singolesedi.longitudineProvincia as lon, settore,datisemestrali.ICD10denunciato as icd, count(*) as conto 
			FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice 
			".( $tumore==1 ? "JOIN tumori on datisemestrali.ICD10denunciato=tumori.id" : "" ) ."
			WHERE datisemestrali.ICD10denunciato<>'ND'". (($morto==1) ? "AND datisemestrali.dataMorte is not NULL AND datisemestrali.dataMorte>'".$dataInizioMorte."' AND datisemestrali.dataMorte<'".$dataFineMorte."'" : " AND datisemestrali.dataMorte is not NULL or datisemestrali.dataMorte is NULL") ."
			".($amianto==1 ? "AND datisemestrali.asbestoCorrelata=1" : "") ."
			". ($dataInizio!=0 ? "AND datisemestrali.data>'".$dataInizio."' AND datisemestrali.data<'".$dataFine."'" : "" )."
			GROUP BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore,ICD10denunciato 
			ORDER BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia, settore, conto DESC)as a
			LEFT JOIN codici on a.icd = codici.id
			HAVING row_number = 1 OR row_number = 2 OR row_number = 3
			ORDER BY lat, lon, settore, row_number ASC;";
			
			$result=$mysqli->query($query1);
			fwrite($myfile, $query1);
			fwrite($myfile, $mysqli->error);
			$num_rows = $result->num_rows;
			fwrite($myfile, $num_rows);
			$infoMax = array();
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				$latitudine = $row['lat'];
				$longitudine = $row['lon'];
				$numeroPersoneConMalattiaPiuDiffusa = $row['conto'];
				$settore = $row['settore'];
				$descrizioneMalattiaPiuDiffusa=$row['descrizione'];
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, "numeroPersoneConMalattiaPiuDiffusa" => $numeroPersoneConMalattiaPiuDiffusa, "descrizioneMalattiaPiuDiffusa" => $descrizioneMalattiaPiuDiffusa);
				array_push($infoMax, $dataElement);
			}
					
		
			$query = "SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore, count(*) AS count, SUM(datisemestrali.sesso) as numeroMaschi 
			FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice".
			( $tumore==1 ? " JOIN tumori on datisemestrali.ICD10denunciato=tumori.id" : "" ) ."
			WHERE datisemestrali.ICD10denunciato<>'ND'". (($morto==1) ? "AND datisemestrali.dataMorte is not NULL AND datisemestrali.dataMorte>'".$dataInizioMorte."' AND datisemestrali.dataMorte<'".$dataFineMorte."'" : " AND datisemestrali.dataMorte is not NULL or datisemestrali.dataMorte is NULL") ."
			".($amianto==1 ? "AND datisemestrali.asbestoCorrelata=1" : "") ."
			". ($dataInizio!=0 ? "AND datisemestrali.data>'".$dataInizio."' AND datisemestrali.data<'".$dataFine."'" : "" )." GROUP BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore";
			fwrite($myfile, $query);
	
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 
			$result = $mysqli->query($query); 
			$data = array();	
			$i=0;
			$n=count($infoMax);
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				$latitudine = $row['latitudineProvincia'];
				$longitudine = $row['longitudineProvincia'];
				$count = $row['count'];
				$settore = $row['settore'];
				$numeroMaschi = $row['numeroMaschi'];
				/*
				$malattia1 = $infoMax[$i]['descrizioneMalattiaPiuDiffusa'];
				$countMalattia1 = $infoMax[$i]['numeroPersoneConMalattiaPiuDiffusa'];
				$latitudineMalattia1 = $infoMax[$i]['latitudine'];
				$longitudineMalattia1 = $infoMax[$i]['longitudine'];
				$settoreMalattia1 = $infoMax[$i]['settore'];
				$malattia2 = $infoMax[$i+1]['descrizioneMalattiaPiuDiffusa'];
				$countMalattia2 = $infoMax[$i+1]['numeroPersoneConMalattiaPiuDiffusa'];
				$latitudineMalattia2 = $infoMax[$i+1]['numeroPersoneConMalattiaPiuDiffusa'];
				$longitudineMalattia2 = $infoMax[$i+1]['longitudine'];
				$settoreMalattia2 = $infoMax[$i+1]['settore'];
				$malattia3 = $infoMax[$i+2]['descrizioneMalattiaPiuDiffusa'];
				$countMalattia3 = $infoMax[$i+2]['numeroPersoneConMalattiaPiuDiffusa'];
				$latitudineMalattia3 = $infoMax[$i+2]['latitudine'];
				$longitudineMalattia3 = $infoMax[$i+2]['longitudine'];
				$settoreMalattia3 = $infoMax[$i+2]['settore'];

				if($i<800){
					$i=$i+3;
				}
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, 
				"count" => $count, "countMaschi" => $numeroMaschi, 
				"malattia1" => $malattia1, "countMalattia1" =>$countMalattia1, "latitudineMalattia1" =>$latitudineMalattia1, "longitudineMalattia1" =>$longitudineMalattia1, "settoreMalattia1" => $settoreMalattia1,  
				"malattia2" => $malattia2, "countMalattia2" =>$countMalattia2, "latitudineMalattia2" =>$latitudineMalattia2, "longitudineMalattia2" =>$longitudineMalattia2, "settoreMalattia2" => $settoreMalattia2,
				"malattia3" => $malattia3, "countMalattia3" =>$countMalattia3, "latitudineMalattia3" =>$latitudineMalattia3, "longitudineMalattia3" =>$longitudineMalattia3, "settoreMalattia3" => $settoreMalattia3);
				array_push($data, $dataElement);*/
				//versione con ricerca nell'array
				
				
				$malattia1="ND";
				$malattia2="ND";
				$malattia3="ND";
				
				$countMalattia1 = "";
				$latitudineMalattia1 = "";
				$longitudineMalattia1 ="";
				$settoreMalattia1 ="";
				
				$countMalattia2 = "";
				$latitudineMalattia2 = "";
				$longitudineMalattia2 ="";
				$settoreMalattia2 ="";
				
				$countMalattia3 = "";
				$latitudineMalattia3 = "";
				$longitudineMalattia3 = "";
				$settoreMalattia3 = "";
				
				for($i=0; $i<=$n-1; $i++){
					if($latitudine == $infoMax[$i]['latitudine'] && $longitudine == $infoMax[$i]['longitudine'] && $settore == $infoMax[$i]['settore']){
						if($malattia1 == "ND"){
							$malattia1=$infoMax[$i]['descrizioneMalattiaPiuDiffusa'];
							$countMalattia1 = $infoMax[$i]['numeroPersoneConMalattiaPiuDiffusa'];
							$latitudineMalattia1 = $infoMax[$i]['latitudine'];
							$longitudineMalattia1 = $infoMax[$i]['longitudine'];
							$settoreMalattia1 = $infoMax[$i]['settore'];
							//fwrite($myfile, $malattia1);
							unset($infoMax[$i]);
							
						}
						elseif($malattia2 == "ND"){
							$malattia2=$infoMax[$i]['descrizioneMalattiaPiuDiffusa'];
							$countMalattia2 = $infoMax[$i]['numeroPersoneConMalattiaPiuDiffusa'];
							$latitudineMalattia2 = $infoMax[$i]['latitudine'];
							$longitudineMalattia2 = $infoMax[$i]['longitudine'];
							$settoreMalattia2 = $infoMax[$i]['settore'];
							//fwrite($myfile, $malattia2);
							unset($infoMax[$i]);
						}
						else{
							$malattia3=$infoMax[$i]['descrizioneMalattiaPiuDiffusa'];
							$countMalattia3 = $infoMax[$i]['numeroPersoneConMalattiaPiuDiffusa'];
							$latitudineMalattia3 = $infoMax[$i]['latitudine'];
							$longitudineMalattia3 = $infoMax[$i]['longitudine'];
							$settoreMalattia3 = $infoMax[$i]['settore'];
							//fwrite($myfile, $malattia3);
							unset($infoMax[$i]);
							break;
						}
					}
				}
				
				$infoMax=array_values($infoMax);
				$n=count($infoMax);
				fwrite($myfile, $n);
				/*$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, 
				"count" => $count, "countMaschi" => $numeroMaschi, "malattia1" => $malattia1, "malattia2" => $malattia2, "malattia3" => $malattia3);*/
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, 
				"count" => $count, "countMaschi" => $numeroMaschi, 
				"malattia1" => $malattia1, "countMalattia1" =>$countMalattia1, "latitudineMalattia1" =>$latitudineMalattia1, "longitudineMalattia1" =>$longitudineMalattia1, "settoreMalattia1" => $settoreMalattia1,  
				"malattia2" => $malattia2, "countMalattia2" =>$countMalattia2, "latitudineMalattia2" =>$latitudineMalattia2, "longitudineMalattia2" =>$longitudineMalattia2, "settoreMalattia2" => $settoreMalattia2,
				"malattia3" => $malattia3, "countMalattia3" =>$countMalattia3, "latitudineMalattia3" =>$latitudineMalattia3, "longitudineMalattia3" =>$longitudineMalattia3, "settoreMalattia3" => $settoreMalattia3);
				
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
	/* vecchia query
	function filterData(){
		try{
			$myfile = fopen("logs.txt", "w") or die("Unable to open file!");
			$tumore=$_POST['tumore']; //tumore può essere 1 (se il filtro è attivo) oppure 0
			$amianto=$_POST['amianto']; //amianto può essere 1 (se il filtro è attivo) oppure 0
			$dataInizio=$_POST['dataInizio'];//una data oppure 0
			$dataFine=$_POST['dataFine'];//una data oppure 0
			$morto=$_POST['morto']; //morto può essere 1 (se il filtro è attivo) oppure zero
			
			$query = "SELECT singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore, count(*) AS count, SUM(datisemestrali.sesso) as numeroMaschi 
			FROM datisemestrali JOIN singolesedi on datisemestrali.sedeInail=singolesedi.codice ".
			( $tumore==1 ? "JOIN tumori on datisemestrali.ICD10denunciato=tumori.id" : "" ) ."
			WHERE ". (($morto==1) ? " datisemestrali.dataMorte is not NULL" : "datisemestrali.dataMorte is not NULL or datisemestrali.dataMorte is NULL") ."
			".($amianto==1 ? "AND datisemestrali.asbestoCorrelata=1" : "") ."
			". ($dataInizio!=0 ? "AND datisemestrali.data>'".$dataInizio."' AND datisemestrali.data<'".$dataFine."'" : "" )." GROUP BY singolesedi.latitudineProvincia, singolesedi.longitudineProvincia,settore";
			fwrite($myfile, $query);
	
			$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 
			$result = $mysqli->query($query); 
			$data = array();	
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				$latitudine = $row['latitudineProvincia'];
				$longitudine = $row['longitudineProvincia'];
				$count = $row['count'];
				$settore = $row['settore'];
				$numeroMaschi = $row['numeroMaschi'];
				$dataElement = array("latitudine" => $latitudine,"longitudine" =>$longitudine,"settore" => $settore, "count" => $count, "countMaschi" => $numeroMaschi);
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
	}*/
	
?>