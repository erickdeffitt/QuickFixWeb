import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Servicios } from '../../servicios/servicios';

import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexTheme, ApexPlotOptions, ApexDataLabels, ApexStroke, ApexTooltip, ApexNonAxisChartSeries, ApexResponsive, ApexLegend, ApexYAxis, ApexFill } from "ng-apexcharts";
export type ChartOptionsA = { series: ApexAxisChartSeries; chart: ApexChart; theme:ApexTheme; plotOptions: ApexPlotOptions; colors: String[]; xaxis: ApexXAxis; title: ApexTitleSubtitle; dataLabels: ApexDataLabels; stroke: ApexStroke; tooltip: ApexTooltip; };
export type ChartOptionsB = { series: ApexNonAxisChartSeries; chart: ApexChart; responsive: ApexResponsive[]; labels: any; title: ApexTitleSubtitle; legend: ApexLegend; };
export type ChartOptionsC = { series: ApexAxisChartSeries; chart: ApexChart; dataLabels: ApexDataLabels; title: ApexTitleSubtitle; plotOptions: ApexPlotOptions; legend: ApexLegend;  colors: string[]; };
export type ChartOptionsD = { series: ApexAxisChartSeries; chart: ApexChart; dataLabels: ApexDataLabels; plotOptions: ApexPlotOptions; stroke: ApexStroke; xaxis: ApexXAxis; yaxis: ApexYAxis; colors: string[]; fill: ApexFill; legend: ApexLegend; title: ApexTitleSubtitle; };

declare var google: any;

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrl: './adm.component.scss'
})
export class AdmComponent {
  @ViewChild('InpFot') InpFot: ElementRef;
  @ViewChild('InpDoc') InpDoc: ElementRef;

  MenAct: string = "Inicio";
  PagAct: string = "Inicio";
  PagActAcc: string = "";
  PagActDet: string = "";
  ValBus: string = "";

  DetDat: any;
  DesFot: string = "";
  DesDoc: string = "";

  REVNOT: any;

  //////////Dash////////////
  @ViewChild("GraAEle") GraAEle: ChartComponent;
  GraA: Partial<ChartOptionsA>;

  @ViewChild("GraBEle") GraBEle: ChartComponent;
  GraB: Partial<ChartOptionsB>;

  @ViewChild("GraCEle") GraCEle: ChartComponent;
  GraC: Partial<ChartOptionsC>;

  @ViewChild("GraDEle") GraDEle: ChartComponent;
  GraD: Partial<ChartOptionsD>;

  AnoAct: number = new Date().getFullYear();
  InpFilDesLea: string;
  InpFilHasLea: string;

  //////////Login///////////
  Email: string = "";
  Pass: string = "";
  Token: string = "";

  //////////Ayuda//////////
  @ViewChild('CloModAyu') CloModAyu: ElementRef;
  ModMod: string = "";
  TitMod: string = "";
  LisPre: any;

  //////////Mensajes///////
  LisMem: any;
  MemSel: any;
  MemAct: any;

  //////////Mensajes///////
  MemPar: string = "";
  Titulo: string = "";
  Mensaje: string = "";
  LisUsu: any;

  //////////Perfil//////////
  Cargando: string = "";
  @ViewChild('mapD') mapRefD: ElementRef;
  CarMapD: boolean = false;
  mapD: any;

  //////////Modulo//////////
  @ViewChild('CloModFDA') CloModFDA: ElementRef;
  DGM: any = {}
  DatRes: any;
  DonBus: string = "";
  OJE: any = [];

  //////////Asignacion//////////
  @ViewChild('CloModAsiAsi') CloModAsiAsi: ElementRef;

  //////////Rentas - Ventas/////
  @ViewChild('CloModAsiRen') CloModAsiRen: ElementRef;
  @ViewChild('CloModHerRen') CloModHerRen: ElementRef;

  //////////Ferreterías//////////
  @ViewChild('CloModAsiFer') CloModAsiFer: ElementRef;
  @ViewChild('CloModHerFer') CloModHerFer: ElementRef;








  //////////Cupones//////////
  @ViewChild('CloModCup') CloModCup: ElementRef;
  @ViewChild('mapA') mapRefA: ElementRef;
  CarMapA: boolean = false;
  mapA: any;

  //////////Servicios/////////
  @ViewChild('CloModSer') CloModSer: ElementRef;
  @ViewChild('mapB') mapRefB: ElementRef;
  CarMapB: boolean = false;
  mapB: any;

  //////////Eventos/////////
  @ViewChild('CloModEve') CloModEve: ElementRef;
  @ViewChild('mapC') mapRefC: ElementRef;
  CarMapC: boolean = false;
  mapC: any;

  //////////Envios//////////
  @ViewChild('CloModEnv') CloModEnv: ElementRef;

  //////////Abonos//////////
  @ViewChild('IcoAboSal') IcoAboSal: ElementRef;
  @ViewChild('CloModAbo') CloModAbo: ElementRef;

  constructor(
    public router: Router,
    public servicios: Servicios
  ) {
    
  }

  ngOnInit(): void {
    // window.localStorage.setItem("Token","");
    this.Token = window.localStorage.getItem("Token");
    if (this.Token != "" && this.Token != null && this.Token != undefined){this.Login();}
  }

  ngAfterViewInit(){
    this.RevNot();
    if (!this.REVNOT){this.REVNOT = setInterval(() =>{
      this.RevNot();
    },10000);}
  }

