import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { RegistroComponent } from './registro.component';
import { LoginComponent } from '@app/login/login.component';

const routes: Routes = [
  { path: 'registro', component: RegistroComponent, data: { title: extract('Register') } },
  { path: 'registro/invitacion/:id', component: RegistroComponent, data: { title: extract('Invitation') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RegistroRoutingModule {}
