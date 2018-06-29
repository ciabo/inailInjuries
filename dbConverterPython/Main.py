import openpyxl;
from pandas import *
import datetime;

#datiSemestrali

regioni = ["Abruzzo", "Basilicata", "Calabria", "Campania", "EmiliaRomagna", "FriuliVeneziaGiulia", "Lazio", "Liguria",
           "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "TrentinoAltoAdige",
           "Umbria", "ValledAosta", "Veneto"];
formatStr = '%d/%m/%Y';
f = open('data/sql/SQLSemestrali.sql', 'w')
f.write("CREATE TABLE IF NOT EXISTS datisemestrali (id INTEGER NOT NULL AUTO_INCREMENT,regione VARCHAR(40), data DATE ,"
        "dataMorte DATE , sedeInail INTEGER, sesso TINYINT, luogoNascita VARCHAR(10), ICD10denunciato VARCHAR(10),"
        "ICD10accertato VARCHAR(10), asbestoCorrelata TINYINT, giorniIndennizzati INTEGER, settore VARCHAR(20),PRIMARY KEY (id));\n")
for regione in regioni:
    df = read_csv('data/dati/'+regione+'.csv')
    for i, row in enumerate(df.values):
        tmp=row.tolist();
        tmpsplitted=tmp[0].split(";")
        data = tmpsplitted[1]
        dataMorte= tmpsplitted[3]
        sedeInail=tmpsplitted[4]
        sesso=tmpsplitted[6]
        luogoNascita=tmpsplitted[7]
        ICD10denunciato=tmpsplitted[10]
        ICD10accertato=tmpsplitted[11]
        giorniIndennizzati=tmpsplitted[22]

        head, sep, tail = str(datetime.datetime.strptime(data, formatStr)).partition(' ');
        data=head;
        if (dataMorte!=""):
            head, sep, tail = str(datetime.datetime.strptime(dataMorte, formatStr)).partition(' ');
            dataMorte=head;
        if(tmpsplitted[6]=="M"):
            sesso=1;
        else:
            sesso=0;

        if (tmpsplitted[14] == "S"):
            asbestoCorrelata = 1;
        else:
            asbestoCorrelata = 0;

        if (tmpsplitted[23]=="I"):
            settore = "Industria";
        elif(tmpsplitted[23]=="A"):
            settore = "Agricoltura";
        elif(tmpsplitted[23]=="S"):
            settore= "Statale";
        else:
            settore= "Medico-Domestico";

        if(dataMorte!=""):
            f.write("INSERT INTO datisemestrali (regione, data, dataMorte, sedeInail, sesso, luogoNascita, ICD10denunciato, "
                    "ICD10accertato, asbestoCorrelata, giorniIndennizzati, settore) VALUES (\"" + regione + "\",\"" +
                    data + "\",\"" + dataMorte + "\"," +
                    str(sedeInail) + "," + str(sesso) + ",\"" + luogoNascita + "\",\"" + ICD10denunciato + "\",\"" +
                    ICD10accertato + "\", "+str(asbestoCorrelata)+", "+ str(giorniIndennizzati) +",\"" + settore + "\");\n");
        else:
            f.write("INSERT INTO datisemestrali (regione, data, sedeInail, sesso, luogoNascita, ICD10denunciato, "
                    "ICD10accertato, asbestoCorrelata, giorniIndennizzati, settore) VALUES (\"" + regione + "\",\"" +
                    data + "\"," +
                    str(sedeInail) + "," + str(sesso) + ",\"" + luogoNascita + "\",\"" + ICD10denunciato + "\",\"" +
                    ICD10accertato + "\", " + str(asbestoCorrelata) + ", " + str(
                giorniIndennizzati) + ",\"" + settore + "\");\n");
f.close();