  RevNot(){
    if (!this.servicios.UsuMat.NRegistro){clearInterval(this.REVNOT); return;}
    this.servicios.AccSobBDAA("SELECT","Si","*","","","noti","WHERE NRegUsu="+this.servicios.UsuMat.NRegistro+" AND Estatus=|Nueva|","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      if (Res.data.length > 0){
        for (let n = 0; n < Res.data.length; n++) {
          this.servicios.DatNot.Todas.push(Res.data[n]);

          switch (Res.data[n].Accion){
            case "Visita":
              this.servicios.DatNot.Vis.push(Res.data[n]);
            break;
            case "Incidente":
              this.servicios.DatNot.Inc.push(Res.data[n]);
            break;
            case "Chat":
              this.servicios.DatNot.Chat.push(Res.data[n]);
            break;
            case "Membresia":
              this.servicios.DatNot.Membresia.push(Res.data[n]);
            break;
            case "Soporte":
              this.servicios.DatNot.Soporte.push(Res.data[n]);
            break;
          }
        }

        this.servicios.AccSobBDAA("UPDATE","No","","","Estatus=|Vista|","noti","WHERE NRegUsu="+this.servicios.UsuMat.NRegistro+" AND Estatus=|Nueva|","","",false).then((dataRes)=>{
          let ResB: any = dataRes;
          //console.log(Res);
        }).catch((err)=>{console.log(err)});
      }
    }).catch((err)=>{console.log(err)});
  }

  //////////////////////////////////Dash///////////////////////////////////////
  IniGra(){
    this.GraA = {
      series: [{name: "Eventos", data: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5]}],
      chart: {height: 300, type: "area",toolbar:{show:true,tools:{download:true,zoom:false,zoomin:false,zoomout:false,pan:false,reset:false}}},
      title: {text: "", align: "center"},
      dataLabels: {enabled: false},
      stroke: {curve: "smooth"},
      xaxis: {categories: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]},
      colors: ["#775dd0"]
    };

    this.GraB = {
      series: [5, 6, 7, 8, 9, 10, 1, 2, 3, 4],
      chart: {height: 300,type: "donut",toolbar:{show:true,tools:{download:true,zoom:false,zoomin:false,zoomout:false,pan:false,reset:false}}},
      title: {text: "",align: "center"},
      labels: ["Informática", "Legal", "Música", "Ocio", "Moda", "Servicios", "Industria", "Salud", "Comercio", "Educación"],
      legend: {horizontalAlign: "left"}
    };

    this.GraC = {
      series: [
        {
          data: [
            {x: "Informática",y: 5},
            {x: "Legal",y: 6},
            {x: "Música",y: 7},
            {x: "Ocio",y: 8},
            {x: "Moda",y: 9},
            {x: "Servicios",y: 10},
            {x: "Industria",y: 1},
            {x: "Salud",y: 2},
            {x: "Comercio",y: 3},
            {x: "Educación",y: 4}
          ]
        }
      ],
      legend: {show: false},
      chart: {height: 300,type: "treemap",toolbar:{show:true,tools:{download:true,zoom:false,zoomin:false,zoomout:false,pan:false,reset:false}}},
      title: {text: "",align: "center"},
      plotOptions: {treemap: {distributed: true,enableShades: false}}
    };

    this.GraD = {
      series: [{name: "Eventos", data: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5]}],
      chart: {
        type: "bar",
        height: 300,
        toolbar:{show:true,tools:{download:true,zoom:false,zoomin:false,zoomout:false,pan:false,reset:false}}
      },
      title: {text: "",align: "center"},
      xaxis: {categories: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]},
      fill: {opacity: 1},
      colors: ["#fcba39"],
      legend: {position: "bottom",horizontalAlign: "center"},
      plotOptions: {bar: {horizontal: true}},
    };


    this.ActGraA();
    this.ActGraB();
    this.ActGraC();
    this.ActGraD();
  }

  ActGraA(){
    this.servicios.AccSobBDAA("SELECT","Si","MONTH(FecHorEve) Mes, COUNT(FecHorEve) TM","","","eventos","WHERE "+(this.servicios.UsuMat.Tipo == "Tecnico" ? " NRegUsu = "+this.servicios.UsuMat.NRegistro+"" : "1=1"),"GROUP BY Mes","",true).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      let DatMes = [0,0,0,0,0,0,0,0,0,0,0,0]
      for (let n = 0; n < Res.data.length; n++) {
        DatMes[(Res.data[n].Mes-1)] = parseFloat(Res.data[n].TM)
      }
      setTimeout(() => {this.GraAEle.updateSeries([{name: "Servicios",data: DatMes}])}, 500);
    }).catch((err)=>{console.log(err)});
  }

  ActGraB(){
    this.servicios.AccSobBDAA("SELECT","Si","(SELECT Nombre FROM categorias WHERE NRegistro=A.Categorias) NC, COUNT(Categorias) TC","","","servicios A","WHERE "+(this.servicios.UsuMat.Tipo == "Tecnico" ? " NRegUsu = "+this.servicios.UsuMat.NRegistro+"" : "1=1"),"GROUP BY Categorias","",true).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      let EtiCat = []
      let DatCat = [];
      for (let n = 0; n < Res.data.length; n++) {
        EtiCat.push(Res.data[n].NC)
        DatCat.push(parseFloat(Res.data[n].TC))
      }

      setTimeout(() => {
        this.GraBEle.updateOptions({labels: EtiCat})
        this.GraBEle.updateSeries(DatCat);
      }, 500);
    }).catch((err)=>{console.log(err)});
  }

  ActGraC(){
    this.servicios.AccSobBDAA("SELECT","Si","(SELECT Nombre FROM categorias WHERE NRegistro=A.Categorias) NC, COUNT(Categorias) TC","","","servicios A","WHERE "+(this.servicios.UsuMat.Tipo == "Tecnico" ? " NRegUsu = "+this.servicios.UsuMat.NRegistro+"" : "1=1"),"GROUP BY Categorias","",true).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      let DatCat = [];
      for (let n = 0; n < Res.data.length; n++) {
        DatCat.push({x:Res.data[n].NC,y:Res.data[n].TC});
      }
      setTimeout(() => {
        this.GraCEle.updateSeries([{data: DatCat},])
      }, 500);
    }).catch((err)=>{console.log(err)});
  }

  ActGraD(){
    this.servicios.AccSobBDAA("SELECT","Si","MONTH(FecHorEve) Mes, COUNT(FecHorEve) TM","","","eventos","WHERE "+(this.servicios.UsuMat.Tipo == "Tecnico" ? " NRegUsu = "+this.servicios.UsuMat.NRegistro+"" : "1=1"),"GROUP BY Mes","",true).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      let DatMes = [0,0,0,0,0,0,0,0,0,0,0,0]
      for (let n = 0; n < Res.data.length; n++) {
        DatMes[(Res.data[n].Mes-1)] = Res.data[n].TM
      }
      setTimeout(() => {
        this.GraDEle.updateSeries([{name: "Envios",data: DatMes}])
      }, 500);
    }).catch((err)=>{console.log(err)});
  }

  //////////////////////////////////Dash///////////////////////////////////////

  //////////////////////////////////Login//////////////////////////////////////
  Login(){
    if(this.Email != "" && this.Pass != "" || this.Token != ""){
      this.servicios.AccSobBDAA("LOGINADM","Si","",this.Email+","+btoa(this.Pass)+","+this.Token,"","","","","",true).then((dataRes)=>{
        let Res: any = dataRes;
        //console.log(Res);
    
        if (Res.data.length > 0){
          window.localStorage.setItem("Token",Res.data[0].Token);
          switch(Res.data[0].Estatus){
            case "Activo":
              window.localStorage.setItem("Token",Res.data[0].Token);
              this.servicios.UsuMat = Res.data[0];
              // console.log(this.servicios.UsuMat);
              this.MosPag("Inicio");
            break;
  
            case "Nuevo":
              this.servicios.EnvMsgSim("Por favor espere la verificación de su usuario","Advertencia");
            break;

            case "Bloqueado":
              this.servicios.EnvMsgSim("Su usuario esta bloqueado","Peligro");
            break;
          }
        }else{
          this.servicios.EnvMsgSim("Usuario y/o contraseña invalida","Advertencia");
        }
      }).catch((err)=>{console.log(err)});
    }else{
      this.servicios.EnvMsgSim("Por favor complete los campos","Advertencia");
    }
  }
  Logout(){
    this.Email = ""
    this.Pass = ""
    this.Token = ""
    window.localStorage.setItem("Token","");
    this.PagAct = "Inicio";
    this.servicios.UsuMat = {};
  }
  OlvCon(){
    if (!this.servicios.ValCam("Email","Correo electrónico","Email",this.Email,"Si")){return}
    // this.RecCon = "Eje";
    this.servicios.OlvCla(this.Email).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      if (Res.estatus == "success"){
        this.servicios.EnvMsgSim("Por favor verifique la bandeja de entrada de "+this.Email,"Hecho");
      }else{
        this.servicios.EnvMsgSim("El Email "+this.Email+" no esta registrado en la base de datos","Advertencia");
      }
      // this.RecCon = "";
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Login//////////////////////////////////////

  //////////////////////////////////Perfil/////////////////////////////////////
  ProPro(){
    this.PerCarLisCat();
    this.IniMapPer();
  }

  PerCarLisCat(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(|No|) Sel","","","categorias","WHERE Estatus=|Activa|","ORDER BY Nombre","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);

      let CatSel = this.servicios.UsuMat.Categorias.split(",");
      for (let n = 0; n < CatSel.length; n++) {
        for (let n2 = 0; n2 < Res.data.length; n2++) {
          if (CatSel[n] == Res.data[n2].NRegistro){Res.data[n2].Sel = "Si"}
        }
      }
      this.servicios.UsuMat.LisCat = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  PerSelCat(Ite){
    if (Ite.Sel == "No"){
      Ite.Sel = "Si"
    }else{
      Ite.Sel = "No"
    }
  }

  CarLisPai(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","paises","","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.servicios.UsuMat.LisPai = Res.data;
    }).catch((err)=>{console.log(err)});
  }

  ActPer(){
    if (!this.servicios.ValCam("Nombre","Nombre","Texto",this.servicios.UsuMat.Nombre,"Si")){return;}

    if (this.servicios.UsuMat.Tipo != 'Tecnico'){
      if (!this.servicios.ValCam("Apellido","Apellido","Texto",this.servicios.UsuMat.Apellido,"Si")){return;}
    }else{
      if (!this.servicios.ValCam("Descripcion","Descripción","Texto",this.servicios.UsuMat.Descripcion,"Si")){return;}
    }

    if (!this.servicios.ValCam("Email","Email","Email",this.servicios.UsuMat.Email,"Si")){return;}
    if (!this.servicios.ValCam("CodPai","Código Pais","CodPai",this.servicios.UsuMat.CodPai,"Si")){return;}
    if (!this.servicios.ValCam("Telefono","Teléfono","Telefono",this.servicios.UsuMat.Telefono,"Si")){return;}

    if (this.servicios.UsuMat.Tipo == 'Tecnico'){
      if (!this.servicios.ValCam("WebSite","WebSite","Texto",this.servicios.UsuMat.WebSite,"Si")){return;}
      if (!this.servicios.ValCam("Horario","Horario","Texto",this.servicios.UsuMat.Horario,"Si")){return;}
      if (!this.servicios.ValCam("Descuento","Descuento","Porcentaje",this.servicios.UsuMat.Descuento,"Si")){return;}


      if (this.servicios.UsuMat.Imagen == "fpdv.png"){
        this.servicios.EnvMsgSim("Por favor seleccione una Imagen Principal","Advertencia");
        return;
      }

      let CatSel = [];
      for (let n = 0; n < this.servicios.UsuMat.LisCat.length; n++) {
        if (this.servicios.UsuMat.LisCat[n].Sel == "Si"){
          CatSel.push(this.servicios.UsuMat.LisCat[n].NRegistro)
        }
      }
      if (CatSel.length == 0){
        this.servicios.EnvMsgSim("Por favor seleccione al menos una Categoría","Advertencia");
        return;
      }
      this.servicios.UsuMat.Categorias = CatSel.join(",");

      if (this.servicios.UsuMat.LatLon == ""){
        this.servicios.EnvMsgSim("Por favor seleccione una Dirección","Advertencia");
        return;
      }
    }

    this.servicios.AccSobBDAA("UPDATE","No","","","Nombre=|"+this.servicios.UsuMat.Nombre+"|,Apellido=|"+this.servicios.UsuMat.Apellido+"|,Descripcion=|"+this.servicios.UsuMat.Descripcion+"|,Email=|"+this.servicios.UsuMat.Email+"|,CodPai=|"+this.servicios.UsuMat.CodPai+"|,Telefono=|"+this.servicios.UsuMat.Telefono+"|,WebSite=|"+this.servicios.UsuMat.WebSite+"|,Horario=|"+this.servicios.UsuMat.Horario+"|,Descuento=|"+this.servicios.UsuMat.Descuento+"|,FotPer=|"+this.servicios.UsuMat.FotPer+"|,Imagen=|"+this.servicios.UsuMat.Imagen+"|,Foto1=|"+this.servicios.UsuMat.Foto1+"|,Foto2=|"+this.servicios.UsuMat.Foto2+"|,Foto3=|"+this.servicios.UsuMat.Foto3+"|,Foto4=|"+this.servicios.UsuMat.Foto4+"|,Foto5=|"+this.servicios.UsuMat.Foto5+"|,Foto6=|"+this.servicios.UsuMat.Foto6+"|,Categorias=|"+this.servicios.UsuMat.Categorias+"|,Direccion=|"+this.servicios.UsuMat.Direccion+"|,LatLon=|"+this.servicios.UsuMat.LatLon+"|","usuarios","WHERE NRegistro="+this.servicios.UsuMat.NRegistro,"","",true).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.servicios.EnvMsgSim("Los datos fueron actualizados","Hecho");
    }).catch((err)=>{console.log(err)});
  }

  IniMapPer(){
    this.CarMapD = true;
    setTimeout(() => {this.showMapD().then(()=>{this.CarMapD = false;});}, 250);
  }

  async showMapD(){
    // console.log(this.mapD);
    // if (this.mapD){return}

    var location;
    if (this.servicios.UsuMat.NRegistro && this.servicios.UsuMat.LatLon != ""){
      var ULLM = this.servicios.UsuMat.LatLon.split(",");
      location = new google.maps.LatLng(parseFloat(ULLM[0]),parseFloat(ULLM[1]));
      //console.log(parseFloat(ULLM[0])+"/"+parseFloat(ULLM[1]))
    }else{
      location = new google.maps.LatLng(this.servicios.Pais.Lat,this.servicios.Pais.Lon);
    }

    let TMSU = "roadmap";
    if (window.localStorage.getItem("TipMap") == "roadmap" || window.localStorage.getItem("TipMap") == "hybrid"){
      TMSU = window.localStorage.getItem("TipMap")
    }

    const options = {
      center: location,
      zoom: this.servicios.UsuMat.NRegistro  ? 15 : 10,
      // mapTypeControl: true,
      mapTypeId: TMSU,
      // streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_TOP},
      // fullscreenControl: true,
      // fullscreenControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM}
    }

    let ThiRef = this;
    const map = new google.maps.Map(this.mapRefD.nativeElement, options);
    this.mapD = map;

    google.maps.event.addListener( map, 'maptypeid_changed', function() { 
      console.log(map.getMapTypeId())
      window.localStorage.setItem("TipMap",map.getMapTypeId());
    });

    const CliMar = new google.maps.Marker({
      id: "IDMCSCli",
      position: location,
      map: map
    });
    if (!this.servicios.UsuMat.NRegistro){CliMar.setVisible(false);}

    const geocoder = new google.maps.Geocoder;

    map.addListener('click', function(e) {
      CliMar.setPosition(e.latLng);
      map.panTo(CliMar.getPosition());
      map.setZoom(16);
      infowindow.setContent("...");
      geocoder.geocode({'location': e.latLng}, function(results, status) {
        if (status === 'OK'){
          if (results[0]) {
            let Bar = "";
            let Ciu = "";
            let Dep = "";
            let Dir = "";
            let Coo = "";
            for (let n = 0; n < results[0].address_components.length; n++) {
              if (results[0].address_components[n].types[0] == "political"){ //Barrio
                console.log(results[0].address_components[n].long_name,"Barrio");
                Bar = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "locality"){ //Ciudad
                console.log(results[0].address_components[n].long_name,"Ciudad");
                Ciu = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "administrative_area_level_1"){ //Departamento
                console.log(results[0].address_components[n].long_name,"Departamento");
                Dep = results[0].address_components[n].long_name;
              }
            }
            Dir = results[0].formatted_address;
            Coo = e.latLng.lat()+","+e.latLng.lng();
            ThiRef.ActDirD(Bar,Ciu,Dep,Dir,Coo);

            infowindow.setContent(results[0].formatted_address);
            document.getElementById("BusDes").innerHTML = results[0].formatted_address;
            document.getElementById("BusLatLon").innerHTML = e.latLng.lat()+","+e.latLng.lng();
            infowindow.open(map, CliMar);
          }else{
            document.getElementById("BusDes").innerHTML = "Sin resultados";
          }
        }else{
          document.getElementById("BusDes").innerHTML = "Sin resultados";
        }
      });
    });

    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById("InpBusDonD");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    })

    return;
  }

  ActDirD(Bar,Ciu,Dep,Dir,Coo){
    this.servicios.UsuMat.OriBar = Bar;
    this.servicios.UsuMat.OriCiu = Ciu;
    this.servicios.UsuMat.OriDep = Dep;
    this.servicios.UsuMat.Direccion = Dir;
    this.servicios.UsuMat.LatLon = Coo;
  }


  //////////////////////////////////Perfil/////////////////////////////////////

  //////////////////////////////////Mensajes///////////////////////////////////
  Enviar(){
    if (!this.servicios.ValCam("MemPar","Mensaje para","Texto",this.MemPar,"Si")){return;}
    if (!this.servicios.ValCam("Titulo","Titulo","Texto",this.Titulo,"Si")){return;}
    if (!this.servicios.ValCam("Mensaje","Mensaje","Texto",this.Mensaje,"Si")){return;}

    var FilUsu: string = "";
    switch(this.MemPar){
      case "Técnicos":
        FilUsu = "WHERE Tipo = |Tecnico|";
      break;
      case "Clientes":
        FilUsu = "WHERE Tipo = |Cliente|";
      break;
      case "Todos":
        FilUsu = "WHERE Tipo IN (|Tecnico|,|Asesor|,|Cliente|)";
      break;
      default:
        FilUsu = "WHERE NRegistro = "+this.MemPar;
      break;
    }

    this.servicios.AccSobBDAA("EJECUTA","No","","","","","","","INSERT INTO meneme (NRegUsu,Titulo,Mensaje,FecHor) SELECT NRegistro,|"+this.Titulo+"|,|"+this.Mensaje+"|,NOW() FROM usuarios "+FilUsu,true).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.MemPar = "";
      this.Titulo = "";
      this.Mensaje = "";
      this.servicios.EnvMsgSim("El Mensaje Emergente fue enviado a los usuarios","Informacion");
    }).catch((err)=>{console.log(err)});

    this.servicios.AccSobBDAA("SELECT","Si","*","","","usuarios",FilUsu,"ORDER BY Tipo,Nombre,Apellido","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      for (let n = 0; n < Res.data.length; n++) {
        this.servicios.EnvNot(Res.data[n].NRegistro,"Nuevo mensaje","Recibiste un nuevo mensaje","Mensaje",0)
      }
    }).catch((err)=>{console.log(err)});
  }

  CarLisUsu(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","usuarios","WHERE Tipo IN (|Tecnico|,|Cliente|)","ORDER BY Tipo,Nombre,Apellido","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.LisUsu = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Mensajes///////////////////////////////////
  
  //////////////////////////////////Ayuda///////////////////////////////////
  PreAyu(Mod){
    this.ModMod = Mod;
    switch (Mod) {
      case "Pre":
        this.TitMod = "Preguntas frecuentes";
        this.CarLisPreFre();
      break;
      case "Man":
        this.TitMod = "Manual de usuario";
      break;
      case "Con":
        this.TitMod = "Contacto con soporte";
      break;
      case "Eli":
        this.TitMod = "Eliminar mis datos";
      break;
    }
  }

  CarLisPreFre(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","prefre","WHERE Usuario=|"+this.servicios.UsuMat.Tipo+"|","ORDER BY Tema","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.LisPre = Res.data;
    }).catch((err)=>{console.log(err)});
  }

  //////////////////////////////////Ayuda///////////////////////////////////



  //////////////////////////////////Membresias///////////////////////////////////

  PagMem(Mem){
    this.MemSel = Mem;
    let Campos = "NRegUsu,NRegMem,Monto,Duracion,FecHorReg";
    let Valores = this.servicios.UsuMat.NRegistro+","+Mem.NRegistro+","+Mem.Precio+","+Mem.Duracion+",NOW()"
    this.servicios.AccSobBDAA("INSERT","No",Campos,Valores,"","mempag","","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      Mem.LID = Res.lastinsertid;
      this.MemAct = Mem;
      //console.log(Res);
      this.servicios.EnvMsgSim("El pago de la Membresía sera aprobado automaticamente, mientras se desarrolla la pasarela de pago","Advertencia");
      this.ProFalPagMem(Res.lastinsertid);
      // this.IniPas(Res.lastinsertid);
    }).catch((err)=>{console.log(err.message)});
  }
  ProFalPagMem(NRM){
    let SSD: string = ""
    if (this.servicios.UsuMat.FecHorIniMem == "0000-00-00 00:00:00"){
      SSD = "NRegMem="+this.MemSel.NRegistro+", FecHorIniMem = NOW(), FecHorFinMem = DATE_ADD(NOW(),INTERVAL 30 DAY)";
    }else{
      SSD = "NRegMem="+this.MemSel.NRegistro+", FecHorIniMem = FecHorFinMem, FecHorFinMem = DATE_ADD(FecHorFinMem,INTERVAL 30 DAY)";
    }

    this.servicios.AccSobBDAA("UPDATE","No","","",SSD,"usuarios","WHERE  NRegistro = "+this.servicios.UsuMat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.servicios.CalDiaDis();
    }).catch((err)=>{console.log(err.message)});

    this.servicios.AccSobBDAA("UPDATE","No","","","Estatus = 'Aceptado', FecHorPro=NOW()","mempag","WHERE  NRegistro = "+NRM,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
    }).catch((err)=>{console.log(err.message)});
    this.servicios.EnvNot(this.servicios.UsuMat.NRegistro,"Contrato de Membresía","La membresía "+this.MemAct.Descripcion+" fue contratada","Membresia",this.MemAct.NRegistro)
  }


  CarLisMem(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","membresias","WHERE TipUsu=|Tecnico|","ORDER BY Precio","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.LisMem = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Membresias///////////////////////////////////



  //////////////////////////////////Cupones//////////////////////////////////////
  ProCup(Acc,Cup){
    // console.log(Acc);
    // console.log(Cup);
    this.DetDat = Cup;
    this.DetDat.Acc = Acc;
    this.DetDat.TabAct = 0;

    if (!this.DetDat.NRegistro){
      this.DetDat.NRegUsu = this.servicios.UsuMat.NRegistro;
      this.DetDat.Categorias = "";
      this.DetDat.Direccion = "";
      this.DetDat.LatLon = "";
      this.DetDat.Imagen = "fpdc.png";
      this.DetDat.Foto1 = "fpdc.png";
      this.DetDat.Foto2 = "fpdc.png";
      this.DetDat.Foto3 = "fpdc.png";
      this.DetDat.Foto4 = "fpdc.png";
      this.DetDat.Foto5 = "fpdc.png";
      this.DetDat.Foto6 = "fpdc.png";
    }else{
      this.DetDat.PasTab0 = true;
      this.DetDat.PasTab1 = true;
      this.DetDat.PasTab2 = true;
      this.DetDat.PasTab3 = true;
    }

    this.CupCarLisCat();
  }

  CupCarLisCat(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(|No|) Sel","","","categorias","WHERE Estatus=|Activa|","ORDER BY Nombre","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      if (this.DetDat.NRegistro){
        let CatSel = this.DetDat.Categorias.split(",");
        for (let n = 0; n < CatSel.length; n++) {
          for (let n2 = 0; n2 < Res.data.length; n2++) {
            if (CatSel[n] == Res.data[n2].NRegistro){Res.data[n2].Sel = "Si"}
          }
        }
      }
      this.DetDat.LisCat = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  CupSelCat(Ite){
    if (Ite.Sel == "No"){
      Ite.Sel = "Si"
    }else{
      Ite.Sel = "No"
    }
  }

  TabSelCup(Ind: number){
    // console.log(Ind)
    this.DetDat.TabAct = Ind;
    if (Ind == 3){this.IniMapCup();}
  }
  SigPesCup(){
    if (this.DetDat.Imagen == "fpdc.png"){
      this.servicios.EnvMsgSim("Por favor seleccione una imagen","Advertencia");
      this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;
    }
    if (!this.servicios.ValCam("IBCupNom","Nombre","Texto",this.DetDat.Nombre,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupDes","Descripción","Texto",this.DetDat.Descripcion,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupDescuento","Descuento %","Porcentaje",this.DetDat.Descuento,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupCanCupLim","Cantidad Cupones","Entero",this.DetDat.CanCupLim,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupFecHorLim","Fecha Limite","Texto",this.DetDat.FecHorLim,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupEdaMin","Edad Mínima","Entero",this.DetDat.EdaMin,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBCupEdaMax","Edad Máxima","Entero",this.DetDat.EdaMax,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}

    this.DetDat.PasTab0 = true;
    this.DetDat.TabAct = 1;

    let CatSel = [];
    for (let n = 0; n < this.DetDat.LisCat.length; n++) {
      if (this.DetDat.LisCat[n].Sel == "Si"){
        CatSel.push(this.DetDat.LisCat[n].NRegistro)
      }
    }
    if (CatSel.length == 0){
      this.servicios.EnvMsgSim("Por favor seleccione al menos una Categoría","Advertencia");
      this.DetDat.PasTab1 = false; this.DetDat.TabAct = 1; return;
    }

    this.DetDat.Categorias = CatSel.join(",");
    // console.log(this.DetDat.Categorias);
    this.DetDat.PasTab1 = true
    this.DetDat.TabAct = 2;

    if (!this.servicios.ValCam("IBCupUso","Forma de Usar","Texto",this.DetDat.Uso,"Si")){this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;}
    if (!this.servicios.ValCam("IBCupCon","Condiciones","Texto",this.DetDat.Condiciones,"Si")){this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;}
    if (!this.servicios.ValCam("IBCupRes","Restricciones","Texto",this.DetDat.Restricciones,"Si")){this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;}
    if (!this.servicios.ValCam("IBCupTer","Términos","Texto",this.DetDat.TerCon,"Si")){this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;}

    this.DetDat.PasTab2 = true
    this.DetDat.TabAct = 3;


    if (this.DetDat.Direccion == "" || this.DetDat.LatLon == ""){
      this.servicios.EnvMsgSim("Por favor seleccione la ubicación en el mapa","Advertencia");
      this.DetDat.PasTab3 = false; this.DetDat.TabAct = 3; return;
    }
    this.DetDat.PasTab3 = true

    // console.log(this.DetDat);

    if (!this.DetDat.NRegistro){
      let Campos = "NRegUsu,Imagen,Nombre,Descripcion,"
      Campos = Campos+"Descuento,CanCupLim,FecHorLim,EdaMin,EdaMax,"
      Campos = Campos+"Foto1,Foto2,Foto3,Foto4,Foto5,Foto6,"
      Campos = Campos+"Categorias,Uso,Condiciones,Restricciones,TerCon,"
      Campos = Campos+"Direccion,LatLon,FecHorReg,Estatus"

      let Valores = this.servicios.UsuMat.NRegistro+",|"+this.DetDat.Imagen+"|,|"+this.DetDat.Nombre+"|,|"+this.DetDat.Descripcion+"|"
      Valores = Valores+",|"+this.DetDat.Descuento+"|,|"+this.DetDat.CanCupLim+"|,|"+this.DetDat.FecHorLim+"|,|"+this.DetDat.EdaMin+"|,|"+this.DetDat.EdaMax+"|"
      Valores = Valores+",|"+this.DetDat.Foto1+"|,|"+this.DetDat.Foto2+"|,|"+this.DetDat.Foto3+"|,|"+this.DetDat.Foto4+"|,|"+this.DetDat.Foto5+"|,|"+this.DetDat.Foto6+"|"
      Valores = Valores+",|"+this.DetDat.Categorias+"|,|"+this.DetDat.Uso+"|,|"+this.DetDat.Condiciones+"|,|"+this.DetDat.Restricciones+"|,|"+this.DetDat.TerCon+"|"
      Valores = Valores+",|"+this.DetDat.Direccion+"|,|"+this.DetDat.LatLon+"|,NOW(),|Activo|"

      this.servicios.AccSobBDAA("INSERT","No",Campos,Valores,"","cupones","","","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Cupón fue creado","Hecho");
        this.CloModCup.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }else{
      let CyV = "Imagen=|"+this.DetDat.Imagen+"|,Nombre=|"+this.DetDat.Nombre+"|,Descripcion=|"+this.DetDat.Descripcion+"|,";
      CyV = CyV+"Descuento=|"+this.DetDat.Descuento+"|,CanCupLim=|"+this.DetDat.CanCupLim+"|,FecHorLim=|"+this.DetDat.FecHorLim+"|,EdaMin=|"+this.DetDat.EdaMin+"|,EdaMax=|"+this.DetDat.EdaMax+"|,"
      CyV = CyV+"Foto1=|"+this.DetDat.Foto1+"|,Foto2=|"+this.DetDat.Foto2+"|,Foto3=|"+this.DetDat.Foto3+"|,Foto4=|"+this.DetDat.Foto4+"|,Foto5=|"+this.DetDat.Foto5+"|,Foto6=|"+this.DetDat.Foto6+"|,"
      CyV = CyV+"Categorias=|"+this.DetDat.Categorias+"|,Uso=|"+this.DetDat.Uso+"|,Condiciones=|"+this.DetDat.Condiciones+"|,Restricciones=|"+this.DetDat.Restricciones+"|,TerCon=|"+this.DetDat.TerCon+"|,"
      CyV = CyV+"Direccion=|"+this.DetDat.Direccion+"|,LatLon=|"+this.DetDat.LatLon+"|"
      CyV = CyV+""

      this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"cupones","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Cupón fue actualizado","Hecho");
        this.CloModCup.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }
  }

  EliCup(){
    this.servicios.AccSobBDAA("DELETE","No","","","","cupones","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.CarLis();
      this.servicios.EnvMsgSim("El Cupón fue eliminado","Informacion");
      this.CloModCup.nativeElement.click();
    }).catch((err)=>{console.log(err)});
  }

  IniMapCup(){
    this.CarMapA = true;
    setTimeout(() => {this.showMapA().then(()=>{this.CarMapA = false;});}, 250);
  }

  async showMapA(){
    // console.log(this.mapA);
    // if (this.mapA){return}

    var location;
    if (this.DetDat.NRegistro){
      var ULLM = this.DetDat.LatLon.split(",");
      location = new google.maps.LatLng(parseFloat(ULLM[0]),parseFloat(ULLM[1]));
      //console.log(parseFloat(ULLM[0])+"/"+parseFloat(ULLM[1]))
    }else{
      location = new google.maps.LatLng(this.servicios.Pais.Lat,this.servicios.Pais.Lon);
    }

    let TMSU = "roadmap";
    if (window.localStorage.getItem("TipMap") == "roadmap" || window.localStorage.getItem("TipMap") == "hybrid"){
      TMSU = window.localStorage.getItem("TipMap")
    }

    const options = {
      center: location,
      zoom: this.DetDat.NRegistro  ? 15 : 10,
      // mapTypeControl: true,
      mapTypeId: TMSU,
      // streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_TOP},
      // fullscreenControl: true,
      // fullscreenControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM}
    }

    let ThiRef = this;
    const map = new google.maps.Map(this.mapRefA.nativeElement, options);
    this.mapA = map;

    google.maps.event.addListener( map, 'maptypeid_changed', function() { 
      console.log(map.getMapTypeId())
      window.localStorage.setItem("TipMap",map.getMapTypeId());
    });

    const CliMar = new google.maps.Marker({
      id: "IDMCSCli",
      position: location,
      map: map
    });
    if (!this.DetDat.NRegistro){CliMar.setVisible(false);}

    const geocoder = new google.maps.Geocoder;

    map.addListener('click', function(e) {
      CliMar.setPosition(e.latLng);
      map.panTo(CliMar.getPosition());
      map.setZoom(16);
      infowindow.setContent("...");
      geocoder.geocode({'location': e.latLng}, function(results, status) {
        if (status === 'OK'){
          if (results[0]) {
            let Bar = "";
            let Ciu = "";
            let Dep = "";
            let Dir = "";
            let Coo = "";
            for (let n = 0; n < results[0].address_components.length; n++) {
              if (results[0].address_components[n].types[0] == "political"){ //Barrio
                console.log(results[0].address_components[n].long_name,"Barrio");
                Bar = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "locality"){ //Ciudad
                console.log(results[0].address_components[n].long_name,"Ciudad");
                Ciu = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "administrative_area_level_1"){ //Departamento
                console.log(results[0].address_components[n].long_name,"Departamento");
                Dep = results[0].address_components[n].long_name;
              }
            }
            Dir = results[0].formatted_address;
            Coo = e.latLng.lat()+","+e.latLng.lng();
            ThiRef.ActDirA(Bar,Ciu,Dep,Dir,Coo);

            infowindow.setContent(results[0].formatted_address);
            document.getElementById("BusDes").innerHTML = results[0].formatted_address;
            document.getElementById("BusLatLon").innerHTML = e.latLng.lat()+","+e.latLng.lng();
            infowindow.open(map, CliMar);
          }else{
            document.getElementById("BusDes").innerHTML = "Sin resultados";
          }
        }else{
          document.getElementById("BusDes").innerHTML = "Sin resultados";
        }
      });
    });

    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById("InpBusDonA");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    })

    return;
  }

  ActDirA(Bar,Ciu,Dep,Dir,Coo){
    this.DetDat.OriBar = Bar;
    this.DetDat.OriCiu = Ciu;
    this.DetDat.OriDep = Dep;
    this.DetDat.Direccion = Dir;
    this.DetDat.LatLon = Coo;
  }

  //////////////////////////////////Cupones//////////////////////////////////////

  //////////////////////////////////Servicios////////////////////////////////////
  ProSer(Acc,Ser){
    // console.log(Acc);
    // console.log(Ser);
    this.DetDat = Ser;
    this.DetDat.Acc = Acc;
    this.DetDat.TabAct = 0;

    if (!this.DetDat.NRegistro){
      this.DetDat.NRegUsu = this.servicios.UsuMat.NRegistro;
      this.DetDat.Categorias = "";
      this.DetDat.Direccion = "";
      this.DetDat.LatLon = "";
      this.DetDat.Imagen = "fpdc.png";
      this.DetDat.Foto1 = "fpdc.png";
      this.DetDat.Foto2 = "fpdc.png";
      this.DetDat.Foto3 = "fpdc.png";
      this.DetDat.Foto4 = "fpdc.png";
      this.DetDat.Foto5 = "fpdc.png";
      this.DetDat.Foto6 = "fpdc.png";
    }else{
      this.DetDat.PasTab0 = true;
      this.DetDat.PasTab1 = true;
      this.DetDat.PasTab2 = true;
    }

    this.SerCarLisCat();
  }

  SerCarLisCat(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(|No|) Sel","","","categorias","WHERE Estatus=|Activa|","ORDER BY Nombre","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      if (this.DetDat.NRegistro){
        let CatSel = this.DetDat.Categorias.split(",");
        for (let n = 0; n < CatSel.length; n++) {
          for (let n2 = 0; n2 < Res.data.length; n2++) {
            if (CatSel[n] == Res.data[n2].NRegistro){Res.data[n2].Sel = "Si"}
          }
        }
      }
      this.DetDat.LisCat = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  SerSelCat(Ite){
    if (Ite.Sel == "No"){
      Ite.Sel = "Si"
    }else{
      Ite.Sel = "No"
    }
  }

  TabSelSer(Ind: number){
    // console.log(Ind)
    this.DetDat.TabAct = Ind;
    if (Ind == 2){this.IniMapSer();}
  }
  SigPesSer(){
    if (this.DetDat.Imagen == "fpdc.png"){
      this.servicios.EnvMsgSim("Por favor seleccione una imagen","Advertencia");
      this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;
    }
    if (!this.servicios.ValCam("IBSerNom","Nombre","Texto",this.DetDat.Nombre,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerDes","Descripción","Texto",this.DetDat.Descripcion,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerPrecio","Precio "+this.servicios.Pais.SimMon,"Moneda",this.DetDat.Precio,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerDescuento","Descuento %","Porcentaje",this.DetDat.Descuento,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerEdaMin","Edad Mínima","Entero",this.DetDat.EdaMin,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerEdaMax","Edad Máxima","Entero",this.DetDat.EdaMax,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBSerHor","Horario","Texto",this.DetDat.Horario,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}

    this.DetDat.PasTab0 = true;
    this.DetDat.TabAct = 1;

    let CatSel = [];
    for (let n = 0; n < this.DetDat.LisCat.length; n++) {
      if (this.DetDat.LisCat[n].Sel == "Si"){
        CatSel.push(this.DetDat.LisCat[n].NRegistro)
      }
    }
    if (CatSel.length == 0){
      this.servicios.EnvMsgSim("Por favor seleccione al menos una Categoría","Advertencia");
      this.DetDat.PasTab1 = false; this.DetDat.TabAct = 1; return;
    }

    this.DetDat.Categorias = CatSel.join(",");
    // console.log(this.DetDat.Categorias);
    this.DetDat.PasTab1 = true
    this.DetDat.TabAct = 2;

    if (this.DetDat.Direccion == "" || this.DetDat.LatLon == ""){
      this.servicios.EnvMsgSim("Por favor seleccione la ubicación en el mapa","Advertencia");
      this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;
    }
    this.DetDat.PasTab2 = true

    if (!this.DetDat.NRegistro){
      let Campos = "NRegUsu,Imagen,Nombre,Descripcion,"
      Campos = Campos+"Precio,Descuento,EdaMin,EdaMax,"
      Campos = Campos+"Foto1,Foto2,Foto3,Foto4,Foto5,Foto6,"
      Campos = Campos+"Categorias,Horario,"
      Campos = Campos+"Direccion,LatLon,FecHorReg,Estatus"

      let Valores = this.servicios.UsuMat.NRegistro+",|"+this.DetDat.Imagen+"|,|"+this.DetDat.Nombre+"|,|"+this.DetDat.Descripcion+"|"
      Valores = Valores+",|"+this.DetDat.Precio+"|,|"+this.DetDat.Descuento+"|,|"+this.DetDat.EdaMin+"|,|"+this.DetDat.EdaMax+"|"
      Valores = Valores+",|"+this.DetDat.Foto1+"|,|"+this.DetDat.Foto2+"|,|"+this.DetDat.Foto3+"|,|"+this.DetDat.Foto4+"|,|"+this.DetDat.Foto5+"|,|"+this.DetDat.Foto6+"|"
      Valores = Valores+",|"+this.DetDat.Categorias+"|,|"+this.DetDat.Horario+"|"
      Valores = Valores+",|"+this.DetDat.Direccion+"|,|"+this.DetDat.LatLon+"|,NOW(),|Activo|"

      this.servicios.AccSobBDAA("INSERT","No",Campos,Valores,"","servicios","","","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Servicio fue creado","Hecho");
        this.CloModSer.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }else{
      let CyV = "Imagen=|"+this.DetDat.Imagen+"|,Nombre=|"+this.DetDat.Nombre+"|,Descripcion=|"+this.DetDat.Descripcion+"|,";
      CyV = CyV+"Precio=|"+this.DetDat.Precio+"|,Descuento=|"+this.DetDat.Descuento+"|,EdaMin=|"+this.DetDat.EdaMin+"|,EdaMax=|"+this.DetDat.EdaMax+"|,"
      CyV = CyV+"Foto1=|"+this.DetDat.Foto1+"|,Foto2=|"+this.DetDat.Foto2+"|,Foto3=|"+this.DetDat.Foto3+"|,Foto4=|"+this.DetDat.Foto4+"|,Foto5=|"+this.DetDat.Foto5+"|,Foto6=|"+this.DetDat.Foto6+"|,"
      CyV = CyV+"Categorias=|"+this.DetDat.Categorias+"|,Horario=|"+this.DetDat.Horario+"|,"
      CyV = CyV+"Direccion=|"+this.DetDat.Direccion+"|,LatLon=|"+this.DetDat.LatLon+"|"
      CyV = CyV+""

      this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"servicios","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Servicio fue actualizado","Hecho");
        this.CloModSer.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }
  }

  EliSer(){
    this.servicios.AccSobBDAA("DELETE","No","","","","servicios","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.CarLis();
      this.servicios.EnvMsgSim("El Servicio fue eliminado","Informacion");
      this.CloModSer.nativeElement.click();
    }).catch((err)=>{console.log(err)});
  }

  IniMapSer(){
    this.CarMapB = true;
    setTimeout(() => {this.showMapB().then(()=>{this.CarMapB = false;});}, 250);
  }

  async showMapB(){
    // console.log(this.mapB);
    // if (this.mapB){return}

    var location;
    if (this.DetDat.NRegistro){
      var ULLM = this.DetDat.LatLon.split(",");
      location = new google.maps.LatLng(parseFloat(ULLM[0]),parseFloat(ULLM[1]));
      //console.log(parseFloat(ULLM[0])+"/"+parseFloat(ULLM[1]))
    }else{
      location = new google.maps.LatLng(this.servicios.Pais.Lat,this.servicios.Pais.Lon);
    }

    let TMSU = "roadmap";
    if (window.localStorage.getItem("TipMap") == "roadmap" || window.localStorage.getItem("TipMap") == "hybrid"){
      TMSU = window.localStorage.getItem("TipMap")
    }

    const options = {
      center: location,
      zoom: this.DetDat.NRegistro  ? 15 : 10,
      // mapTypeControl: true,
      mapTypeId: TMSU,
      // streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_TOP},
      // fullscreenControl: true,
      // fullscreenControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM}
    }

    let ThiRef = this;
    const map = new google.maps.Map(this.mapRefB.nativeElement, options);
    this.mapB = map;

    google.maps.event.addListener( map, 'maptypeid_changed', function() { 
      console.log(map.getMapTypeId())
      window.localStorage.setItem("TipMap",map.getMapTypeId());
    });

    const CliMar = new google.maps.Marker({
      id: "IDMCSCli",
      position: location,
      map: map
    });
    if (!this.DetDat.NRegistro){CliMar.setVisible(false);}

    const geocoder = new google.maps.Geocoder;

    map.addListener('click', function(e) {
      CliMar.setPosition(e.latLng);
      map.panTo(CliMar.getPosition());
      map.setZoom(16);
      infowindow.setContent("...");
      geocoder.geocode({'location': e.latLng}, function(results, status) {
        if (status === 'OK'){
          if (results[0]) {
            let Bar = "";
            let Ciu = "";
            let Dep = "";
            let Dir = "";
            let Coo = "";
            for (let n = 0; n < results[0].address_components.length; n++) {
              if (results[0].address_components[n].types[0] == "political"){ //Barrio
                console.log(results[0].address_components[n].long_name,"Barrio");
                Bar = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "locality"){ //Ciudad
                console.log(results[0].address_components[n].long_name,"Ciudad");
                Ciu = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "administrative_area_level_1"){ //Departamento
                console.log(results[0].address_components[n].long_name,"Departamento");
                Dep = results[0].address_components[n].long_name;
              }
            }
            Dir = results[0].formatted_address;
            Coo = e.latLng.lat()+","+e.latLng.lng();
            ThiRef.ActDirB(Bar,Ciu,Dep,Dir,Coo);

            infowindow.setContent(results[0].formatted_address);
            document.getElementById("BusDes").innerHTML = results[0].formatted_address;
            document.getElementById("BusLatLon").innerHTML = e.latLng.lat()+","+e.latLng.lng();
            infowindow.open(map, CliMar);
          }else{
            document.getElementById("BusDes").innerHTML = "Sin resultados";
          }
        }else{
          document.getElementById("BusDes").innerHTML = "Sin resultados";
        }
      });
    });

    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById("InpBusDonB");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    })

    return;
  }

  ActDirB(Bar,Ciu,Dep,Dir,Coo){
    this.DetDat.OriBar = Bar;
    this.DetDat.OriCiu = Ciu;
    this.DetDat.OriDep = Dep;
    this.DetDat.Direccion = Dir;
    this.DetDat.LatLon = Coo;
  }
  //////////////////////////////////Servicios////////////////////////////////////



  //////////////////////////////////Envios///////////////////////////////////////
  ProEve(Acc,Eve){
    // console.log(Acc);
    // console.log(Eve);
    this.DetDat = Eve;
    this.DetDat.Acc = Acc;
    this.DetDat.TabAct = 0;

    if (!this.DetDat.NRegistro){
      this.DetDat.NRegUsu = this.servicios.UsuMat.NRegistro;
      this.DetDat.Categorias = "";
      this.DetDat.Direccion = "";
      this.DetDat.LatLon = "";
      this.DetDat.Imagen = "fpdc.png";
      this.DetDat.Foto1 = "fpdc.png";
      this.DetDat.Foto2 = "fpdc.png";
      this.DetDat.Foto3 = "fpdc.png";
      this.DetDat.Foto4 = "fpdc.png";
      this.DetDat.Foto5 = "fpdc.png";
      this.DetDat.Foto6 = "fpdc.png";
    }else{
      this.DetDat.PasTab0 = true;
      this.DetDat.PasTab1 = true;
      this.DetDat.PasTab2 = true;
    }

    this.EveCarLisCat();
  }

  EveCarLisCat(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(|No|) Sel","","","categorias","WHERE Estatus=|Activa|","ORDER BY Nombre","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      if (this.DetDat.NRegistro){
        let CatSel = this.DetDat.Categorias.split(",");
        for (let n = 0; n < CatSel.length; n++) {
          for (let n2 = 0; n2 < Res.data.length; n2++) {
            if (CatSel[n] == Res.data[n2].NRegistro){Res.data[n2].Sel = "Si"}
          }
        }
      }
      this.DetDat.LisCat = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  EveSelCat(Ite){
    if (Ite.Sel == "No"){
      Ite.Sel = "Si"
    }else{
      Ite.Sel = "No"
    }
  }

  TabSelEve(Ind: number){
    // console.log(Ind)
    this.DetDat.TabAct = Ind;
    if (Ind == 2){this.IniMapEve();}
  }
  SigPesEve(){
    if (this.DetDat.Imagen == "fpdc.png"){
      this.servicios.EnvMsgSim("Por favor seleccione una imagen","Advertencia");
      this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;
    }
    if (!this.servicios.ValCam("IBEveNom","Nombre","Texto",this.DetDat.Nombre,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveDes","Descripción","Texto",this.DetDat.Descripcion,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEvePrecio","Precio "+this.servicios.Pais.SimMon,"Moneda",this.DetDat.Precio,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveDescuento","Descuento %","Porcentaje",this.DetDat.Descuento,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveEdaMin","Edad Mínima","Entero",this.DetDat.EdaMin,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveEdaMax","Edad Máxima","Entero",this.DetDat.EdaMax,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveFec","Horario","Texto",this.DetDat.FecHorEve,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}
    if (!this.servicios.ValCam("IBEveHor","Horario","Texto",this.DetDat.Horario,"Si")){this.DetDat.PasTab0 = false; this.DetDat.TabAct = 0; return;}

    this.DetDat.PasTab0 = true;
    this.DetDat.TabAct = 1;

    let CatSel = [];
    for (let n = 0; n < this.DetDat.LisCat.length; n++) {
      if (this.DetDat.LisCat[n].Sel == "Si"){
        CatSel.push(this.DetDat.LisCat[n].NRegistro)
      }
    }
    if (CatSel.length == 0){
      this.servicios.EnvMsgSim("Por favor seleccione al menos una Categoría","Advertencia");
      this.DetDat.PasTab1 = false; this.DetDat.TabAct = 1; return;
    }

    this.DetDat.Categorias = CatSel.join(",");
    // console.log(this.DetDat.Categorias);
    this.DetDat.PasTab1 = true
    this.DetDat.TabAct = 2;

    if (this.DetDat.Direccion == "" || this.DetDat.LatLon == ""){
      this.servicios.EnvMsgSim("Por favor seleccione la ubicación en el mapa","Advertencia");
      this.DetDat.PasTab2 = false; this.DetDat.TabAct = 2; return;
    }
    this.DetDat.PasTab2 = true

    if (!this.DetDat.NRegistro){
      let Campos = "NRegUsu,Imagen,Nombre,Descripcion,"
      Campos = Campos+"Precio,Descuento,EdaMin,EdaMax,"
      Campos = Campos+"Foto1,Foto2,Foto3,Foto4,Foto5,Foto6,"
      Campos = Campos+"Categorias,FecHorEve,Horario,"
      Campos = Campos+"Direccion,LatLon,FecHorReg,Estatus"

      let Valores = this.servicios.UsuMat.NRegistro+",|"+this.DetDat.Imagen+"|,|"+this.DetDat.Nombre+"|,|"+this.DetDat.Descripcion+"|"
      Valores = Valores+",|"+this.DetDat.Precio+"|,|"+this.DetDat.Descuento+"|,|"+this.DetDat.EdaMin+"|,|"+this.DetDat.EdaMax+"|"
      Valores = Valores+",|"+this.DetDat.Foto1+"|,|"+this.DetDat.Foto2+"|,|"+this.DetDat.Foto3+"|,|"+this.DetDat.Foto4+"|,|"+this.DetDat.Foto5+"|,|"+this.DetDat.Foto6+"|"
      Valores = Valores+",|"+this.DetDat.Categorias+"|,|"+this.DetDat.FecHorEve+"|,|"+this.DetDat.Horario+"|"
      Valores = Valores+",|"+this.DetDat.Direccion+"|,|"+this.DetDat.LatLon+"|,NOW(),|Activo|"

      this.servicios.AccSobBDAA("INSERT","No",Campos,Valores,"","eventos","","","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Evento fue creado","Hecho");
        this.CloModEve.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }else{
      let CyV = "Imagen=|"+this.DetDat.Imagen+"|,Nombre=|"+this.DetDat.Nombre+"|,Descripcion=|"+this.DetDat.Descripcion+"|,";
      CyV = CyV+"Precio=|"+this.DetDat.Precio+"|,Descuento=|"+this.DetDat.Descuento+"|,EdaMin=|"+this.DetDat.EdaMin+"|,EdaMax=|"+this.DetDat.EdaMax+"|,"
      CyV = CyV+"Foto1=|"+this.DetDat.Foto1+"|,Foto2=|"+this.DetDat.Foto2+"|,Foto3=|"+this.DetDat.Foto3+"|,Foto4=|"+this.DetDat.Foto4+"|,Foto5=|"+this.DetDat.Foto5+"|,Foto6=|"+this.DetDat.Foto6+"|,"
      CyV = CyV+"Categorias=|"+this.DetDat.Categorias+"|,FecHorEve=|"+this.DetDat.FecHorEve+"|,Horario=|"+this.DetDat.Horario+"|,"
      CyV = CyV+"Direccion=|"+this.DetDat.Direccion+"|,LatLon=|"+this.DetDat.LatLon+"|"
      CyV = CyV+""

      this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"eventos","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
        let Res: any = dataRes;
        // console.log(Res);
        this.CarLis();
        this.servicios.EnvMsgSim("El Evento fue actualizado","Hecho");
        this.CloModEve.nativeElement.click();
      }).catch((err)=>{console.log(err)});
    }
  }

  EliEve(){
    this.servicios.AccSobBDAA("DELETE","No","","","","eventos","WHERE NRegistro="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.CarLis();
      this.servicios.EnvMsgSim("El Evento fue eliminado","Informacion");
      this.CloModEve.nativeElement.click();
    }).catch((err)=>{console.log(err)});
  }

  IniMapEve(){
    this.CarMapC = true;
    setTimeout(() => {this.showMapC().then(()=>{this.CarMapC = false;});}, 250);
  }

  async showMapC(){
    // console.log(this.mapC);
    // if (this.mapC){return}

    var location;
    if (this.DetDat.NRegistro){
      var ULLM = this.DetDat.LatLon.split(",");
      location = new google.maps.LatLng(parseFloat(ULLM[0]),parseFloat(ULLM[1]));
      //console.log(parseFloat(ULLM[0])+"/"+parseFloat(ULLM[1]))
    }else{
      location = new google.maps.LatLng(this.servicios.Pais.Lat,this.servicios.Pais.Lon);
    }

    let TMSU = "roadmap";
    if (window.localStorage.getItem("TipMap") == "roadmap" || window.localStorage.getItem("TipMap") == "hybrid"){
      TMSU = window.localStorage.getItem("TipMap")
    }

    const options = {
      center: location,
      zoom: this.DetDat.NRegistro  ? 15 : 10,
      // mapTypeControl: true,
      mapTypeId: TMSU,
      // streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_TOP},
      // fullscreenControl: true,
      // fullscreenControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM}
    }

    let ThiRef = this;
    const map = new google.maps.Map(this.mapRefC.nativeElement, options);
    this.mapC = map;

    google.maps.event.addListener( map, 'maptypeid_changed', function() { 
      console.log(map.getMapTypeId())
      window.localStorage.setItem("TipMap",map.getMapTypeId());
    });

    const CliMar = new google.maps.Marker({
      id: "IDMCSCli",
      position: location,
      map: map
    });
    if (!this.DetDat.NRegistro){CliMar.setVisible(false);}

    const geocoder = new google.maps.Geocoder;

    map.addListener('click', function(e) {
      CliMar.setPosition(e.latLng);
      map.panTo(CliMar.getPosition());
      map.setZoom(16);
      infowindow.setContent("...");
      geocoder.geocode({'location': e.latLng}, function(results, status) {
        if (status === 'OK'){
          if (results[0]) {
            let Bar = "";
            let Ciu = "";
            let Dep = "";
            let Dir = "";
            let Coo = "";
            for (let n = 0; n < results[0].address_components.length; n++) {
              if (results[0].address_components[n].types[0] == "political"){ //Barrio
                console.log(results[0].address_components[n].long_name,"Barrio");
                Bar = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "locality"){ //Ciudad
                console.log(results[0].address_components[n].long_name,"Ciudad");
                Ciu = results[0].address_components[n].long_name;
              }
              if (results[0].address_components[n].types[0] == "administrative_area_level_1"){ //Departamento
                console.log(results[0].address_components[n].long_name,"Departamento");
                Dep = results[0].address_components[n].long_name;
              }
            }
            Dir = results[0].formatted_address;
            Coo = e.latLng.lat()+","+e.latLng.lng();
            ThiRef.ActDirC(Bar,Ciu,Dep,Dir,Coo);

            infowindow.setContent(results[0].formatted_address);
            document.getElementById("BusDes").innerHTML = results[0].formatted_address;
            document.getElementById("BusLatLon").innerHTML = e.latLng.lat()+","+e.latLng.lng();
            infowindow.open(map, CliMar);
          }else{
            document.getElementById("BusDes").innerHTML = "Sin resultados";
          }
        }else{
          document.getElementById("BusDes").innerHTML = "Sin resultados";
        }
      });
    });

    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById("InpBusDonC");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    })

    return;
  }

  ActDirC(Bar,Ciu,Dep,Dir,Coo){
    this.DetDat.OriBar = Bar;
    this.DetDat.OriCiu = Ciu;
    this.DetDat.OriDep = Dep;
    this.DetDat.Direccion = Dir;
    this.DetDat.LatLon = Coo;
  }
  //////////////////////////////////Envios////////////////////////////////////



  //////////////////////////////////Billeteras///////////////////////////////

  BloSalEnvPen(NRE,IDP,Mon){
    this.servicios.AccSobBDAA("INSERT","No","NRegUsu,NRegEnv,Transaccion,Descripcion,Monto,FecHor",this.servicios.UsuMat.NRegistro+","+NRE+",|Diferido|,|Saldo diferido por envío "+IDP+"|,"+(parseFloat(Mon)*-1)+",NOW()","","billetera","","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.servicios.AccSobBDAA("UPDATE","No","","","Saldo=Saldo-"+parseFloat(Mon)+",SaldoDif=SaldoDif¬"+parseFloat(Mon)+"","usuarios","WHERE NRegistro="+this.servicios.UsuMat.NRegistro,"","",false).then((dataRes)=>{
        let Res: any = dataRes;
        this.servicios.ActSal();
      }).catch((err)=>{console.log(err.message)})
    }).catch((err)=>{console.log(err.message)})
  }

  AboSal(){
    if (!this.servicios.ValCam("IBAboMon","Monto del Abono","Numero",this.servicios.UsuMat.MonAbo,"Si")){return;}
    console.log(this.servicios.UsuMat.MonAbo)

    this.servicios.AccSobBDAA("INSERT","No","NRegUsu,Descripcion,Monto,FecHorReg",this.servicios.UsuMat.NRegistro+",|Abono de billetera|,"+this.servicios.UsuMat.MonAbo+",NOW()","","solabo","","","",true).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      let NRA = Res.lastinsertid
      
      ///// this.IniPas(NRA); //////

      ////////////////////////////////ESTE SEGMENTO SE USARA MIENTRAS LA PASARELA NO ESTE ACTIVA PARA SIMULAR UN ABONO POSITIVO//////////////////////////////////////////////
      this.servicios.AccSobBDAA("UPDATE","No","","","Estatus=|Aceptada|","solabo","WHERE NRegistro="+NRA,"","",false).then((dataRes)=>{
        let Res: any = dataRes;
        //console.log(Res);
      }).catch((err)=>{console.log(err.message)})
      this.servicios.AccSobBDAA("INSERT","No","NRegUsu,Transaccion,Descripcion,Monto,FecHor",this.servicios.UsuMat.NRegistro+",|Abono|,|Abono de billetera|,"+this.servicios.UsuMat.MonAbo+",NOW()","","billetera","","","",false).then((dataRes)=>{
        let Res: any = dataRes;
        //console.log(Res);
        this.servicios.AccSobBDAA("UPDATE","No","","","Saldo=Saldo¬"+this.servicios.UsuMat.MonAbo,"usuarios","WHERE NRegistro="+this.servicios.UsuMat.NRegistro,"","",false).then((dataRes)=>{
          let Res: any = dataRes;

          this.servicios.ActSal();
        }).catch((err)=>{console.log(err.message)})
      }).catch((err)=>{console.log(err.message)})

      this.servicios.EnvNot(this.servicios.UsuMat.NRegistro,"Abono de billetera","El Abono a la billetera fue aprobado","Abono",NRA)
      this.servicios.EnvMsgSim("El Abono fue registrado","Hecho");

      this.CloModAbo.nativeElement.click();

      ////////////////////////////////ESTE SEGMENTO SE USARA MIENTRAS LA PASARELA NO ESTE ACTIVA PARA SIMULAR UN ABONO POSITIVO//////////////////////////////////////////////
    }).catch((err)=>{console.log(err.message)});
  }
  //////////////////////////////////Billeteras///////////////////////////////

  MosPag(Pag){
    this.DatRes = undefined;
    this.DGM = {};
    this.OJE = [];
    this.servicios.DGF = {};
    this.PagAct = Pag;

    switch (Pag) {
      case "Inicio":
        this.MenAct = "Inicio";
        this.servicios.CarLisPar();
        this.IniGra();
      break;

      case "Asistencias":
        this.MenAct = "Servicios";
        this.PreDGM('Asistencias');
      break;
      case "Rentas - Ventas":
        this.MenAct = "Servicios";
        this.PreDGM('Rentas - Ventas');
      break;
      case "Ferreterías":
        this.MenAct = "Servicios";
        this.PreDGM('Ferreterías');
      break;

      case "Servicios":
        this.MenAct = "Servicios";
        this.PreDGM('Servicios');
      break;
      case "Eventos":
        this.MenAct = "Servicios";
        this.PreDGM('Eventos');
      break;
      case "Cupones":
        this.MenAct = "Servicios";
        this.PreDGM('Cupones');
      break;
      case "Noticias":
        this.MenAct = "Servicios";
        this.PreDGM('Noticias');
      break;
      case "Publicidad":
        this.MenAct = "Servicios";
        this.PreDGM('Publicidad');
      break;

      case "Notificaciones":
        this.MenAct = "Servicios";
        this.PreDGM('Notificaciones');
        this.servicios.DatNot.Todas = [];
      break;
      case "Mensajes":
        this.MenAct = "Servicios";
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Mensajes"
        }
        this.CarLisUsu();
      break;

      case "Ejemplos":
        this.MenAct = "Ozza";
        this.PreDGM('Ejemplos');
      break;

      case "Configuración":
        this.MenAct = "Ozza";
        this.PreDGM('Configuración');
      break;

      case "Definición":
        this.MenAct = "Datos";
        this.PreDGM('Definición');
      break;
      case "Pagos":
        this.MenAct = "Datos";
        this.PreDGM('Pagos');
      break;
      case "Detalles":
        this.servicios.CalDiaDis();
        this.CarLisMem();
        this.DGM = {
          Menu: "Membresías",
          Nombre: "Detalles"
        }

      break;

      case "Movimientos":
        this.MenAct = "Billetera";
        this.PreDGM('Movimientos');
      break;

      case "Herramientas":
        this.MenAct = "Datos";
        this.PreDGM('Herramientas');
      break;
      case "Productos":
        this.MenAct = "Datos";
        this.PreDGM('Productos');
      break;

      case "Categorías":
        this.MenAct = "Datos";
        this.PreDGM('Categorías');
      break;
      case "Paises":
        this.MenAct = "Datos";
        this.PreDGM('Paises');
      break;
      case "Idiomas":
        this.MenAct = "Datos";
        this.PreDGM('Idiomas');
      break;
      case "Parámetros":
        this.MenAct = "Datos";
        this.PreDGM('Parámetros');
      break;

      case "Preguntas":
        this.MenAct = "Soporte";
        this.PreDGM('Preguntas');
      break;

      case "Administradores":
        this.MenAct = "Usuarios";
        this.PreDGM('Administradores');
      break;
      case "Soporte":
        this.MenAct = "Usuarios";
        this.PreDGM('Soporte');
      break;
      case "Técnicos":
        this.MenAct = "Usuarios";
        this.PreDGM('Técnicos');
      break;
      case "Clientes":
        this.MenAct = "Usuarios";
        this.PreDGM('Clientes');
      break;

      case "Perfil":
        this.MenAct = "Opciones";
        this.DGM = {
          Menu: "Opciones",
          Nombre: "Perfil"
        }
        this.ProPro();
        this.CarLisPai();
      break;
      case "Ayuda":
        this.MenAct = "Opciones";
        this.DGM = {
          Menu: "Opciones",
          Nombre: "Ayuda"
        }
      break;
      case "Salir":
        this.Logout();
      break;

      default:
        this.servicios.EnvMsgSim("Modulo en desarrollo","Informacion")
      break;
    }
  }

  PreDGM(Mod){
    let FHA = new Date();
    let VDFHA = FHA.toISOString().replace("T"," ").substring(0,16);
    let VDFA = FHA.toISOString().replace("T"," ").substring(0,10);

    switch (Mod) {

      case "Asistencias":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Asistencias",
          CamMod:[
            {Tit:"Tipo",Cmp:"Tipo",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"Nombre,Nombre",Tab:"asistenciastip",Don:"WHERE Estatus=|Activa|",Ord:"ORDER BY Nombre",Res:[]}},
            {Tit:"Cliente",Cmp:"NRegCli",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Cliente|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Foto",Cmp:"Foto",Tip:"Imagen",Req:"Si",VD:"fpda.png",Val:"",Est:"",Car:"asi"},
            {Tit:"Dirección",Cmp:"UbiDir",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Técnico",Cmp:"NRegTec",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Observación",Cmp:"Observacion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Solicitado",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Asignado",Cmp:"FecHorAsi",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},
            {Tit:"Terminado",Cmp:"FecHorTer",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Nueva",Val:"",Opcs:[
              {Val:"Nueva",Tex:"Nueva",Dis:""},
              {Val:"Asignada",Tex:"Asignada",Dis:""},
              {Val:"En proceso",Tex:"En proceso",Dis:""},
              {Val:"Atendida",Tex:"Atendida",Dis:""},
              {Val:"Cancelada",Tex:"Cancelada",Dis:""},
            ]},
          ],
          BorEst:"Si",
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"asistencias",
          Donde:"",
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"asi",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2]},
        }
      break;

      case "Rentas - Ventas":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Rentas - Ventas",
          CamMod:[
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Select",Req:"Si",VD:"Renta",Val:"",Opcs:[{Val:"Renta",Tex:"Renta",Dis:""},{Val:"Venta",Tex:"Venta",Dis:""},]},
            {Tit:"Cliente",Cmp:"NRegCli",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Cliente|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Dirección",Cmp:"UbiDir",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Técnico",Cmp:"NRegTec",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Observación",Cmp:"Observacion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},

            {Tit:"Solicitado",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Asignado",Cmp:"FecHorAsi",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},
            {Tit:"Terminado",Cmp:"FecHorTer",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},

            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Nueva",Val:"",Opcs:[
              {Val:"Nueva",Tex:"Nueva",Dis:""},
              {Val:"Asignada",Tex:"Asignada",Dis:""},
              {Val:"En proceso",Tex:"En proceso",Dis:""},
              {Val:"Entregada",Tex:"Entregada",Dis:""},
              {Val:"Recuperada",Tex:"Recuperada",Dis:""},
              {Val:"Cancelada",Tex:"Cancelada",Dis:""},
            ]},
          ],
          BorEst:"Si",
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"herramientas",
          Donde:"",
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"asi",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2]},
        }
      break;

      case "Ferreterías":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Ferreterías",
          CamMod:[
            {Tit:"Pedido",Cmp:"Codigo",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Cliente",Cmp:"NRegCli",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Cliente|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Dirección",Cmp:"UbiDir",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Técnico",Cmp:"NRegTec",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Ocu:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Observación",Cmp:"Observacion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},

            {Tit:"Solicitado",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Asignado",Cmp:"FecHorAsi",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},
            {Tit:"Terminado",Cmp:"FecHorTer",Tip:"FechaHora",Req:"No",VD:"0000-00-00 00:00:00",Val:"",Blo:"No"},

            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Nueva",Val:"",Opcs:[
              {Val:"Nueva",Tex:"Nueva",Dis:""},
              {Val:"Asignada",Tex:"Asignada",Dis:""},
              {Val:"En proceso",Tex:"En proceso",Dis:""},
              {Val:"Entregada",Tex:"Entregada",Dis:""},
              {Val:"Cancelada",Tex:"Cancelada",Dis:""},
            ]},
          ],
          BorEst:"Si",
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"ferreterias",
          Donde:"",
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"asi",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2]},
        }
      break;

      case "Servicios":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Servicios",
          CamMod:[
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpds.png",Val:"",Est:"",Car:"ser"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Categoría",Cmp:"Categorias",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Nombre",Tab:"categorias",Don:"WHERE Estatus=|Activa|",Ord:"ORDER BY Nombre",Res:[]}},
            {Tit:"Precio",Cmp:"Precio",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descuento %",Cmp:"Descuento",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Horario",Cmp:"Horario",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Dirección",Cmp:"Direccion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Coordenadas",Cmp:"LatLon",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Edad Mínima",Cmp:"EdaMin",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Edad Máxima",Cmp:"EdaMax",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Registro",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Inactivo",Tex:"Inactivo",Dis:""}]},
            {Tit:"Tecnico",Cmp:"NRegUsu",Tip:"SelectQry",Req:"Si",VD:(this.servicios.UsuMat.Tipo == 'Tecnico' ? this.servicios.UsuMat.NRegistro : ""),Val:"",Blo:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "Si" : "No"),Ocu:(this.servicios.UsuMat.Tipo == "Admin" ? "No" : "Si"),Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"servicios",
          Donde:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "WHERE NRegUsu="+this.servicios.UsuMat.NRegistro : ""),
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"ser",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2,3]},
        }
      break;

      case "Eventos":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Eventos",
          CamMod:[
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpds.png",Val:"",Est:"",Car:"eve"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Precio",Cmp:"Precio",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descuento %",Cmp:"Descuento",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Fecha",Cmp:"FecHorEve",Tip:"Fecha",Req:"Si",VD:VDFA,Val:"",Blo:"No"},
            {Tit:"Horario",Cmp:"Horario",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Categoría",Cmp:"Categorias",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Nombre",Tab:"categorias",Don:"WHERE Estatus=|Activa|",Ord:"ORDER BY Nombre",Res:[]}},
            {Tit:"Dirección",Cmp:"Direccion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Coordenadas",Cmp:"LatLon",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Edad Mínima",Cmp:"EdaMin",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Edad Máxima",Cmp:"EdaMax",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Registro",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Inactivo",Tex:"Inactivo",Dis:""}]},
            {Tit:"Tecnico",Cmp:"NRegUsu",Tip:"SelectQry",Req:"Si",VD:(this.servicios.UsuMat.Tipo == 'Tecnico' ? this.servicios.UsuMat.NRegistro : ""),Val:"",Blo:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "Si" : "No"),Ocu:(this.servicios.UsuMat.Tipo == "Admin" ? "No" : "Si"),Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"eventos",
          Donde:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "WHERE NRegUsu="+this.servicios.UsuMat.NRegistro : ""),
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"eve",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2,3]},
        }
      break;

      case "Cupones":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Cupones",
          CamMod:[
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpdc.png",Val:"",Est:"",Car:"cup"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Descuento %",Cmp:"Descuento",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Cantidad Cupones",Cmp:"CanCupLim",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Fecha Limite",Cmp:"FecHorLim",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            // {Tit:"Categoría",Cmp:"Categorias",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Nombre",Tab:"categorias",Don:"WHERE Estatus=|Activa|",Ord:"ORDER BY Nombre",Res:[]}},
            // {Tit:"Coordenadas",Cmp:"LatLon",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Edad Mínima",Cmp:"EdaMin",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Edad Máxima",Cmp:"EdaMax",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Registro",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Inactivo",Tex:"Inactivo",Dis:""}]},
            {Tit:"Tecnico",Cmp:"NRegUsu",Tip:"SelectQry",Req:"Si",VD:(this.servicios.UsuMat.Tipo == 'Tecnico' ? this.servicios.UsuMat.NRegistro : ""),Val:"",Blo:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "Si" : "No"),Ocu:(this.servicios.UsuMat.Tipo == "Admin" ? "No" : "Si"),Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo=|Tecnico|",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"cupones",
          Donde:(this.servicios.UsuMat.Tipo == 'Tecnico' ? "WHERE NRegUsu="+this.servicios.UsuMat.NRegistro : ""),
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"cup",
          TabFor:{"Fil":[1,2,3,4,5,6,7],"Col":[1,2]},
        }
      break;

      case "Noticias":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Noticias",
          CamMod:[
            {Tit:"Titulo",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpdn.png",Val:"",Est:"",Car:"not"},
            {Tit:"Enlace",Cmp:"Enlace",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Categoría",Cmp:"Categorias",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Nombre",Tab:"categorias",Don:"WHERE Estatus=|Activa|",Ord:"ORDER BY Nombre",Res:[]}},
            // {Tit:"Coordenadas",Cmp:"LatLon",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Edad Mínima",Cmp:"EdaMin",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            // {Tit:"Edad Máxima",Cmp:"EdaMax",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Registro",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"noticias",
          Donde:"",
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"not",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2]},
        }
      break;

      case "Publicidad":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Publicidad",
          CamMod:[
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpdp.png",Val:"",Est:"",Car:"pub"},
            {Tit:"Enlace",Cmp:"Enlace",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Fecha Inicio",Cmp:"FecIni",Tip:"Fecha",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Fecha Fin",Cmp:"FecFin",Tip:"Fecha",Req:"Si",VD:VDFHA,Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"publicidad",
          Donde:"",
          Ordena:"ORDER BY NRegistro DESC",
          Carpeta:"pub",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2]},
        }
      break;

      case "Notificaciones":
        this.DGM = {
          Menu: "Servicios",
          Nombre: "Notificaciones",
          CamMod:[
            {Tit:"Titulo",Cmp:"Titulo",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"Si"},
            {Tit:"Contenido",Cmp:"Contenido",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Registro",Cmp:"FecHor",Tip:"FechaHora",Req:"Si",VD:"",Val:""},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"No",
          OpcMod:"No",
          OpcEli:"No",
          CamQry:"*",
          Tabla:"noti",
          Donde:"WHERE NRegUsu="+this.servicios.UsuMat.NRegistro,
          Ordena:"ORDER BY FecHor DESC",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Ejemplos":
        this.DGM = {
          Menu: "Ozza",
          Nombre: "Ejemplos",
          CamMod:[
            {Tit:"Pregunta",Cmp:"Pregunta",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"ozzprefre",
          Donde:"",
          Ordena:"ORDER BY Pregunta",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Configuración":
        this.DGM = {
          Menu: "Ozza",
          Nombre: "Configuración",
          CamMod:[
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"Si"},
            {Tit:"Valor",Cmp:"Valor",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Símbolo",Cmp:"Simbolo",Tip:"Texto",Req:"No",VD:"",Val:"",Blo:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"No",
          OpcAgr:"No",
          OpcMod:"Si",
          OpcEli:"No",
          CamQry:"*",
          Tabla:"parametros",
          Donde:"WHERE Clave LIKE |AI·|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Definición":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Definición",
          CamMod:[
            {Tit:"Tipo de Usuario",Cmp:"TipUsu",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Cliente",Tex:"Cliente",Dis:""},{Val:"Tecnico",Tex:"Tecnico",Dis:""}]},
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Beneficios",Cmp:"Beneficios",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"No",Tam:"Gra"},
            // {Tit:"Días de Duración",Cmp:"Duracion",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Precio",Cmp:"Precio",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descuento Mensual %",Cmp:"DesMen",Tip:"Porcentaje",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Descuento Anual %",Cmp:"DesAnu",Tip:"Porcentaje",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Consultas",Cmp:"Consultas",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Eventos",Cmp:"Eventos",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Notificaciones",Cmp:"Notificaciones",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"membresias",
          Donde:"",
          Ordena:"ORDER BY TipUsu",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Pagos":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Pagos",
          CamMod:[
            {Tit:"Usuario",Cmp:"NRegUsu",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Nombre,Apellido",Tab:"usuarios",Don:"WHERE Tipo IN (|Tecnico|,|Cliente|)",Ord:"ORDER BY Nombre,Apellido",Res:[]}},
            {Tit:"Membresía",Cmp:"NRegMem",Tip:"SelectQry",Req:"Si",VD:"",Val:"",Blo:"No",Qry:{Cmps:"NRegistro,Descripcion",Tab:"membresias",Don:"",Ord:"ORDER BY Descripcion",Res:[]}},
            {Tit:"Monto",Cmp:"Monto",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Duración",Cmp:"Duracion",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Pagado",Cmp:"FecHorReg",Tip:"FechaHora",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Nuevo",Tex:"Nuevo",Dis:""},{Val:"Aceptado",Tex:"Aceptado",Dis:""},{Val:"Rechazado",Tex:"Rechazado",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"No",
          OpcMod:"No",
          OpcEli:"No",
          CamQry:"*",
          Tabla:"mempag",
          Donde:"",
          Ordena:"ORDER BY FecHorReg DESC",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;


      case "Movimientos":
        this.DGM = {
          Menu: "Billetera",
          Nombre: "Movimientos",
          CamMod:[
            {Tit:"Transacción",Cmp:"Transaccion",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Monto",Cmp:"Monto",Tip:"Moneda",Req:"No",VD:"",Val:""},
            {Tit:"Registro",Cmp:"FecHor",Tip:"FechaHora",Req:"Si",VD:"",Val:""},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"No",
          OpcMod:"No",
          OpcEli:"No",
          BorEst:"Si",
          CamQry:"*",
          Tabla:"billetera",
          Donde:"WHERE NRegUsu="+this.servicios.UsuMat.NRegistro,
          Ordena:"ORDER BY FecHor DESC",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Herramientas":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Herramientas",
          CamMod:[
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Select",Req:"Si",VD:"",Val:"",Blo:"No",Opcs:[{Val:"Renta",Tex:"Renta",Dis:""},{Val:"Venta",Tex:"Venta",Dis:""}]},
            {Tit:"Foto",Cmp:"Foto",Tip:"Imagen",Req:"Si",VD:"fpdh.png",Val:"",Est:"",Car:"her"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Marca",Cmp:"Marca",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Modelo",Cmp:"Modelo",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Precio",Cmp:"Precio",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Existencia",Cmp:"Existencia",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activa",Val:"",Blo:"No",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"herramientasdis",
          Donde:"",
          Ordena:"ORDER BY Nombre",
          Carpeta:"her",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Productos":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Productos",
          CamMod:[
            {Tit:"Foto",Cmp:"Foto",Tip:"Imagen",Req:"Si",VD:"fpdp.png",Val:"",Est:"",Car:"pro"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Marca",Cmp:"Marca",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Modelo",Cmp:"Modelo",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Precio",Cmp:"Precio",Tip:"Moneda",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Existencia",Cmp:"Existencia",Tip:"Entero",Req:"Si",VD:"",Val:"",Blo:"No"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activa",Val:"",Blo:"No",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"ferreteriaspro",
          Donde:"",
          Ordena:"ORDER BY Nombre",
          Carpeta:"pro",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Categorías":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Categorías",
          CamMod:[
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Descripcion",Cmp:"Descripcion",Tip:"Texto",Req:"No",VD:"",Val:"",Tam:"Gra"},
            {Tit:"Imagen",Cmp:"Imagen",Tip:"Imagen",Req:"Si",VD:"fpdc.png",Val:"",Est:"",Car:"cat"},
            {Tit:"Icono",Cmp:"Icono",Tip:"Imagen",Req:"Si",VD:"ipdc.png",Val:"",Est:"",Car:"cat"},
            {Tit:"SVG",Cmp:"SVG",Tip:"Imagen",Req:"Si",VD:"ipdc.png",Val:"",Est:"",Car:"cat"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Blo:"No",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""},{Val:"Pendiente",Tex:"Pendiente",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"categorias",
          Donde:(this.servicios.UsuMat.Tipo=="Tecnico" ? "WHERE NRegUsu="+this.servicios.UsuMat.NRegistro : ""),
          Ordena:"ORDER BY Nombre",
          Carpeta:"cat",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Paises":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Paises",
          CamMod:[
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Codigo",Cmp:"Codigo",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Inactivo",Tex:"Inactivo",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"paises",
          Donde:"",
          Ordena:"ORDER BY Nombre",
          Carpeta:"pai",
          TabFor:{"Fil":[1,2,3,4],"Col":[1]},
        }
      break;

      case "Idiomas":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Idiomas",
          CamMod:[
            {Tit:"Descripción",Cmp:"Descripcion",Tip:"Texto",Req:"No",VD:"",Val:"",Tam:"Gra"},
            {Tit:"Español",Cmp:"Esp",Tip:"Texto",Req:"No",VD:"",Val:"",Tam:"Gra"},
            {Tit:"Ingles",Cmp:"Ing",Tip:"Texto",Req:"No",VD:"",Val:"",Tam:"Gra"},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"idiomas",
          Donde:"",
          Ordena:"ORDER BY Clave",
          Carpeta:"cat",
          TabFor:{"Fil":[1,2,3,4],"Col":[1]},
        }
      break;

      case "Parámetros":
        this.DGM = {
          Menu: "Datos",
          Nombre: "Parámetros",
          CamMod:[
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:"",Blo:"Si"},
            {Tit:"Valor",Cmp:"Valor",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Símbolo",Cmp:"Simbolo",Tip:"Texto",Req:"No",VD:"",Val:"",Blo:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"No",
          OpcAgr:"No",
          OpcMod:"Si",
          OpcEli:"No",
          CamQry:"*",
          Tabla:"parametros",
          Donde:"WHERE Clave NOT LIKE |AI·|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Preguntas":
        this.DGM = {
          Menu: "Soporte",
          Nombre: "FAQ",
          CamMod:[
            {Tit:"Usuario",Cmp:"Usuario",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Admin",Tex:"Admin",Dis:""},{Val:"Tecnico",Tex:"Tecnico",Dis:""},{Val:"Cliente",Tex:"Cliente",Dis:""}]},
            {Tit:"Tema",Cmp:"Tema",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Pregunta",Cmp:"Pregunta",Tip:"Texto",Req:"Si",VD:"",Val:"",Tam:"Gra"},
            {Tit:"Respuesta",Cmp:"Respuesta",Tip:"Texto",Req:"Si",VD:"",Val:"",Tam:"Gra"},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"",Val:"",Opcs:[{Val:"Activa",Tex:"Activa",Dis:""},{Val:"Inactiva",Tex:"Inactiva",Dis:""}]}
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"prefre",
          Donde:"",
          Ordena:"ORDER BY Usuario,Tema",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;
      
      case "Administradores":
        this.DGM = {
          Menu: "Usuarios",
          Nombre: "Administradores",
          CamMod:[
            {Tit:"Foto Perfil",Cmp:"FotPer",Tip:"Imagen",Req:"Si",VD:"fpdu.png",Val:"",Est:"",Car:"usu"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Apellido",Cmp:"Apellido",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Teléfono",Cmp:"Telefono",Tip:"Telefono",Req:"Si",VD:"",Val:""},
            {Tit:"Email",Cmp:"Email",Tip:"Email",Req:"Si",VD:"",Val:""},
            {Tit:"Password",Cmp:"Password",Tip:"Password",Req:"Si",VD:"",Val:""},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activo",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Bloqueado",Tex:"Bloqueado",Dis:""}]},
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Texto",Req:"Si",VD:"Admin",Val:"",Blo:"Si",Ocu:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          CamQry:"*",
          Tabla:"usuarios",
          Donde:"WHERE Tipo = |Admin|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Soporte":
        this.DGM = {
          Menu: "Usuarios",
          Nombre: "Soporte",
          CamMod:[
            {Tit:"Foto Perfil",Cmp:"FotPer",Tip:"Imagen",Req:"Si",VD:"fpdu.png",Val:"",Est:"",Car:"usu"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Apellido",Cmp:"Apellido",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Teléfono",Cmp:"Telefono",Tip:"Telefono",Req:"Si",VD:"",Val:""},
            {Tit:"Email",Cmp:"Email",Tip:"Email",Req:"Si",VD:"",Val:""},
            {Tit:"Password",Cmp:"Password",Tip:"Password",Req:"Si",VD:"",Val:""},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activo",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Bloqueado",Tex:"Bloqueado",Dis:""}]},
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Texto",Req:"Si",VD:"Soporte",Val:"",Blo:"Si",Ocu:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          OpcDet:"Si",
          CamQry:"*",
          Tabla:"usuarios",
          Donde:"WHERE Tipo = |Soporte|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4],"Col":[1,2]},
        }
      break;

      case "Técnicos":
        let FHA = new Date().toISOString().replace("T"," ").substring(0,19);
        console.log(FHA);
        this.DGM = {
          Menu: "Usuarios",
          Nombre: "Técnicos",
          CamMod:[
            {Tit:"Foto Perfil",Cmp:"FotPer",Tip:"Imagen",Req:"Si",VD:"fpdu.png",Val:"",Est:"",Car:"usu"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Apellido",Cmp:"Apellido",Tip:"Texto",Req:"No",VD:"",Val:""},
            {Tit:"Teléfono",Cmp:"Telefono",Tip:"Telefono",Req:"Si",VD:"",Val:""},
            {Tit:"Email",Cmp:"Email",Tip:"Email",Req:"Si",VD:"",Val:""},
            {Tit:"Password",Cmp:"Password",Tip:"Password",Req:"Si",VD:"",Val:""},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activo",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Bloqueado",Tex:"Bloqueado",Dis:""}]},
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Texto",Req:"Si",VD:"Tecnico",Val:"",Blo:"Si",Ocu:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          OpcDet:"No",
          CamQry:"*",
          Tabla:"usuarios",
          Donde:"WHERE Tipo = |Tecnico|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4,5,6],"Col":[1,2,3]},
        }
      break;

      

      case "Clientes":
        this.DGM = {
          Menu: "Usuarios",
          Nombre: "Clientes",
          CamMod:[
            {Tit:"Foto Perfil",Cmp:"FotPer",Tip:"Imagen",Req:"Si",VD:"fpdu.png",Val:"",Est:"",Car:"usu"},
            {Tit:"Nombre",Cmp:"Nombre",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Apellido",Cmp:"Apellido",Tip:"Texto",Req:"Si",VD:"",Val:""},
            {Tit:"Teléfono",Cmp:"Telefono",Tip:"Telefono",Req:"Si",VD:"",Val:""},
            {Tit:"Email",Cmp:"Email",Tip:"Email",Req:"Si",VD:"",Val:""},
            {Tit:"Password",Cmp:"Password",Tip:"Password",Req:"Si",VD:"Activo",Val:""},
            {Tit:"Estatus",Cmp:"Estatus",Tip:"Select",Req:"Si",VD:"Activo",Val:"",Opcs:[{Val:"Activo",Tex:"Activo",Dis:""},{Val:"Bloqueado",Tex:"Bloqueado",Dis:""}]},
            {Tit:"Tipo",Cmp:"Tipo",Tip:"Texto",Req:"Si",VD:"Cliente",Val:"",Blo:"Si",Ocu:"Si"},
          ],
          OpcFil:"Si",
          OpcReg:"Si",
          OpcAgr:"Si",
          OpcMod:"Si",
          OpcEli:"Si",
          OpcDet:"No",
          CamQry:"*",
          Tabla:"usuarios",
          Donde:"WHERE Tipo = |Cliente|",
          Ordena:"ORDER BY Nombre",
          Carpeta:"usu",
          TabFor:{"Fil":[1,2,3,4,5],"Col":[1,2,3]},
        }
      break;
    }

    this.CarCmpQry();
    this.CarLis();
  }


  //////////////////////////////////Asignacion////////////////////////////////
  CarDetAsi(Asi){
    this.DetDat = Asi;
    this.DetDat.NRegTec = "";
    this.CarLisTecAsi();
  }

  AsiTecAsi(){
    if (!this.servicios.ValCam("IBNRegTec","Técnico","Texto",this.DetDat.NRegTec,"Si")){return}

    let NueEst = "Asignada";
    let CyV = "NRegTec=|"+this.DetDat.NRegTec+"|,Estatus=|"+NueEst+"|,FecHorAsi=NOW()";
    this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"asistencias","WHERE NRegistro="+this.DetDat.NRegistro+"","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.CarLis();
      this.servicios.EnvNot(this.DetDat.NRegCli,"Asistencia Asignada","Tu asistencia fue asignada","Asistencias",this.DetDat.NRegistro)
      this.servicios.EnvNot(this.DetDat.NRegTec,"Asistencia Asignada","Tienes una nueva asistencia asignada","Asistencias",this.DetDat.NRegistro)

      this.CloModAsiAsi.nativeElement.click();
      this.servicios.EnvMsgSim("La Asistencia fue asignada","Hecho")
    }).catch((err)=>{console.log(err)});

  }

  CarLisTecAsi(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","usuarios","WHERE Tipo=|Tecnico| AND Estatus=|Activo|","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.DetDat.LisTec = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Asignacion////////////////////////////////

  //////////////////////////////////Rentas - Ventas///////////////////////////
  CarDetRen(Ren){
    this.DetDat = Ren;
    if (this.DetDat.NRegTec == "0"){this.DetDat.NRegTec = "";}
    this.CarLisTecRen();
    this.CarLisHerRen();
  }

  AsiTecRen(){
    if (!this.servicios.ValCam("IBNRegTec","Técnico","Texto",this.DetDat.NRegTec,"Si")){return}

    let NueEst = "Asignada";
    let CyV = "NRegTec=|"+this.DetDat.NRegTec+"|,Estatus=|"+NueEst+"|,FecHorAsi=NOW()";
    this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"herramientas","WHERE NRegistro="+this.DetDat.NRegistro+"","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.CarLis();
      this.servicios.EnvNot(this.DetDat.NRegCli,this.DetDat.Tipo+" Asignada","Tu "+this.DetDat.Tipo+" fue asignada",this.DetDat.Tipo,this.DetDat.NRegistro)
      this.servicios.EnvNot(this.DetDat.NRegTec,this.DetDat.Tipo+" Asignada","Tienes una nueva "+this.DetDat.Tipo+" asignada",this.DetDat.Tipo,this.DetDat.NRegistro)

      this.CloModAsiRen.nativeElement.click();
      this.servicios.EnvMsgSim("La Asistencia fue asignada","Hecho")
    }).catch((err)=>{console.log(err)});

  }

  CarLisTecRen(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","usuarios","WHERE Tipo=|Tecnico| AND Estatus=|Activo|","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.DetDat.LisTec = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  CarLisHerRen(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(SELECT Foto FROM herramientasdis WHERE NRegistro=A.NRegDis) FotHer,(SELECT Nombre FROM herramientasdis WHERE NRegistro=A.NRegDis) NomHer,(SELECT Marca FROM herramientasdis WHERE NRegistro=A.NRegDis) MarHer,(SELECT Modelo FROM herramientasdis WHERE NRegistro=A.NRegDis) ModHer,(SELECT Existencia FROM herramientasdis WHERE NRegistro=A.NRegDis) ExiHer","","","herramientasdet A","WHERE NRegHer="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.DetDat.LisHer = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Rentas - Ventas///////////////////////////


  //////////////////////////////////Ferreterías///////////////////////////////
  CarDetFer(Fer){
    this.DetDat = Fer;
    if (this.DetDat.NRegTec == "0"){this.DetDat.NRegTec = "";}
    this.CarLisTecFer();
    this.CarLisHerFer();
  }

  AsiTecFer(){
    if (!this.servicios.ValCam("IBNRegTec","Técnico","Texto",this.DetDat.NRegTec,"Si")){return}

    let NueEst = "Asignada";
    let CyV = "NRegTec=|"+this.DetDat.NRegTec+"|,Estatus=|"+NueEst+"|,FecHorAsi=NOW()";
    this.servicios.AccSobBDAA("UPDATE","No","","",CyV,"ferreterias","WHERE NRegistro="+this.DetDat.NRegistro+"","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.CarLis();
      this.servicios.EnvNot(this.DetDat.NRegCli,"Pedido Asignado","Tu pedido fue asignado","Ferreterías",this.DetDat.NRegistro)
      this.servicios.EnvNot(this.DetDat.NRegTec,"Pedido Asignado","Tienes una nuevo pedido asignada","Ferreterías",this.DetDat.NRegistro)

      this.CloModAsiFer.nativeElement.click();
      this.servicios.EnvMsgSim("La Asistencia fue asignada","Hecho")
    }).catch((err)=>{console.log(err)});

  }

  CarLisTecFer(){
    this.servicios.AccSobBDAA("SELECT","Si","*","","","usuarios","WHERE Tipo=|Tecnico| AND Estatus=|Activo|","","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.DetDat.LisTec = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  CarLisHerFer(){
    this.servicios.AccSobBDAA("SELECT","Si","*,(SELECT Foto FROM ferreteriaspro WHERE NRegistro=A.NRegPro) FotHer,(SELECT Nombre FROM ferreteriaspro WHERE NRegistro=A.NRegPro) NomHer,(SELECT Marca FROM ferreteriaspro WHERE NRegistro=A.NRegPro) MarHer,(SELECT Modelo FROM ferreteriaspro WHERE NRegistro=A.NRegPro) ModHer,(SELECT Existencia FROM ferreteriaspro WHERE NRegistro=A.NRegPro) ExiHer","","","ferreteriasdet A","WHERE NRegFer="+this.DetDat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.DetDat.LisPro = Res.data;
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////Ferreterías///////////////////////////////





  Refrescar(){
    window.localStorage.setItem("buscar"+this.DGM.Nombre,"");
    this.DonBus = "";
    this.DatRes = null;
    this.CarLis();
  }
  EjeFun(Acc,Dat){
    if (Acc == "Agregar"){
      for (var n = 0; n < this.DGM.CamMod.length; n++){
        if (this.DGM.CamMod[n].Tip == "Password"){this.DGM.CamMod[n].VD = this.servicios.GenCodAN();}
        if (this.DGM.CamMod[n].Cmp == "Codigo"){this.DGM.CamMod[n].VD = this.servicios.GenCodAN();}
        this.DGM.CamMod[n].Val = this.DGM.CamMod[n].VD;
      }
    }else if (Acc == "Buscar"){
      for (var n2 = 0; n2 < this.DGM.CamMod.length; n2++){
        this.DGM.CamMod[n2].Val = "";
      }

    }else{
      for(let Cam in Dat){
        for (var n2 = 0; n2 < this.DGM.CamMod.length; n2++){
          if(Cam == this.DGM.CamMod[n2].Cmp){
            this.DGM.CamMod[n2].Val = Dat[Cam];
            if (this.DGM.CamMod[n2].Tip=="Password"){
              this.DGM.CamMod[n2].Val = atob(this.DGM.CamMod[n2].Val)
            }
          }
        }
      }
    }

    this.servicios.DGF = {Acc:Acc,Dat:Dat,DGM:this.DGM};
  }

  CarDet(Dat){
    this.DetDat = Dat
  }

  CarCmpQry(){
    for (var n = 0; n < this.DGM.CamMod.length; n++){
      if (this.DGM.CamMod[n].Tip == "SelectQry"){
        let IDC:number = n;
        this.servicios.AccSobBDAA("SELECT","Si",this.DGM.CamMod[n].Qry.Cmps+",(||) Dis","","",this.DGM.CamMod[n].Qry.Tab,this.DGM.CamMod[n].Qry.Don,this.DGM.CamMod[n].Qry.Ord,"",true).then((dataRes)=>{
          let Res: any = dataRes;
          // console.log(Res);
          this.DGM.CamMod[IDC].Qry.Res = Res.data;
        }).catch((err)=>{console.log(err)});
      }
    }
  }
  CarLis(){
    if(window.localStorage.getItem("buscar"+this.DGM.Nombre) != "" && window.localStorage.getItem("buscar"+this.DGM.Nombre) != null){
      if (this.DGM.Donde == ""){
        this.DonBus = "WHERE " + window.localStorage.getItem("buscar"+this.DGM.Nombre);
      }else{
        this.DonBus = " AND " + window.localStorage.getItem("buscar"+this.DGM.Nombre);
      }
    }else{
      this.DonBus = "";
    }

    this.servicios.AccSobBDAA("SELECT","Si",this.DGM.CamQry,"","",this.DGM.Tabla,this.DGM.Donde+this.DonBus,this.DGM.Ordena,"",true).then((dataRes)=>{
      let Res: any = dataRes;
      // console.log(Res);
      this.DatRes = Res.data;
      this.CarLisExp();
    }).catch((err)=>{console.log(err)});
  }
  CarLisExp(){
    this.OJE = [];
    for (var n = 0; n < this.DatRes.length; n++){
      let BOJE = {};
      for (var n2 = 0; n2 < this.DGM.CamMod.length; n2++){
        BOJE[this.DGM.CamMod[n2].Tit] = this.servicios.ForCamMod(this.DatRes[n][this.DGM.CamMod[n2].Cmp],this.DGM.CamMod[n2]);
      }
      this.OJE.push(BOJE);
    }
  }



  VolFDA(){
    this.CloModFDA.nativeElement.click();
  }
  CamValFDA(IDC){
    switch (this.servicios.DGF.DGM.CamMod[IDC].FunEsp) {
      case "CarCiuDep":
        console.log(this.servicios.DGF.DGM.CamMod[IDC]);
        console.log(this.servicios.DGF.DGM.CamMod[IDC].Qry.Res)
        for (let n = 0; n < this.servicios.DGF.DGM.CamMod[IDC].Qry.Res.length; n++) {
          if (this.servicios.DGF.DGM.CamMod[IDC].Qry.Res[n].Nombre == this.servicios.DGF.DGM.CamMod[IDC].Val){
            this.servicios.DGF.DGM.CamMod[IDC+1].Opcs = [];
            let MC = this.servicios.DGF.DGM.CamMod[IDC].Qry.Res[n].Ciudades.split(",");
            for (let n2 = 0; n2 < MC.length; n2++) {
              MC[n2] = MC[n2].trim();
              this.servicios.DGF.DGM.CamMod[IDC+1].Opcs.push({Val:MC[n2],Tex:MC[n2],Dis:""})
            }
          }
        }
      break;

      
      /*
      // let NumMes = 0;
      case "RevCerAgr":
        if (this.servicios.DGF.DGM.CamMod[0].Val == "" && this.servicios.DGF.DGM.CamMod[2].Val == ""){return;} //NRegCol
        if (IDC == 0){
          this.servicios.DGF.DGM.CamMod[2].Val = this.servicios.DGF.DGM.CamMod[0].Val
        }else if (IDC == 2){
          this.servicios.DGF.DGM.CamMod[0].Val = this.servicios.DGF.DGM.CamMod[2].Val
        }
        this.servicios.DGF.DGM.CamMod[3].Val = "" //NRegCer
        for (let n = 0; n < this.servicios.DGF.DGM.CamMod[3].Qry.Res.length; n++) {
          this.servicios.DGF.DGM.CamMod[3].Qry.Res[n].Dis = "";
        }
        if (this.servicios.DGF.Acc == "Agregar"){
          this.servicios.AccSobBDAA("SELECT","Si","NRegCer","","","certificaciones","WHERE NRegCol="+this.servicios.DGF.DGM.CamMod[0].Val,"","",true).then((dataRes)=>{
            let Res: any = dataRes;
            // console.log(Res,"***");
            for (let n = 0; n < Res.data.length; n++) {
              for (let n2 = 0; n2 < this.servicios.DGF.DGM.CamMod[3].Qry.Res.length; n2++) {
                if (Res.data[n].NRegCer == this.servicios.DGF.DGM.CamMod[3].Qry.Res[n2].NRegistro){
                  this.servicios.DGF.DGM.CamMod[3].Qry.Res[n2].Dis = "disabled";
                }
              }
            }
          }).catch((err)=>{console.log(err)});
        }
      break;

      case "RevIndAgr":
        if (this.servicios.DGF.DGM.CamMod[0].Val == "" && this.servicios.DGF.DGM.CamMod[1].Val == ""){return;} //NRegCol
        if (IDC == 0){
          this.servicios.DGF.DGM.CamMod[1].Val = this.servicios.DGF.DGM.CamMod[0].Val
        }else if (IDC == 1){
          this.servicios.DGF.DGM.CamMod[0].Val = this.servicios.DGF.DGM.CamMod[1].Val
        }
        this.servicios.DGF.DGM.CamMod[2].Val = "" //NRegInd
        for (let n = 0; n < this.servicios.DGF.DGM.CamMod[2].Qry.Res.length; n++) {
          this.servicios.DGF.DGM.CamMod[2].Qry.Res[n].Dis = "";
        }
        if (this.servicios.DGF.Acc == "Agregar"){
          this.servicios.AccSobBDAA("SELECT","Si","NRegInd","","","inducciones","WHERE NRegCol="+this.servicios.DGF.DGM.CamMod[0].Val,"","",true).then((dataRes)=>{
            let Res: any = dataRes;
            // console.log(Res,"***");
            for (let n = 0; n < Res.data.length; n++) {
              for (let n2 = 0; n2 < this.servicios.DGF.DGM.CamMod[2].Qry.Res.length; n2++) {
                if (Res.data[n].NRegInd == this.servicios.DGF.DGM.CamMod[2].Qry.Res[n2].NRegistro){
                  this.servicios.DGF.DGM.CamMod[2].Qry.Res[n2].Dis = "disabled";
                }
              }
            }
          }).catch((err)=>{console.log(err)});
        }
      break;

      case "CalFecVenCer":
        if (this.servicios.DGF.DGM.CamMod[6].Val == ""){return;}
        if (this.servicios.DGF.DGM.CamMod[7].Val == ""){return;}

        switch (this.servicios.DGF.DGM.CamMod[7].Val) {
          case "1 Mes":
            NumMes = 1;
          break;
          case "2 Meses":
            NumMes = 2;
          break;
          case "3 Meses":
            NumMes = 3;
          break;
          case "4 Meses":
            NumMes = 4;
          break;
          case "5 Meses":
            NumMes = 5;
          break;
          case "6 Meses":
            NumMes = 6;
          break;
          case "7 Meses":
            NumMes = 7;
          break;
          case "8 Meses":
            NumMes = 8;
          break;
          case "9 Meses":
            NumMes = 9;
          break;
          case "10 Meses":
            NumMes = 10;
          break;
          case "11 Meses":
            NumMes = 11;
          break;
          case "12 Meses":
            NumMes = 12;
          break;
          case "1 Año":
            NumMes = 12;
          break;
          case "2 Años":
            NumMes = 24;
          break;
          case "3 Años":
            NumMes = 36;
          break;
          case "4 Años":
            NumMes = 48;
          break;
          case "5 Años":
            NumMes = 60;
          break;
        }
        // console.log(this.servicios.DGF.DGM.CamMod[4].Val,this.servicios.DGF.DGM.CamMod[5].Val,NumMes);
        this.servicios.DGF.DGM.CamMod[8].Val = this.servicios.ObtFecSumMes(this.servicios.DGF.DGM.CamMod[6].Val,NumMes)
      break;

      case "CalFecVenInd":
        if (this.servicios.DGF.DGM.CamMod[5].Val == ""){return;}
        if (this.servicios.DGF.DGM.CamMod[6].Val == ""){return;}

        switch (this.servicios.DGF.DGM.CamMod[6].Val) {
          case "1 Mes":
            NumMes = 1;
          break;
          case "2 Meses":
            NumMes = 2;
          break;
          case "3 Meses":
            NumMes = 3;
          break;
          case "4 Meses":
            NumMes = 4;
          break;
          case "5 Meses":
            NumMes = 5;
          break;
          case "6 Meses":
            NumMes = 6;
          break;
          case "7 Meses":
            NumMes = 7;
          break;
          case "8 Meses":
            NumMes = 8;
          break;
          case "9 Meses":
            NumMes = 9;
          break;
          case "10 Meses":
            NumMes = 10;
          break;
          case "11 Meses":
            NumMes = 11;
          break;
          case "12 Meses":
            NumMes = 12;
          break;
          case "1 Año":
            NumMes = 12;
          break;
          case "2 Años":
            NumMes = 24;
          break;
          case "3 Años":
            NumMes = 36;
          break;
          case "4 Años":
            NumMes = 48;
          break;
          case "5 Años":
            NumMes = 60;
          break;
        }
        // console.log(this.servicios.DGF.DGM.CamMod[4].Val,this.servicios.DGF.DGM.CamMod[5].Val,NumMes);
        this.servicios.DGF.DGM.CamMod[7].Val = this.servicios.ObtFecSumMes(this.servicios.DGF.DGM.CamMod[5].Val,NumMes)
      break;

      case "CooNomIde":
        if (this.servicios.DGF.DGM.CamMod[0].Val == "" && this.servicios.DGF.DGM.CamMod[2].Val == ""){return;} //NRegCol
        if (IDC == 0){
          this.servicios.DGF.DGM.CamMod[2].Val = this.servicios.DGF.DGM.CamMod[0].Val
        }else if (IDC == 2){
          this.servicios.DGF.DGM.CamMod[0].Val = this.servicios.DGF.DGM.CamMod[2].Val
        }
      break;

      case "CalEda":
        if (this.servicios.DGF.DGM.CamMod[9].Val != ""){//FecNac
          this.servicios.DGF.DGM.CamMod[10].Val = this.servicios.ObtEda(this.servicios.DGF.DGM.CamMod[9].Val);
        }else{
          this.servicios.DGF.DGM.CamMod[10].Val = 0;
        }
      break;
      */
    }

  }
  async EjeFDA(Acc){
    let Acci = "";
    let CmpS = "";
    let ValS = "";
    let CyVS = "";
    let Dond = "";

    if (Acc == "Buscar"){
      for (var n2 = 0; n2 < this.servicios.DGF.DGM.CamMod.length; n2++){
        if (this.servicios.DGF.DGM.CamMod[n2].Val != ""){
          if (Dond == ""){
            if (this.servicios.DGF.DGM.CamMod[n2].Tip == "SelectQry" || this.servicios.DGF.DGM.CamMod[n2].Tip == "Select"){
              Dond = this.servicios.DGF.DGM.CamMod[n2].Cmp+" = |"+this.servicios.DGF.DGM.CamMod[n2].Val+"|";
            }else if (this.servicios.DGF.DGM.CamMod[n2].Cmp.substr(0,3) == "Fec"){
              Dond = this.servicios.DGF.DGM.CamMod[n2].Cmp+" LIKE |"+this.servicios.DGF.DGM.CamMod[n2].Val.substr(0,10)+"·|";
            }else if (this.servicios.DGF.DGM.CamMod[n2].SubQry){
              Dond = this.servicios.DGF.DGM.CamMod[n2].SubQry+" LIKE |·"+this.servicios.DGF.DGM.CamMod[n2].Val+"·|";
            }else{
              Dond = this.servicios.DGF.DGM.CamMod[n2].Cmp+" LIKE |·"+this.servicios.DGF.DGM.CamMod[n2].Val+"·|";
            }
          }else{
            if (this.servicios.DGF.DGM.CamMod[n2].Tip == "SelectQry" || this.servicios.DGF.DGM.CamMod[n2].Tip == "Select"){
              Dond = this.servicios.DGF.DGM.CamMod[n2].Cmp+" = |"+this.servicios.DGF.DGM.CamMod[n2].Val+"|";
            }else if (this.servicios.DGF.DGM.CamMod[n2].Cmp.substr(0,3) == "Fec"){
              Dond = Dond+" AND "+this.servicios.DGF.DGM.CamMod[n2].Cmp+" LIKE |"+this.servicios.DGF.DGM.CamMod[n2].Val.substr(0,10)+"·|";
            }else if (this.servicios.DGF.DGM.CamMod[n2].SubQry){
              Dond = Dond+" AND "+this.servicios.DGF.DGM.CamMod[n2].SubQry+" LIKE |·"+this.servicios.DGF.DGM.CamMod[n2].Val+"·|";
            }else{
              Dond = Dond+" AND "+this.servicios.DGF.DGM.CamMod[n2].Cmp+" LIKE |·"+this.servicios.DGF.DGM.CamMod[n2].Val+"·|";
            }
          }
        }
      }

      window.localStorage.setItem("buscar"+this.servicios.DGF.DGM.Nombre,Dond);
      this.CloModFDA.nativeElement.click();
      this.CarLis();
      return;
    }

    for (var n = 0; n < this.servicios.DGF.DGM.CamMod.length; n++){
      console.log(this.servicios.DGF.DGM.CamMod[n].CE,"<<<")
      if (this.servicios.DGF.DGM.CamMod[n].CE != "Si"){
        if (!this.servicios.ValCam("IB"+n,this.servicios.DGF.DGM.CamMod[n].Tit,this.servicios.DGF.DGM.CamMod[n].Tip,this.servicios.DGF.DGM.CamMod[n].Val,this.servicios.DGF.DGM.CamMod[n].Req)){return;}
        if (n == 0){
          CmpS = this.servicios.DGF.DGM.CamMod[n].Cmp;
          if (this.servicios.DGF.DGM.CamMod[n].Tip == "Password"){
            ValS = "|"+btoa(this.servicios.DGF.DGM.CamMod[n].Val)+"|";
            CyVS = this.servicios.DGF.DGM.CamMod[n].Cmp+"="+"|"+btoa(this.servicios.DGF.DGM.CamMod[n].Val)+"|";
          }else{
            ValS = "|"+this.servicios.DGF.DGM.CamMod[n].Val+"|";
            CyVS = this.servicios.DGF.DGM.CamMod[n].Cmp+"="+"|"+this.servicios.DGF.DGM.CamMod[n].Val+"|";
          }
        }else{
          CmpS = CmpS+","+this.servicios.DGF.DGM.CamMod[n].Cmp;
          if (this.servicios.DGF.DGM.CamMod[n].Tip == "Password"){
            ValS = ValS+",|"+btoa(this.servicios.DGF.DGM.CamMod[n].Val)+"|";
            CyVS = CyVS+","+this.servicios.DGF.DGM.CamMod[n].Cmp+"="+"|"+btoa(this.servicios.DGF.DGM.CamMod[n].Val)+"|";
          }else{
            ValS = ValS+",|"+this.servicios.DGF.DGM.CamMod[n].Val+"|";
            CyVS = CyVS+","+this.servicios.DGF.DGM.CamMod[n].Cmp+"="+"|"+this.servicios.DGF.DGM.CamMod[n].Val+"|";
          }
        }
      }
    }

    ValS = ValS.replace("+","¬");
    CyVS = CyVS.replace("+","¬");

    switch(Acc){
      case "Agregar":
        Acci = "INSERT";
      break;
      case "Modificar":
        Acci = "UPDATE";
        Dond = "WHERE NRegistro = "+this.servicios.DGF.Dat.NRegistro;
      break;
      case "Eliminar":
        Acci = "DELETE";
        Dond = "WHERE NRegistro = "+this.servicios.DGF.Dat.NRegistro;
      break;
    }
    
    /*
    console.log(CmpS);
    console.log(ValS);
    console.log(CyVS);
    console.log(Dond);
    console.log(Acci);
    */

    this.servicios.AccSobBDAA(Acci,"No",CmpS,ValS,CyVS,this.servicios.DGF.DGM.Tabla,Dond,"","",true).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      this.CloModFDA.nativeElement.click();
      this.CarLis();
      this.servicios.CarLisPar();
    }).catch((err)=>{console.log(err)});

  }

  //////////////////////////////////////FOTOS/////////////////////////////////////
  CarFot(Des){
    console.log(Des)
    this.DesFot = Des
    this.InpFot.nativeElement.click();
  }
  ActVal(){
    let MMI = this.DesFot.split(",");

    if (MMI.length == 1){
      this.Cargando = this.DesFot;
    }else{
      this.servicios.DGF.DGM.CamMod[MMI[1]].Est = "Cargando"
    }

    let IFO = document.getElementById("InpFot");

    let NAA = (IFO as HTMLInputElement).files[0].name;
    let MNAA = NAA.split(".");
    let NIA: string = new Date().getTime().toString();
    if (this.servicios.UsuMat){
      NIA = this.servicios.UsuMat.NRegistro+"-"+NIA+"."+MNAA[(MNAA.length-1)];
    }else{
      NIA = "00-"+NIA+"."+MNAA[(MNAA.length-1)];
    }

    let Carpeta: string = ""

    if (MMI.length == 1){
      switch (this.DesFot) {
        case "ImaSer":
          Carpeta = "ser";
        break;
        case "FotSer1":
          Carpeta = "ser";
        break;
        case "FotSer2":
          Carpeta = "ser";
        break;
        case "FotSer3":
          Carpeta = "ser";
        break;
        case "FotSer4":
          Carpeta = "ser";
        break;
        case "FotSer5":
          Carpeta = "ser";
        break;
        case "FotSer6":
          Carpeta = "ser";
        break;


        case "ImaEve":
          Carpeta = "eve";
        break;
        case "FotEve1":
          Carpeta = "eve";
        break;
        case "FotEve2":
          Carpeta = "eve";
        break;
        case "FotEve3":
          Carpeta = "eve";
        break;
        case "FotEve4":
          Carpeta = "eve";
        break;
        case "FotEve5":
          Carpeta = "eve";
        break;
        case "FotEve6":
          Carpeta = "eve";
        break;


        case "ImaCup":
          Carpeta = "cup";
        break;
        case "FotCup1":
          Carpeta = "cup";
        break;
        case "FotCup2":
          Carpeta = "cup";
        break;
        case "FotCup3":
          Carpeta = "cup";
        break;
        case "FotCup4":
          Carpeta = "cup";
        break;
        case "FotCup5":
          Carpeta = "cup";
        break;
        case "FotCup6":
          Carpeta = "cup";
        break;

        case "ImaPro":
          Carpeta = "usu";
        break;
        case "FotPro1":
          Carpeta = "usu";
        break;
        case "FotPro2":
          Carpeta = "usu";
        break;
        case "FotPro3":
          Carpeta = "usu";
        break;
        case "FotPro4":
          Carpeta = "usu";
        break;
        case "FotPro5":
          Carpeta = "usu";
        break;
        case "FotPro6":
          Carpeta = "usu";
        break;

        case "FotPer":
          Carpeta = "usu";
        break;
      }
    }else{
      Carpeta = this.servicios.DGF.DGM.CamMod[MMI[1]].Car
    }


    this.servicios.SubFotArc(IFO,NIA,"img/"+Carpeta+"/upload.php").then((dataRes)=>{
      console.log(dataRes);
      let Res: any = dataRes;
      if (Res.estatus == "success"){

        if (MMI.length == 1){
          switch (this.DesFot) {
            case "ImaSer":
              this.DetDat.Imagen = Res.name;
            break;
            case "FotSer1":
              this.DetDat.Foto1 = Res.name;
            break;
            case "FotSer2":
              this.DetDat.Foto2 = Res.name;
            break;
            case "FotSer3":
              this.DetDat.Foto3 = Res.name;
            break;
            case "FotSer4":
              this.DetDat.Foto4 = Res.name;
            break;
            case "FotSer5":
              this.DetDat.Foto5 = Res.name;
            break;
            case "FotSer6":
              this.DetDat.Foto6 = Res.name;
            break;

            case "ImaEve":
              this.DetDat.Imagen = Res.name;
            break;
            case "FotEve1":
              this.DetDat.Foto1 = Res.name;
            break;
            case "FotEve2":
              this.DetDat.Foto2 = Res.name;
            break;
            case "FotEve3":
              this.DetDat.Foto3 = Res.name;
            break;
            case "FotEve4":
              this.DetDat.Foto4 = Res.name;
            break;
            case "FotEve5":
              this.DetDat.Foto5 = Res.name;
            break;
            case "FotEve6":
              this.DetDat.Foto6 = Res.name;
            break;

            case "ImaCup":
              this.DetDat.Imagen = Res.name;
            break;
            case "FotCup1":
              this.DetDat.Foto1 = Res.name;
            break;
            case "FotCup2":
              this.DetDat.Foto2 = Res.name;
            break;
            case "FotCup3":
              this.DetDat.Foto3 = Res.name;
            break;
            case "FotCup4":
              this.DetDat.Foto4 = Res.name;
            break;
            case "FotCup5":
              this.DetDat.Foto5 = Res.name;
            break;
            case "FotCup6":
              this.DetDat.Foto6 = Res.name;
            break;

            case "ImaPro":
              this.servicios.UsuMat.Imagen = Res.name;
            break;
            case "FotPro1":
              this.servicios.UsuMat.Foto1 = Res.name;
            break;
            case "FotPro2":
              this.servicios.UsuMat.Foto2 = Res.name;
            break;
            case "FotPro3":
              this.servicios.UsuMat.Foto3 = Res.name;
            break;
            case "FotPro4":
              this.servicios.UsuMat.Foto4 = Res.name;
            break;
            case "FotPro5":
              this.servicios.UsuMat.Foto5 = Res.name;
            break;
            case "FotPro6":
              this.servicios.UsuMat.Foto6 = Res.name;
            break;

            case "FotPer":
              this.servicios.UsuMat.FotPer = Res.name;
            break;
          }
        }else{
          this.servicios.DGF.DGM.CamMod[MMI[1]].Val = Res.name;
        }

      }

      if (MMI.length == 1){
        this.Cargando = "";
      }else{
        this.servicios.DGF.DGM.CamMod[MMI[1]].Est = ""
      }

      this.InpFot.nativeElement.value = "";
      this.DesFot = "";
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////////FOTOS/////////////////////////////////////

  //////////////////////////////////////DOCUMENTOS/////////////////////////////////////
  CarDoc(Des){
    console.log(Des)
    this.DesDoc = Des
    this.InpDoc.nativeElement.click();
  }
  ActValDoc(){
    let MMI = this.DesDoc.split(",");

    if (MMI.length == 1){
      this.Cargando = this.DesDoc;
    }else{
      this.servicios.DGF.DGM.CamMod[MMI[1]].Est = "Cargando"
    }

    let IFO = document.getElementById("InpDoc");

    let NAA = (IFO as HTMLInputElement).files[0].name;
    let MNAA = NAA.split(".");
    let NIA: string = new Date().getTime().toString();
    if (this.servicios.UsuMat){
      NIA = this.servicios.UsuMat.NRegistro+"-"+NIA+"."+MNAA[(MNAA.length-1)];
    }else{
      NIA = "00-"+NIA+"."+MNAA[(MNAA.length-1)];
    }

    let Carpeta: string = ""

    if (MMI.length == 1){
      switch (this.DesDoc) {
        case "DocPer":
          Carpeta = "usu";
        break;
      }
    }else{
      Carpeta = this.servicios.DGF.DGM.CamMod[MMI[1]].Car
    }


    this.servicios.SubDocArc(IFO,NIA,"doc/"+Carpeta+"/upload.php").then((dataRes)=>{
      console.log(dataRes);
      let Res: any = dataRes;
      if (Res.estatus == "success"){

        if (MMI.length == 1){
          switch (this.DesDoc) {
            case "DocPer":
              this.servicios.UsuMat.DocPer = Res.name;
            break;
          }
        }else{
          this.servicios.DGF.DGM.CamMod[MMI[1]].Val = Res.name;
        }

      }

      if (MMI.length == 1){
        this.Cargando = "";
      }else{
        this.servicios.DGF.DGM.CamMod[MMI[1]].Est = ""
      }

      this.InpDoc.nativeElement.value = "";
      this.DesDoc = "";
    }).catch((err)=>{console.log(err)});
  }
  //////////////////////////////////////DOCUMENTOS/////////////////////////////////////

}
