import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniComponent } from './ini/ini.component';
import { RecconComponent } from './reccon/reccon.component';
import { AdmComponent } from './adm/adm.component';

const routes: Routes = [
  // {path: "", component: IniComponent},
  {path: "", component: AdmComponent},
  {path: "page/:NomPag", component: IniComponent},
  {path: "reccon/:NRegSer", component: RecconComponent},
  {path: "adm", component: AdmComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
