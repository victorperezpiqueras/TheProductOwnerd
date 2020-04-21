import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([{ path: 'about', loadChildren: './about/about.module#AboutModule' }]),

  Shell.childRoutes([{ path: 'account', loadChildren: './cuenta/cuenta.module#CuentaModule' }]),
  Shell.childRoutes([{ path: 'projects/:id', loadChildren: './proyecto/proyecto.module#ProyectoModule' }]),

  // Fallback when no prior route is matched --> projects
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
