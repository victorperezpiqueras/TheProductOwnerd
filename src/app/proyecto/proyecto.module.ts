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
import { PbisService } from '@app/services/pbis.service';
import { TruncatePipeModule } from '@app/shared/truncatePipe/truncatePipe.module';
import { ComentariosService } from '@app/services/comentarios.service';
import { ArchivosService } from '@app/services/archivos.service';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { PbcComponent } from './overview/pbc/pbc.component';
import { PocComponent } from './overview/poc/poc.component';
import { VelocityComponent } from './forecasts/velocity/velocity.component';
import { LinearRegressionComponent } from './forecasts/linear-regression/linear-regression.component';
import { PolynomialRegressionComponent } from './forecasts/polynomial-regression/polynomial-regression.component';
import { BugsComponent } from './overview/bugs/bugs.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NrpSolverComponent } from './nrp-solver/nrp-solver.component';
import { NrpChartComponent } from './nrp-solver/nrp-chart/nrp-chart.component';
import { NrpBacklogComponent } from './nrp-solver/nrp-backlog/nrp-backlog.component';

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
    TruncatePipeModule,
    HighchartsChartModule,
    ProyectoRoutingModule
  ],
  declarations: [
    ProyectoComponent,
    OverviewComponent,
    PbcComponent,
    PocComponent,
    BugsComponent,
    BacklogComponent,
    ForecastsComponent,
    VelocityComponent,
    LinearRegressionComponent,
    PolynomialRegressionComponent,
    NrpSolverComponent,
    NrpChartComponent,
    NrpBacklogComponent
  ],
  providers: [PbisService, ComentariosService, ArchivosService]
})
export class ProyectoModule {}
