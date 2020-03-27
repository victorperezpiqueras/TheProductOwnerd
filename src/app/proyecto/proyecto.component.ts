import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

import * as Highcharts from 'highcharts';
import { Permisos } from '@app/models/permisos';
import { Pbi } from '@app/models/pbis';
import { OverviewComponent } from './overview/overview.component';
import { MatTabChangeEvent } from '@angular/material';
import { BacklogComponent } from './backlog/backlog.component';
import { ForecastsComponent } from './forecasts/forecasts.component';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit, OnDestroy {
  @ViewChild('overview', { static: false }) overview: OverviewComponent;
  @ViewChild('backlog', { static: false }) backlog: BacklogComponent;
  @ViewChild('forecasts', { static: false }) forecasts: ForecastsComponent;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  state$: Observable<object>;
  state: Proyecto;

  proyecto: Proyecto;
  permisos: Permisos;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    //this.proyecto = this.proyectosService.proyecto;
    /* console.log(this.router.url.split('/')[2])
    this.proyectosService.getProyecto(Number(this.router.url.split('/')[2]))
      .subscribe((proyecto)=>{
        this.proyecto=proyecto;
      }) */
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      this.proyectosService.getProyecto(routeParams.id).subscribe(proyecto => {
        this.proyecto = proyecto;
        this.proyectosService.getProyectoUsuariosRoles(proyecto.idproyecto).subscribe(usuarios => {
          this.proyecto.usuarios = usuarios;
          this.usuariosService
            .getUsuarioProyectoPermisos(this.idusuario, this.proyecto.idproyecto)
            .subscribe((permisos: Permisos) => {
              this.permisos = permisos;
              //console.log(this.permisos);
            });
          this.isLoading = false;
        });
      });
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index == 0) {
      console.log('cargarpadre');
      this.overview.actualizar();
    } else if (event.index == 1) {
      this.backlog.actualizar();
    } else if (event.index == 2) {
      this.forecasts.actualizar();
    }
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
