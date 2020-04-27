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
import { PbiDialogComponent } from './pbiDialog/pbiDialog.component';
import { PbisService } from '@app/services/pbis.service';
import { BacklogComponent } from './backlog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TruncatePipe } from '@app/shared/truncatePipe/truncatePipe';

describe('BacklogComponent', () => {
  let component: BacklogComponent;
  let fixture: ComponentFixture<BacklogComponent>;

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
        DragDropModule
      ],
      declarations: [BacklogComponent, PbiDialogComponent, TruncatePipe],
      providers: [AuthenticationService, CredentialsService, UsuariosService, ProyectosService, PbisService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
