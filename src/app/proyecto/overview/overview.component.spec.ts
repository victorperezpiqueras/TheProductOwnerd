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
import { OverviewComponent } from './overview.component';
import { PocComponent } from './poc/poc.component';
import { PbcComponent } from './pbc/pbc.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { BugsComponent } from './bugs/bugs.component';
import { ImportanciasService } from '@app/services/importancias.service';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

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
      declarations: [OverviewComponent, PocComponent, PbcComponent, BugsComponent],
      providers: [AuthenticationService, CredentialsService, UsuariosService, ProyectosService, ImportanciasService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    //PO
    component.permisos = {
      idrol: 1,
      rol: 'productOwner',
      mantenerUsuarios: 1,
      ordenar: 1,
      archivarProyecto: 1,
      setDone: 1,
      sprintGoals: 1,
      editarPBI: 1,
      estimarTam: 0,
      estimarValor: 1,
      proyecciones: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show kick users column for PO', () => {
    expect(component.displayedColumns).toEqual(['Name', 'Role', 'Importance', 'Actions']);
    expect(component.pageSizeOptions).toEqual([5]);
    expect(component.pageSize).toEqual(5);
  });
});
