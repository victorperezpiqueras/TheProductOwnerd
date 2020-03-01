import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { ProyectoRoutingModule } from './proyecto-routing.module';
import { ProyectoComponent } from './proyecto.component';

import { HighchartsChartModule } from 'highcharts-angular';
import { OverviewComponent } from './overview/overview.component';
import { BacklogComponent } from './backlog/backlog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    DragDropModule,
    HighchartsChartModule,
    ProyectoRoutingModule
  ],
  declarations: [ProyectoComponent, OverviewComponent, BacklogComponent]
})
export class ProyectoModule {}
