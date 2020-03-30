/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule, AuthenticationService, CredentialsService } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { UsuariosService } from '@app/services/usuarios-service';
import { ProyectosService } from '@app/services/proyectos-service';
import { ProyectoComponent } from './proyecto.component';
import { ProyectosComponent } from '@app/proyectos/proyectos.component';
import { HighchartsChartModule } from 'highcharts-angular';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CoreModule,
        HighchartsChartModule
      ],
      declarations: [RegistroComponent],
      providers: [AuthenticationService, CredentialsService, UsuariosService, ProyectosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */
