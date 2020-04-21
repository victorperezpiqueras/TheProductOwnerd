import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ProyectosComponent } from './proyectos.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    {
      path: 'projects',
      component: ProyectosComponent,
      data: { title: extract('Home') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProyectosRoutingModule {}
