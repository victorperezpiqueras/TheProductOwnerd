import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PbisService } from '@app/services/pbis-service';
import { TruncatePipeModule } from '@app/shared/truncatePipe/truncatePipe.module';
import { RegistroComponent } from './registro.component';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroService } from '@app/services/registro-service';
import { CredentialsService } from '@app/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    TruncatePipeModule,
    RegistroRoutingModule
  ],
  declarations: [RegistroComponent]
  /*  providers: [CredentialsService,RegistroService] */
})
export class RegistroModule {}
