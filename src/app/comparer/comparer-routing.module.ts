import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ComparerComponent } from './comparer.component';

const routes: Routes = [{ path: '', component: ComparerComponent, data: { title: extract('Comparer') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ComparerRoutingModule {}
