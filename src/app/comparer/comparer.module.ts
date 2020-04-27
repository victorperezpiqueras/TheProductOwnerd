import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { ComparerRoutingModule } from './comparer-routing.module';
import { ComparerComponent } from './comparer.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ProyectosService } from '@app/services/proyectos.service';
import { PbisService } from '@app/services/pbis.service';
import { VelocityComparerComponent } from './velocity-comparer/velocity-comparer.component';
import { CredentialsService } from '@app/core';
import { UsuariosService } from '@app/services/usuarios.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    HighchartsChartModule,
    ComparerRoutingModule
  ],
  declarations: [ComparerComponent, VelocityComparerComponent]
})
export class ComparerModule {}
