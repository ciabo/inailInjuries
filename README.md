# inailInjuries
Mobile responsive web application for the visualization of work injuries from INAIL data.

Il file ICD10.sql è necessario per la creazione nel database della tabella che associa ogni codice malattia alla descrizione della malattia stessa secondo la nominazione ICD10 dell'OMS.
Il file Nazioni.sql è necessario per per creazione nel database della tebella che associa ad ogni codice nazione la nazione stessa che poi verrà utilizzato per decodificare il paese di provenienza delle persone.
Il file Sedi.sql è necessario per per creazione nel database della tebella che associa ad ogni sede (numero) le informazioni della sede stessa.
Il file datiSemestrali.sql è necessario per la creazione nel database della tabella datiSemestrali che contiene il fulcro della web app. Ovvero tutti i casi con le rispettive informazioni.

PYTHON
-Requisti: Python 3.x 
Sono presenti due file .py: 
 -othersSql serve per la creazione dei file ICD10.sql, Nazioni.sql e Sedi.sql che è sufficiente caricare una sola volta per tutte. È         sufficianete eseguire lo script e sulla cartella /data/sql si troveranno i files. 
 -Main invece serve per la creazione del file datiSemestrali.sql e di conseguenza ogni sei mesi può essere usato per creare una nuova         versione della tabella con i dati aggiornati dall'inail. Per il funzionamento è necessario prima scaricare i files csv semestestrali dal   sito dell'inail e posizionarli su /data/dati con il nome della regione. Dopo di che eseguendo lo script verrà salvato su data/sql il file   sql datiSemestrali.sql
