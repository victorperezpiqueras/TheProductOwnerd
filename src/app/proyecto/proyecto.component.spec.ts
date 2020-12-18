import { ReleasesService } from './../services/releases.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule, AuthenticationService, CredentialsService } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { UsuariosService } from '@app/services/usuarios.service';
import { ProyectosService } from '@app/services/proyectos.service';
import { ProyectoComponent } from './proyecto.component';
import { ProyectosComponent } from '@app/proyectos/proyectos.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { BacklogComponent } from './backlog/backlog.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { OverviewComponent } from './overview/overview.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TruncatePipeModule } from '@app/shared/truncatePipe/truncatePipe.module';
import { VelocityComponent } from './forecasts/velocity/velocity.component';
import { LinearRegressionComponent } from './forecasts/linear-regression/linear-regression.component';
import { PolynomialRegressionComponent } from './forecasts/polynomial-regression/polynomial-regression.component';
import { PbcComponent } from './overview/pbc/pbc.component';
import { PocComponent } from './overview/poc/poc.component';
import { SprintGoalsService } from '@app/services/sprintgoals.service';
import { BugsComponent } from './overview/bugs/bugs.component';

describe('ProyectoComponent', () => {
  let component: ProyectoComponent;
  let fixture: ComponentFixture<ProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CoreModule,
        DragDropModule,
        TruncatePipeModule,
        HighchartsChartModule
      ],
      declarations: [
        ProyectoComponent,
        BacklogComponent,
        ForecastsComponent,
        VelocityComponent,
        LinearRegressionComponent,
        PolynomialRegressionComponent,
        OverviewComponent,
        PbcComponent,
        PocComponent,
        BugsComponent
      ],
      providers: [
        AuthenticationService,
        CredentialsService,
        UsuariosService,
        ProyectosService,
        SprintGoalsService,
        ReleasesService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
