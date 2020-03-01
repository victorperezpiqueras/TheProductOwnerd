import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Project Burndown Chart'
    },
    series: [
      {
        data: [1, 2, 3],
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  };
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  state$: Observable<object>;
  state: Proyecto;

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
      console.log(routeParams);
      this.proyectosService.getProyecto(routeParams.id).subscribe(proyecto => {
        console.log(proyecto);
        this.proyecto = proyecto;
        this.proyectosService.getProyectoUsuariosRoles(proyecto.idproyecto).subscribe(usuarios => {
          this.proyecto.usuarios = usuarios;
          this.isLoading = false;
          console.log(proyecto);
        });
      });
    });
    /* this.proyectosService.getProyectoUsuariosRoles(this.proyecto.idproyecto).subscribe((usuarios) => {
      this.proyecto.usuarios = usuarios;
    }) */
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
