import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ProyectoComponent } from './proyecto.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'proyectos/:id', component: ProyectoComponent, data: { title: extract('Proyectos') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProyectoRoutingModule {}
