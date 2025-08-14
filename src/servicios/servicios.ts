import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import moment from 'moment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DomSanitizer } from '@angular/platform-browser';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class Servicios{
  Cargando: boolean = true;
  UsuMat: any = {FotPer:"fpdu.png"};
  UsuReg: any = {FotPer:"fpdu.png"};

  App: any = {
    Nombre: "QuickFix",
    EmaSop: "soporte@quickfix.com",
    WhaSop: "1234567",
    TelSop: "1234567",
  }

  ApiUrl: string = "http://45.91.108.32/quickfix/";
  // ApiUrl: string = "https://api.quickfixapp.com/";

  LatLon: any = {
    "Com":"",
    "Lat":"",
    "Lon":"",
    "Vel":"",
    "Ori":""
  };

  Pais: any = {
    Nombre: "Panamá",
    Codigo: "+507",
    CodWha: "507",
    Bandera:"banpan.png",
    Ayuda:"https://quickfix.com/page/ayuda",
    TerCon:"https://quickfix.com/page/terminos",
    PolDat:"https://quickfix.com/page/politicas",
    SimMon:"$",
    DecMon:"2",
    Lat:"8.98057981302293",
    Lon:"-79.52717798319162"
  }

  DGF: any = {};

  DatNot: any = {
    Todas:[],
    Membresia:[],
    Ordenes:[],
    Servicios:[],
    Soporte:[],
    Documentos:[],
  }

  DiaDis: number;

  LisPar: any;


  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public donSan: DomSanitizer
  ){
    this.VigGPS();
    this.CarLisPar();
  }

  async AccSobBDAA(Acc,Res,Cam,Val,CyV,Tab,Don,Ord,Sen,MosLoa){
    if (!this.Cargando){setTimeout(() => {this.Cargando = true;}, 100);}
    let JSONSend:any = {"acc":Acc,"res":Res,"cam":Cam,"val":Val,"cyv":CyV,"tab":Tab,"don":Don,"ord":Ord,"sen":Sen,"tok":window.localStorage.getItem("Token")};
    JSONSend = JSON.stringify(JSONSend);
    //console.log(JSONSend);
    let body:string = "jsonsend="+JSONSend;

    let headers:any = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options:any = ({headers:headers});
    let url:any = this.ApiUrl + "api/admbd.php";

    let dataRes = await this.http.post(url,body,options).toPromise();
    this.Cargando = false;
    //console.log(dataRes);
    setTimeout(() => {this.Cargando = false;}, 100);
    return dataRes;
  }

  VigGPS(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log(position);
        this.LatLon.Com = position.coords.latitude+","+position.coords.longitude+","+position.coords.heading+","+position.coords.speed;
        this.LatLon.Lat = position.coords.latitude;
        this.LatLon.Lon = position.coords.longitude;
        this.LatLon.Ori = position.coords.heading;
        this.LatLon.Vel = position.coords.speed;
        // console.log(this.LatLon)
        if (this.UsuMat){
          this.AccSobBDAA("UPDATE","No","","","UbiAct=|"+this.LatLon.Lat+","+this.LatLon.Lon+"|","usuarios","WHERE NRegistro="+this.UsuMat.NRegistro,"","",false).then((dataRes)=>{
            let Res: any = dataRes;
            //console.log(Res);
          }).catch((err)=>{console.log(err)});
        }

      }
    );
  }

  CarLisPar(){
    this.AccSobBDAA("SELECT","Si","*","","","parametros","","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.LisPar = Res.data;

      for (let n = 0; n < this.LisPar.length; n++) {
        if (this.LisPar[n].Clave == "LinDocAyu"){this.Pais.Ayuda = this.LisPar[n].Valor;}
        if (this.LisPar[n].Clave == "LinDocTer"){this.Pais.TerCon = this.LisPar[n].Valor;}
        if (this.LisPar[n].Clave == "LinDocPol"){this.Pais.PolDat = this.LisPar[n].Valor;}

        if (this.LisPar[n].Clave == "ConSopEma"){this.App.EmaSop = this.LisPar[n].Valor;}
        if (this.LisPar[n].Clave == "ConSopWha"){this.App.WhaSop = this.LisPar[n].Valor;}
        if (this.LisPar[n].Clave == "ConSopTel"){this.App.TelSop = this.LisPar[n].Valor;}
      }

    }).catch((err)=>{console.log(err)});
  }

  EnvNot(NRegUsu,Titulo,Mensaje,Accion,Datos){
    let Campos = "NRegUsu,Titulo,Contenido,Accion,Datos,FecHor";
    let Valores = NRegUsu+",|"+Titulo+"|,|"+Mensaje+"|,|"+Accion+"|,|"+Datos+"|,NOW()"
    this.AccSobBDAA("INSERT","No",Campos,Valores,"","noti","","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.EnvNotPus(NRegUsu,Titulo,Mensaje,Accion,Datos).then((dataRes)=>{
        let ResE: any = dataRes;
        console.log(ResE);
      }).catch((err)=>{console.log(err)});
    }).catch((err)=>{console.log(err)});
  }

  async EnvNotPus(NRegUsu,Tit,Men,Acc,Dat){
    let body:string = "NRegUsu=" + NRegUsu + "&Tit=" + Tit + "&Men=" + Men + "&Acc=" + Acc + "&Dat=" + Dat;
    let headers:any = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options:any = ({headers:headers});
    let url:any = this.ApiUrl + "api/sennotpus.php";

    let dataRes = await this.http.post(url,body,options).toPromise();
    //console.log(dataRes);
    return dataRes;
  }

  async EnvNotEma(Ema,Tit,Men){
    let body:string = "ema=" + Ema + "&tit=" + Tit + "&men=" + Men;
    let headers:any = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options:any = ({headers:headers});
    let url:any = this.ApiUrl + "api/sennotema.php";

    let dataRes = await this.http.post(url,body,options).toPromise();
    //console.log(dataRes);
    return dataRes;
  }

  async OlvCla(Email){
    let body:string = "ema=" + Email;
    let headers:any = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options:any = ({headers:headers});
    let url:any = this.ApiUrl + "api/olvcon.php";

    let dataRes = await this.http.post(url,body,options).toPromise();
    console.log(dataRes);
    return dataRes;
  }

  ActSal(){
    this.AccSobBDAA("SELECT","Si","Saldo","","","usuarios","WHERE NRegistro="+this.UsuMat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.UsuMat.Saldo = Res.data[0].Saldo;
    }).catch((err)=>{console.log(err.message)});
  }

  GetSanURL(URL) {
    return this.donSan.bypassSecurityTrustResourceUrl(URL);
  }

  ActResNue(){
    this.AccSobBDAA("UPDATE","No","","","Estatus=|Cancelada|","reservas","WHERE Estatus IN (|Nueva|,|Pendiente|) AND CURDATE() } FecHorRes","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
    }).catch((err)=>{console.log(err)});

    this.AccSobBDAA("UPDATE","No","","","Estatus=|Cumplida|","reservas","WHERE Estatus IN (|Confirmada|) AND CURDATE() } FecHorRes","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
    }).catch((err)=>{console.log(err)});

  }

  async TokTarPayu(TarCre){
    let JSONSend:any = TarCre;
    JSONSend = JSON.stringify(JSONSend);
    //console.log(JSONSend);

    let body:string = "jsonsend="+JSONSend;
    let headers:any = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options:any = ({headers:headers});
    let url:any = this.ApiUrl + "api/sdktoktar.php";

    let dataRes = await this.http.post(url,body,options).toPromise();
    // console.log(dataRes);

    return dataRes;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  ////////////////////////////////////////////////////////////////////////////////////

  CalDiaDis(){
    this.AccSobBDAA("SELECT","Si","*","","","usuarios","WHERE NRegistro = "+this.UsuMat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.UsuMat = Res.data[0];

      var FecAct = new Date().toISOString();
      var MFA = FecAct.split(".");
      FecAct = MFA[0].replace("T"," ");
      if (this.CalDiaEnt2Fec(this.UsuMat.FecHorFinMem,FecAct) < 0){
        this.DiaDis = 0;
      }else{
        this.DiaDis = this.CalDiaEnt2Fec(this.UsuMat.FecHorFinMem,FecAct)+2;
      }
    }).catch((err)=>{console.log(err.message)});
  }

  CalDiaEnt2Fec(FHPF,FHPA){
    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;
    var date;
    var dateMsec;
    var interval;
    var days;
    var hours;
    var minutes;
    var seconds;
    var MFH;
    var MF;
    var MH;

    //Fecha Mayor
    MFH = FHPF.split(" ");
    MF = MFH[0].split("-");
    MH = MFH[1].split(":");
    date = new Date(MF[0],MF[1],MF[2],MH[0],MH[1],MH[2]);
    dateMsec = date.getTime();
    
    //Fecha Menor
    MFH = FHPA.split(" ");
    MF = MFH[0].split("-");
    MH = MFH[1].split(":");
    date = new Date(MF[0],MF[1],MF[2],MH[0],MH[1],MH[2]);
    interval = dateMsec - date.getTime();
    
    //Calculos
    days = Math.floor(interval / msecPerDay );
    //interval = interval - (days * msecPerDay );
    //hours = Math.floor(interval / msecPerHour);
    //interval = interval - (hours * msecPerHour );
    //minutes = Math.floor(interval / msecPerMinute );
    //interval = interval - (minutes * msecPerMinute );
    //seconds = Math.floor(interval / 1000 );
    
    //Devolver resultado
    //return days + "," + hours + "," + minutes + "," + seconds;
    return days;
  }

  ObtNumSem(Fecha:Date){
    let DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;
    let DIAS_QUE_TIENE_UNA_SEMANA = 7;
    let JUEVES = 4;

    // Asegurémonos de trabajar con una fecha sin horas ni minutos
    Fecha = new Date(Date.UTC(Fecha.getFullYear(), Fecha.getMonth(), Fecha.getDate()));

    let diaDeLaSemana = Fecha.getUTCDay(); // Domingo es 0, sábado es 6
    if (diaDeLaSemana === 0) {
        diaDeLaSemana = 7;
    }

    Fecha.setUTCDate(Fecha.getUTCDate() - diaDeLaSemana + JUEVES);

    let inicioDelAño = new Date(Date.UTC(Fecha.getUTCFullYear(), 0, 1));
    let diferenciaDeFechasEnMilisegundos = Fecha.getTime() - inicioDelAño.getTime();

    return Math.ceil((diferenciaDeFechasEnMilisegundos / DIA_EN_MILISEGUNDOS + 1) / DIAS_QUE_TIENE_UNA_SEMANA);
  }

  ObtEda(Val){
    let MVal = Val.split(" ");
    let Nac=moment(MVal[0]);
    let Hoy=moment();
    return Hoy.diff(Nac,"years");
  }

  ObtDiaSem(Val){
    return moment(Val).locale("es").format('dddd');
  }

  ObtDiaMes(Val){
    let Res = moment(Val).format('DD - MM');
    return Res;
  }

  ObtAno(){
    return moment().format("yyyy");
  }

  ObtRelTimMom(Val){
    return moment(Val).locale("es").fromNow();
  }

  ObtAnoMesDia(Val){
    let Res = moment(Val).format('YYYY-MM-DD');
    return Res;
  }

  ObtFecForLar(Val){
    let Res = moment(Val).locale("es").format('LLLL');
    return Res;
  }

  ObtFecSumMes(Val,Mes){
    let MVal = Val.split(" ");
    let FeI=moment(MVal[0]);
    return FeI.add(Mes,"months").format("YYYY-MM-DD");
  }


  ////////////////////////////////////////////////////////////////////////////////////

  ColEstMod(PagAct,Dat){
    let DiaAla: number = 0;
    switch (PagAct) {

      case "Pagos":
        switch (Dat) {
          case "Nuevo":
            return "#32a9ad";
          case "Aceptado":
            return "#32ad32";
          case "Rechazado":
            return "#d46060";
        }

      case "Movimientos":
        return this.ColMon(Dat.Monto);

      /*
      case "CerSer":
        for (let n = 0; n < this.LisPar.length; n++) {
          if (this.LisPar[n].Clave == "AlaVenCer"){
            DiaAla = this.LisPar[n].Valor
          }
        }
        if (parseInt(Dat.DiaDis) > DiaAla){
          return "#32ad32";
        }else if (parseInt(Dat.DiaDis) <= DiaAla && parseInt(Dat.DiaDis) > 0){
          return "#ffc409";
        }else if (parseInt(Dat.DiaDis) <= 0){
          return "#cf5132";
        }

      case "IndSer":
        for (let n = 0; n < this.LisPar.length; n++) {
          if (this.LisPar[n].Clave == "AlaVenInd"){
            DiaAla = this.LisPar[n].Valor
          }
        }
        if (parseInt(Dat.DiaDis) > DiaAla){
          return "#32ad32";
        }else if (parseInt(Dat.DiaDis) <= DiaAla && parseInt(Dat.DiaDis) > 0){
          return "#ffc409";
        }else if (parseInt(Dat.DiaDis) <= 0){
          return "#cf5132";
        }

      case "ConSer":
        for (let n = 0; n < this.LisPar.length; n++) {
          if (this.LisPar[n].Clave == "AlaVenCon"){
            DiaAla = this.LisPar[n].Valor
          }
        }
        if (parseInt(Dat.DiaDis) > DiaAla){
          return "#32ad32";
        }else if (parseInt(Dat.DiaDis) <= DiaAla && parseInt(Dat.DiaDis) > 0){
          return "#ffc409";
        }else if (parseInt(Dat.DiaDis) <= 0){
          return "#cf5132";
        }

      case "PolSer":
        for (let n = 0; n < this.LisPar.length; n++) {
          if (this.LisPar[n].Clave == "AlaVenPol"){
            DiaAla = this.LisPar[n].Valor
          }
        }
        if (parseInt(Dat.DiaDis) > DiaAla){
          return "#32ad32";
        }else if (parseInt(Dat.DiaDis) <= DiaAla && parseInt(Dat.DiaDis) > 0){
          return "#ffc409";
        }else if (parseInt(Dat.DiaDis) <= 0){
          return "#cf5132";
        }
      */

      default:
        switch (Dat) {
          case "Activo":
            return "#32ad32";
          case "Activa":
            return "#32ad32";

          case "Inactivo":
            return "#d46060";
          case "Inactiva":
            return "#d46060";

          case "Bloqueado":
            return "#ad3232";
          case "Bloqueada":
            return "#ad3232";

          case "Pendiente":
            return "#ad5d32";

        }

    }
  }

  ColEstPro(Estatus){
    switch(Estatus){
      case "Nuevo":
        return "#60d49b";
      case "Pago":
        return "#29a5dc";
      case "Trabajando":
        return "#8832cf";
      case "Terminado":
        return "#32ad32";
    }
  }

  ColEstTra(Estatus){
    switch(Estatus){
      case "Nueva":
        return "#60d49b";
      case "Aceptada":
        return "#29a5dc";
      case "Rechazada":
        return "#cf5132";
      case "Saldo Retenido":
        return "#ffc409";
      case "Enviada":
        return "#8832cf";
      case "Recibida":
        return "#32ad32";
      case "Elevada":
        return "#cf5132";
    }
  }

  ColEstSol(Estatus){
    switch(Estatus){
      case "Pendiente":
          return "#f25213";
      case "Nueva":
        return "#60d49b";
      case "Pagada":
        return "#29a5dc";
      case "Aceptada":
        return "#29a5dc";
      case "Asignada":
        return "#29a5dc";
      case "Cerca":
        return "#32cf32";
      case "Iniciada":
        return "#f29b13";
      case "Finalizada":
        return "#8832cf";
      case "Calificado Agente":
        return "#8832cf";
      case "Cancelada Agente":
        return "#cf5132";
      case "Calificado Cliente":
        return "#8832cf";
      case "Cancelada Cliente":
        return "#cf5132";
      case "Terminado":
        return "#32ad32";
      case "En Devolucion":
        return "#f29b13";
      case "En Centro":
        return "#8832cf";
      case "Devuelto":
        return "#e99047";
    }
  }

  ColMon(Monto){
    if (Monto < 0){
      return "#f29b13";
    }else{
      return "#32cf32";
    }
  }

  EnvMsgSim(Men,Color){
    //alert(Men);
    var CSB
    switch (Color) {
      case "Normal":
        CSB = 'snackbar-normal'
      break;

      case "Informacion":
        CSB = 'snackbar-importante'
      break;

      case "Hecho":
        CSB = 'snackbar-funciono'
      break;

      case "Advertencia":
        CSB = 'snackbar-advertencia'
      break;

      case "Peligro":
        CSB = 'snackbar-error'
      break;

      default:
        CSB = 'snackbar-normal'
      break;
    }

    this.snackBar.open(Men,"",{duration:3000, panelClass:[CSB]});
    // this.snackBar.open(Men,"",{duration:3000, panelClass: ['alert-red']});
  }

  AliCamMod(Tipo){
    switch(Tipo){
      case "Texto":
        return "left";
      case "Email":
        return "left";
      case "Telefono":
        return "left";
      case "Entero":
        return "right";
      case "Numero":
        return "right";
      case "Moneda":
        return "right";
      case "Porcentaje":
        return "right";
      case "Select":
        return "center";
      case "SelectQry":
        return "left";
      case "Fecha":
        return "center";
      case "FechaHora":
        return "center";
      case "Imagen":
        return "center";
      case "Documento":
        return "center";
      case "Wallet":
        return "right";
      case "Geocerca":
        return "center";
      case "NumTarCre":
        return "center";
      case "VenTarCre":
        return "center";
      case "CodTarCre":
        return "center";
    }
  }

  ForCamMod(Valor,Cmp){
    switch(Cmp.Tip){
      case "Texto":
        return Valor;
      case "DiaSem":
        let TDS = "";
        let MND = Valor.split(",");
        for (let n = 0; n < MND.length; n++) {
          switch (n) {
            case 0:
              if (MND[n]==1) {TDS = "Lunes";}
            break;
            case 1:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Martes";}
            break;
            case 2:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Miercoles";}
            break;
            case 3:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Jueves";}
            break;
            case 4:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Viernes";}
            break;
            case 5:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Sabado";}
            break;
            case 6:
              if (MND[n]==1) {TDS = TDS+(TDS=="" ? "" : ", ")+"Domingo";}
            break;
          }
        }
        return TDS;

      case "HorDia":
        let THD = "";
        let MHD = Valor.split(",");
        THD = MHD[0]+":00 | "+MHD[1]+":00"
        return THD;

      case "Email":
        return Valor;
      case "Telefono":
        return Valor;
      case "Entero":
        return Valor;
      case "Numero":
        return this.NumFor(Valor);
      case "Moneda":
        return this.Pais.SimMon+this.NumFor(Valor);
      case "Porcentaje":
        return this.NumFor(Valor,2);
      case "Select":
        return Valor;
      case "SelectQry":
        var MCMP = Cmp.Qry.Cmps.split(",");
        for (var n = 0; n < Cmp.Qry.Res.length; n++){
          if (Cmp.Qry.Res[n][MCMP[0]] == Valor){
            if (Cmp.Qry.Res[n][MCMP[2]]){
              if (!Cmp.SelSec){
                return Cmp.Qry.Res[n][MCMP[1]]+" "+Cmp.Qry.Res[n][MCMP[2]];
              }else{
                return Cmp.Qry.Res[n][MCMP[1]];
              }
            }else{
              return Cmp.Qry.Res[n][MCMP[1]];
            }
          }
        }
        return "";

      case "Fecha":
        return this.ForFec(Valor);
      case "FechaHora":
        return this.ForFecHorPeq(Valor);
        //return this.ForFecHor(Valor);
      case "Imagen":
        return Valor;
      case "Documento":
        return Valor;
      case "Wallet":
        let ColWal = "";
        if (Valor == 0){
          ColWal = "#000";
        }else if (Valor < 0){
          ColWal = "#900";
        }else if (Valor > 0){
          ColWal = "#090";
        }
        return this.NumFor(Valor);

      case "NumTarCre":
        return "****-****-****-"+Valor.substr(-4);
      case "VenTarCre":
        return Valor;
      case "CodTarCre":
        return "**"+Valor.substr(-1);

      case "Geocerca":
        let re1 = /\)\!\(/gi;
        let re2 = /\(/gi;
        let re3 = /\)/gi;

        let Puntos = Valor.replace(" ","");
        Puntos = Puntos.replace(re1,"|");
        Puntos = Puntos.replace(re2,"");
        Puntos = Puntos.replace(re3,"");
    }
  }

  AjuFPRS(URL){
    let re = /\[\]/gi;
    URL = URL.replace(re,"&");
    return URL;
  }

  NumFor(amount,decimals=this.Pais.DecMon){
    let monori = amount;
    amount += '';
    amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));
    decimals = decimals || 0;
    if (isNaN(amount) || amount === 0){
      //return parseFloat('0').toFixed(decimals);
      if (decimals == 0){
        return '0';
      }else{
        return '0,'+'0'.repeat(decimals);
      }
    }
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');
    
    
    if (monori > 0){
      return amount_parts.join(',');
    }else{
      return "-"+amount_parts.join(',');
    }
  }

  GenCodAN(){
    let Caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let Codigo = "";
    for (let i=0; i<6; i++) Codigo +=Caracteres.charAt(Math.floor(Math.random()*Caracteres.length)); 
    //console.log(Codigo)
    return Codigo;
  }

  ForFec(Fec){
    var MF = Fec.split("-");
    return MF[2]+"-"+MF[1]+"-"+MF[0];
  }

  ForFecHor(FecHor){
    var MFH = FecHor.split(" ");
    var MF = MFH[0].split("-");
    return MF[2]+"-"+MF[1]+"-"+MF[0]+" "+MFH[1];
  }

  ForFecHorND(FecHor){//2024-07-11T20:33:31.890Z
    var MFHB = FecHor.split(".");
    var MFH = MFHB[0].split("T");
    var MF = MFH[0].split("-");
    return MF[0]+"-"+MF[1]+"-"+MF[2]+" "+MFH[1];
  }

  ForFecHorPeq(FecHor){
    var MFH = FecHor.replace("T"," ").split(" ");
    var MF = MFH[0].split("-");
    var MH = MFH[1].split(":");
    return MF[2]+"-"+MF[1]+"-"+MF[0].substr(-2)+" "+MH[0]+":"+MH[1];
  }

  async SubFotArc(Inp, Nom, Des){
    let ForDat = new FormData();
    ForDat.append("file",Inp.files[0],Nom);
    let dataRes = await this.http.post(this.ApiUrl+Des,ForDat).toPromise();
    return dataRes;
  }

  async SubDocArc(Inp, Nom, Des){
    let ForDat = new FormData();
    ForDat.append("file",Inp.files[0],Nom);
    let dataRes = await this.http.post(this.ApiUrl+Des,ForDat).toPromise();
    return dataRes;
  }

  ValCam(objX,nombre,tipo,valor,requerido){
    var obj = document.getElementById(objX);
    if (requerido == "Si" && (valor === "" || valor === null || valor === undefined)){
      this.EnvMsgSim("El campo "+nombre+" es requerido","Advertencia");

      if (obj){obj.style.backgroundColor = "#fff3cd";}
      return false;
    }else{
      if (obj){obj.style.backgroundColor = "#fff";}
    }
    
    var filter=/^[A-Za-z0-9_.-]*@[A-Za-z0-9.-_]+\.[A-Za-z0-9_.]+[A-za-z]$/;
    var filter2=/^[A-Za-z]*[0-9]/;
    var filter3=/^[A-Za-z]/;
    //var filter4=/^[0-9]$/;
    //var filter5=/^([0-2]\d):([0-5]\d):([0-5]\d)$/;
    //var filter6=/\d{3}(.\d{2})(.\d{2})(.\d{2})/;
    //var filter7=/^([0-9]){11}$/;
    var filter8=/^([0-9]){7,14}$/;
    var filter9=/^([0-9]){16}$/;
    var filter10=/^([0-9]{2})\/([0-9]{2})$/;
    var filter11=/^([0-9]){3}$/;
        
    switch (tipo){
      case "Texto":
        if (obj){obj.style.backgroundColor = "#fff";}
        return true;

      case "Cedula":
        if (filter2.test(valor)){
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }else{
          this.EnvMsgSim("El campo "+nombre+" debe ser una cédula válida","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }

      case "Telefono":
        if (filter8.test(valor)){
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }else{
          this.EnvMsgSim("El campo "+nombre+" debe ser un teléfono válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }
      
      case "Email":
        if (filter.test(valor)){
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }else{
          this.EnvMsgSim("El campo "+nombre+" debe ser un email válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }

      case "SolLet":
        if (filter3.test(valor)){
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }else{
          this.EnvMsgSim("El campo "+nombre+" debe ser solo letras","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }

      case "SolNum":
        if (!isNaN(valor)){
            if (obj){obj.style.backgroundColor = "#fff";}
            return true;
        }else{
          this.EnvMsgSim("El campo "+nombre+" debe ser solo números","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }

      case "Entero":
        if (isNaN(parseInt(valor))){
          this.EnvMsgSim("El campo "+nombre+" debe ser un número entero válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }else{
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }

      case "Numero":
        if (isNaN(parseFloat(valor))){
          this.EnvMsgSim("El campo "+nombre+" debe ser un número decimal válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }else{
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }

        case "NumPos":
          if (isNaN(parseFloat(valor)) || valor == 0){
            this.EnvMsgSim("El campo "+nombre+" debe ser válido","Advertencia");
            if (obj){obj.style.backgroundColor = "#fff3cd";}
            return false;
          }else{
            if (obj){obj.style.backgroundColor = "#fff";}
            return true;
          }

      case "Moneda":
        if (isNaN(parseFloat(valor))){
          this.EnvMsgSim("El campo "+nombre+" debe ser un número decimal válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }else{
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }

      case "Decimal":
        if (isNaN(parseFloat(valor))){
          this.EnvMsgSim("El campo "+nombre+" debe ser un número decimal válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }else{
          if (obj){obj.style.backgroundColor = "#fff";}
          return true;
        }

      case "Porcentaje":
        if (isNaN(parseFloat(valor))){
          this.EnvMsgSim("El campo "+nombre+" debe ser un Porcentaje válido","Advertencia");
          if (obj){obj.style.backgroundColor = "#fff3cd";}
          return false;
        }else{
          if (parseFloat(valor) > -1 && parseFloat(valor) < 101){
            if (obj){obj.style.backgroundColor = "#fff";}
            return true;
          }else{
            this.EnvMsgSim("El campo "+nombre+" debe ser un Porcentaje válido","Advertencia");
            if (obj){obj.style.backgroundColor = "#fff3cd";}
            return false;
          }
        }

      default:
        if (obj){obj.style.backgroundColor = "#fff";}
        return true;
    }
  }
}