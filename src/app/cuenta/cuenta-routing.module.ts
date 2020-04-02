import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { CuentaComponent } from './cuenta.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'cuenta', component: CuentaComponent, data: { title: extract('Account') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CuentaRoutingModule {}
