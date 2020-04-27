import { Component, OnInit, OnDestroy, Input, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map, takeUntil, take } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Permisos } from '@app/models/permisos';
import { MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { Usuario } from '@app/models/usuarios';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { formatRoles } from '@app/shared/helperRoles';
import { VelocityComparerComponent } from './velocity-comparer/velocity-comparer.component';
import { ProyectoData } from './proyectoData.interface';

@Component({
  selector: 'app-comparer',
  templateUrl: './comparer.component.html',
  styleUrls: ['./comparer.component.scss']
})
export class ComparerComponent implements OnInit, OnDestroy {
  isLoading = false;

  proyectos: ProyectoData[] = [];

  @ViewChild('velocityComparer', { static: false }) velocityComparer: VelocityComparerComponent;

  constructor(
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    console.log(this.credentialsService.credentials);
    this.usuariosService
      .getUsuarioProyectos(this.idusuario)
      .pipe(untilDestroyed(this))
      .subscribe(proyectos => {
        console.log(proyectos);
        var proyAux: ProyectoData[] = [];
        // cargar los proyectos:
        proyectos.forEach((proyecto: any) => {
          let proyectoData: ProyectoData = { proyecto: proyecto, pbis: [], sprints: [], series: [] };
          proyAux.push(proyectoData);
        });
        var observables: any[] = [];
        // para cada proyecto cargar sus pbis:
        proyAux.forEach((proyectoData: ProyectoData) => {
          observables.push(this.proyectosService.getProyectosPBI(proyectoData.proyecto.idproyecto));
        });
        // buscar cada lista de pbis y enlazar con el proyecto correspondiente:
        forkJoin(observables)
          .pipe(untilDestroyed(this))
          .subscribe((proyectoPbis: []) => {
            proyectoPbis.forEach((pbis: Pbi[]) => {
              if (pbis[0]) {
                let proyectoData = proyAux.find((pr: ProyectoData) => pr.proyecto.idproyecto === pbis[0].idproyecto);
                if (proyectoData) {
                  proyectoData.pbis = pbis;
                  this.proyectos.push(proyectoData);
                }
              }
            });
            this.actualizarGraficos();
            this.isLoading = false;
          });
      });
  }

  actualizarGraficos() {
    this.velocityComparer.actualizarGrafico(this.proyectos);
  }

  ngOnDestroy() {}

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
