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
import { HighchartsChartModule } from 'highcharts-angular';
import { VelocityComponent } from './velocity/velocity.component';
import { PolynomialRegressionComponent } from './polynomial-regression/polynomial-regression.component';
import { ForecastsComponent } from './forecasts.component';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';

describe('ForecastsComponent', () => {
  let component: ForecastsComponent;
  let fixture: ComponentFixture<ForecastsComponent>;

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
        HighchartsChartModule
      ],
      declarations: [ForecastsComponent, VelocityComponent, LinearRegressionComponent, PolynomialRegressionComponent],
      providers: [AuthenticationService, CredentialsService, UsuariosService, ProyectosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
