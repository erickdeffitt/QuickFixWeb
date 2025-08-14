import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicios } from '../../servicios/servicios';


@Component({
  selector: 'app-reccon',
  templateUrl: './reccon.component.html',
  styleUrl: './reccon.component.scss'
})
export class RecconComponent {
  CTT: string = "";
  NRegSer: string = "";

  passw: string = "";
  passwre: string = "";

  constructor(
    public router: Router,
    public routeAct: ActivatedRoute,
    public servicios: Servicios
  ) {
    this.CTT = this.routeAct.snapshot.paramMap.get("NRegSer");
    //console.log("***"+this.CTT+"***");
    this.CTT = this.CTT.substr(27,(this.CTT.length-74));
    //console.log("***"+this.CTT+"***");
    this.NRegSer = this.CTT;
  }

  ngOnInit() {
  }

  RecCon(){
    if (this.passw == ""){this.servicios.EnvMsgSim("La contraseña no puede estar en blanco","Advertencia"); return;}
    if (this.passw.length < 6){this.servicios.EnvMsgSim("La contraseña debe tener al menos 6 caracteres","Advertencia"); return;}
    if (this.passw != this.passwre){this.servicios.EnvMsgSim("Las contraseñas deben ser iguales","Advertencia"); return;}
    this.servicios.EnvMsgSim("Procesando ...","Informacion");
    this.servicios.AccSobBDAA("UPDATE","No","","","Password=|"+this.passw+"|","usuarios","WHERE NRegistro="+this.NRegSer,"","",false).then((dataRes)=>{
      let Res: any = dataRes;
      //console.log(Res);
      this.servicios.EnvMsgSim("La contraseña fue actualizada","Hecho");
      this.router.navigate([""]);
    }).catch((err)=>{console.log(err)});
  }
}