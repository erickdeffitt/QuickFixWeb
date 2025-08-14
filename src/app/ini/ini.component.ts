import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicios } from '../../servicios/servicios';

import { register } from 'swiper/element/bundle'

@Component({
  selector: 'app-ini',
  templateUrl: './ini.component.html',
  styleUrl: './ini.component.scss'
})
export class IniComponent {

  PagAct: string = "Inicio";
  SecAct: string = "";

  @ViewChild("CerModLogReg") CerModLogReg: ElementRef;
  @ViewChild("CerModPas") CerModPas: ElementRef;
  @ViewChild("CerModCon") CerModCon: ElementRef;

  @ViewChild("InpFotReg") InpFotReg: ElementRef;
  CargandoReg: string = "";

  @ViewChild("InpFotPer") InpFotPer: ElementRef;
  CargandoPer: string = "";

  FunLogReg: string = "Log";
  InpLogNom: string = "";
  InpLogApe: string = "";
  InpLogEma: string = "";
  InpLogMen: string = "";
  InpLogOpi: string = "";
  InpLogPas: string = "";
  InpLogPasCon: string = "";
  Token: string = "";
  RecCon: boolean = false;
  MosCon: boolean = false;

  constructor(
    public router: Router,
    public routeAct: ActivatedRoute,
    public servicios: Servicios
  ) {
    register();

    switch (this.routeAct.snapshot.paramMap.get("NomPag")) {
      case "ayuda":
        this.MosPag("Ayuda");
      break;
      case "terminos":
        this.MosPag("Terminos");
      break;
      case "politicas":
        this.MosPag("Politicas");
      break;
      case "cookies":
        this.MosPag("Cookies");
      break;

      case "eliminar":
        this.MosPag("Eliminar");
      break;
    
      default:
      break;
    }
  }

  ngOnInit(){
    // console.log(this.servicios.UsuMat)
    // window.localStorage.setItem("Token","");
    this.Token = window.localStorage.getItem("Token");
    // console.log("***"+this.Token+"***");
    if (this.Token != "" && this.Token != null && this.Token != undefined){this.Login();}
  }

