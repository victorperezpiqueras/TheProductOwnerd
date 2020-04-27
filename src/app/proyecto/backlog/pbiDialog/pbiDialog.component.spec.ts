/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { PbiDialogComponent } from './pbiDialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Pbi } from '@app/models/pbis';

describe('PbiDialogComponent', () => {
    let component: PbiDialogComponent;
    let fixture: ComponentFixture<PbiDialogComponent>;
    let dialog: MatDialog;

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
            ],
            declarations: [PbiDialogComponent],
            providers: [MatDialogRef]
        }).compileComponents();
    }));

    beforeEach(() => {
        dialog = TestBed.get(MatDialog);

        fixture = TestBed.createComponent(PbiDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        const pbis: Pbi[] = [];
        const config:any = {
            pbi: new Pbi(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                4,
                null,
                1,
                1
            ),
            permisos: {
                mantenerUsuarios: 1,
                ordenar: 1,
                archivarProyecto: 1,
                setDone: 1,
                sprintGoals: 1,
                editarPBI: 1,
                estimarTam: 0,
                estimarValor: 1,
                proyecciones: 1
            },
            pbis: pbis,
            sprintActual: 1,
            dialogMode: 'create'
        }
        dialog.open(PbiDialogComponent, config);
        expect(component).toBeTruthy();
    });

});
 */