  MosPag(Pag,Sec=""){
    this.PagAct = Pag;
    this.SecAct = Sec;
    console.log(Pag,Sec,"***");

    switch (Pag) {
      case "Inicio":
      break;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////

  Login(){
    if(this.InpLogEma != "" && this.InpLogPas != "" || this.Token != ""){
      this.servicios.AccSobBDAA("LOGINADM","Si","",this.InpLogEma+","+this.InpLogPas+","+this.Token,"","","","","",true).then((dataRes)=>{
        let Res: any = dataRes;
        //console.log(Res);
        if (Res.data.length > 0){
          this.InpLogEma = "";
          this.InpLogPas = "";
          switch(Res.data[0].Estatus){
            case "Activo":
              window.localStorage.setItem("Token",Res.data[0].Token);
              this.servicios.UsuMat = Res.data[0];

              this.servicios.EnvMsgSim("Bienvenido "+this.servicios.UsuMat.Nombre,"Hecho");
              switch (this.servicios.UsuMat.Tipo) {
                case "Admin":
                  this.CerModLogReg.nativeElement.click();
                  this.router.navigate(["adm"]);
                break;
                case "Soporte":
                  this.CerModLogReg.nativeElement.click();
                  this.router.navigate(["adm"]);
                break;
                case "Proveedor":
                  this.MosPag("Inicio");
                  this.CerModLogReg.nativeElement.click();
                  this.router.navigate(["adm"]);
                break;
              }

            break;
  
            case "Nuevo":
              this.servicios.EnvMsgSim("Usuario Nuevo","Advertencia");
            break;
            
            case "Bloqueado":
              this.servicios.EnvMsgSim("Usuario Bloqueado","Peligro");
            break;
          }
        }else{
          this.servicios.EnvMsgSim("Usuario y/o contraseña invalida","Advertencia");
        }
      }).catch((err)=>{console.log(err)});
    }else{
      this.servicios.EnvMsgSim("Por favor complete los campos","Informacion");
    }
  }

  RegCue(){
    // if (this.servicios.UsuReg.FotPer == "fpdu.png"){this.servicios.EnvMsgSim("Seleccione una foto de perfil","Advertencia"); return;}
    if (!this.servicios.ValCam("InpLogNom","Nombre","Texto",this.InpLogNom,"Si")){return}
    if (!this.servicios.ValCam("InpLogApe","Apellido","Texto",this.InpLogApe,"Si")){return}
    if (!this.servicios.ValCam("InpLogEma","Email","Email",this.InpLogEma,"Si")){return}
    if (!this.servicios.ValCam("InpLogPas","Contraseña","Texto",this.InpLogPas,"Si")){return}
    if (this.InpLogPas.length < 6){this.servicios.EnvMsgSim("La contraseña debe tener al menos 6 caracteres","Advertencia"); return;}

    this.servicios.UsuReg.Nombre = this.InpLogNom;
    this.servicios.UsuReg.Apellido = this.InpLogApe;
    this.servicios.UsuReg.Email = this.InpLogEma;
    this.servicios.UsuReg.Pas = this.InpLogPas;
    this.servicios.UsuReg.Tipo = "Proveedor";

    let Campos = "Nombre,Apellido,Email,Password,FotPer,Tipo,FecHorReg,FecHorLog,FecHorIniMem,FecHorFinMem,Estatus";
    let Valores = "|"+this.servicios.UsuReg.Nombre+"|,|"+this.servicios.UsuReg.Apellido+"|,|"+this.servicios.UsuReg.Email+"|,|"+this.servicios.UsuReg.Pas+"|,|"+this.servicios.UsuReg.FotPer+"|,|"+this.servicios.UsuReg.Tipo+"|,NOW(),NOW(),NOW(),NOW(),|Activo|"
    this.servicios.AccSobBDAA("INSERT","No",Campos,Valores,"","usuarios","","","",true).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);

      window.localStorage.setItem("Token","");
      this.Token = "";
      this.Login();
    }).catch((err)=>{console.log(err.message)});

  }

  CarFotReg(){
    this.InpFotReg.nativeElement.click();
  }
  ActValReg(){
    this.CargandoReg = "Si";
    let IFO = document.getElementById("InpFotReg");
    let NA = (IFO as HTMLInputElement).files[0].name;
    let MN = NA.split(".");
    let NI: string = new Date().getTime().toString();
    if (this.servicios.UsuMat){
      NI = this.servicios.UsuMat.NRegistro+"-"+NI+"."+MN[(MN.length-1)];
    }else{
      NI = "00-"+NI+"."+MN[(MN.length-1)];
    }

    this.servicios.SubFotArc(IFO,NI,"img/usu/upload.php").then((dataRes)=>{
      console.log(dataRes);
      let Res: any = dataRes;
      if (Res.estatus == "success"){
        this.servicios.UsuReg.FotPer = Res.name;
      }
      this.InpFotReg.nativeElement.value = "";
      this.CargandoReg = "";
    }).catch((err)=>{console.log(err)});
  }

  CarFotPer(){
    this.InpFotPer.nativeElement.click();
  }
  ActValPer(){
    this.CargandoPer = "Si";
    let IFO = document.getElementById("InpFotPer");
    let NA = (IFO as HTMLInputElement).files[0].name;
    let MN = NA.split(".");
    let NI: string = new Date().getTime().toString();
    if (this.servicios.UsuMat){
      NI = this.servicios.UsuMat.NRegistro+"-"+NI+"."+MN[(MN.length-1)];
    }else{
      NI = "00-"+NI+"."+MN[(MN.length-1)];
    }

    this.servicios.SubFotArc(IFO,NI,"img/usu/upload.php").then((dataRes)=>{
      console.log(dataRes);
      let Res: any = dataRes;
      if (Res.estatus == "success"){
        this.servicios.UsuMat.FotPer = Res.name;
      }
      this.InpFotPer.nativeElement.value = "";
      this.CargandoPer = "";
    }).catch((err)=>{console.log(err)});
  }

  GuaPer(){
    if (!this.servicios.ValCam("InpUsuNom","Nombre","Texto",this.servicios.UsuMat.Nombre,"Si")){return}
    if (!this.servicios.ValCam("InpUsuApe","Apellido","Texto",this.servicios.UsuMat.Apellido,"Si")){return}
    if (!this.servicios.ValCam("InpUsuEma","Email","Email",this.servicios.UsuMat.Email,"Si")){return}
    if (!this.servicios.ValCam("InpUsuTel","Telófono","Telefono",this.servicios.UsuMat.Telefono,"Si")){return}

    this.servicios.AccSobBDAA("UPDATE","No","","","Nombre=|"+this.servicios.UsuMat.Nombre+"|,Apellido=|"+this.servicios.UsuMat.Apellido+"|,Email=|"+this.servicios.UsuMat.Email+"|,Telefono=|"+this.servicios.UsuMat.Telefono+"|","usuarios","WHERE NRegistro="+this.servicios.UsuMat.NRegistro,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.servicios.EnvMsgSim("¡Datos actualizados!","Hecho");
    }).catch((err)=>{console.log(err)});
  }

  ConCon(){
    if (!this.servicios.ValCam("InpPasB","Nueva Contraseña","Texto",this.InpLogPas,"Si")){return}
    if (!this.servicios.ValCam("InpPasBCon","Nueva Contraseña","Texto",this.InpLogPasCon,"Si")){return}
    if (this.InpLogPas != this.InpLogPasCon){this.servicios.EnvMsgSim("Las contraseñas no coinciden","Advertencia"); return;}

    this.servicios.AccSobBDAA("UPDATE","No","","","Password=|"+this.InpLogPas+"|","usuarios","WHERE NRegistro="+this.servicios.UsuMat.NRegistro+"","","",true).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);

      this.CerModPas.nativeElement.click();
      this.servicios.EnvMsgSim("La contraseña fue cambiada","Hecho");
    }).catch((err)=>{console.log(err)});
  }

  IniSes(){
    this.FunLogReg = "Log";
    this.InpLogNom = "";
    this.InpLogApe = "";
    this.InpLogEma = "";
    this.InpLogPas = "";
  }

  RegUsu(Met){
    this.FunLogReg = "Reg";
    this.InpLogNom = "";
    this.InpLogApe = "";
    this.InpLogEma = "";
    this.InpLogPas = "";

    switch (Met) {
      case "Ema":

      break;
    
      default:
        this.servicios.EnvMsgSim("Modulo en desarrollo ...","Advertencia");
      break;
    }
  }

  OlvCon(){
    if (!this.servicios.ValCam("InpLogEma","Correo electrónico","Email",this.InpLogEma,"Si")){return}
    this.RecCon = true;
    this.servicios.OlvCla(this.InpLogEma).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);
      if (Res.estatus == "success"){
        this.servicios.EnvMsgSim("Por favor verifique la bandeja de entrada de "+this.InpLogEma,"Informacion");
        this.InpLogEma = "";
      }else{
        this.servicios.EnvMsgSim("El Email "+this.InpLogEma+" no esta registrado en la base de datos","Advertencia");
      }
      this.RecCon = false;
    }).catch((err)=>{console.log(err)});
  }

  MosOcuCon(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    input.selectionStart = 999;
    input.selectionEnd = 999;

    this.MosCon = !this.MosCon;
  }


  //////////////////////////////////////////////////////////////////////////////////////////////


  EnvCon(){
    if (!this.servicios.ValCam("InpLogNom","Nombre","Texto",this.InpLogNom,"Si")){return}
    if (!this.servicios.ValCam("InpLogApe","Apellido","Texto",this.InpLogApe,"Si")){return}
    if (!this.servicios.ValCam("InpLogEma","Email","Email",this.InpLogEma,"Si")){return}
    if (!this.servicios.ValCam("InpLogMen","Mensaje","Texto",this.InpLogMen,"Si")){return}

    this.servicios.EnvNotEma("info@quedafacil.com","Nuevo contacto","El usuario "+this.InpLogNom+" "+this.InpLogApe+" con email "+this.InpLogEma+", escribio el siguiente mensaje: "+this.InpLogMen);
    this.servicios.AccSobBDAA("INSERT","No","Nombre,Email,Mensaje,FecHorReg","|"+this.InpLogNom+" "+this.InpLogApe+"|,|"+this.InpLogEma+"|,|"+this.InpLogMen+"|,NOW()","","contactos","","","",true).then((dataRes)=>{
      let Res: any = dataRes;
      console.log(Res);

      this.InpLogNom = "";
      this.InpLogApe = "";
      this.InpLogEma = "";
      this.InpLogMen = "";

      this.servicios.EnvMsgSim("¡El mensaje fue enviado!","Hecho");
      this.CerModCon.nativeElement.click();

    }).catch((err)=>{console.log(err)});
  }

}
