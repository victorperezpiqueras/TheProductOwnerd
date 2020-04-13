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
import { MatTabChangeEvent, MatSnackBar } from '@angular/material';
import { BacklogComponent } from './backlog/backlog.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { SprintGoal } from '@app/models/sprintGoals';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { SprintGoalsService } from '@app/services/sprintgoals-service';

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
  sprintGoals: SprintGoal[];
  showingGoal: SprintGoal;
  sprintGoal: string;

  isFirstSprint: boolean;

  dialogRefConfirm: MatDialogRef<any>;

  buttonDisabled: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    private sprintGoalsService: SprintGoalsService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
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

        this.checkSprintZero();

        this.proyectosService.getProyectoUsuariosRoles(proyecto.idproyecto).subscribe(usuarios => {
          this.proyecto.usuarios = usuarios;
          this.usuariosService
            .getUsuarioProyectoPermisos(this.idusuario, this.proyecto.idproyecto)
            .subscribe((permisos: Permisos) => {
              this.permisos = permisos;
              //console.log(this.permisos);
            });

          this.proyectosService.getProyectoSprintGoals(this.proyecto.idproyecto).subscribe(sprintGoals => {
            this.sprintGoals = sprintGoals;
            this.updateSprintGoal();
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

  actualizarComponentes() {
    this.overview.proyecto = this.proyecto;
    this.backlog.proyecto = this.proyecto;
    this.forecasts.proyecto = this.proyecto;
  }

  checkSprintZero() {
    this.proyecto.sprintActual === 1 ? (this.isFirstSprint = true) : (this.isFirstSprint = false);
  }
  updateSprintGoal() {
    this.showingGoal = this.sprintGoals.find((goal: SprintGoal) => goal.sprintNumber === this.proyecto.sprintActual);
    if (!this.showingGoal) this.showingGoal = new SprintGoal(null, '', null);
  }

  nextSprint() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'Sprint',
      dialogModeVerbo: 'switch to',
      descripcion: 'Sprint ' + this.proyecto.sprintActual + ' -> Sprint ' + (this.proyecto.sprintActual + 1),
      botonConfirm: 'Switch to Next Sprint'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.isLoading = true;
        this.proyecto.sprintActual++;
        this.proyectosService.actualizarProyecto(this.proyecto.idproyecto, this.proyecto).subscribe(res => {
          this.updateSprintGoal();
          this.checkSprintZero();
          this.actualizarComponentes();
          this.buttonDisabled = true;
          this.isLoading = false;
        });
      }
    });
  }

  previousSprint() {
    if (!this.isFirstSprint) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.data = {
        dialogMode: 'Sprint',
        dialogModeVerbo: 'switch back to',
        descripcion: 'Sprint ' + this.proyecto.sprintActual + ' -> Sprint ' + (this.proyecto.sprintActual - 1),
        botonConfirm: 'Switch to Previous Sprint'
      };
      this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      this.dialogRefConfirm.afterClosed().subscribe(data => {
        if (data != undefined) {
          this.isLoading = true;
          this.proyecto.sprintActual--;
          this.proyectosService.actualizarProyecto(this.proyecto.idproyecto, this.proyecto).subscribe(res => {
            this.updateSprintGoal();
            this.checkSprintZero();
            this.actualizarComponentes();
            this.buttonDisabled = true;
            this.isLoading = false;
          });
        }
      });
    }
  }

  switchSaveButton() {
    if (this.buttonDisabled) this.buttonDisabled = false;
  }

  guardarSprintGoal() {
    this.isLoading = true;
    // si no existía -> POST crear sprint goal
    if (this.showingGoal.idproyecto === null) {
      this.showingGoal = new SprintGoal(this.proyecto.idproyecto, this.showingGoal.goal, this.proyecto.sprintActual);
      this.sprintGoalsService.crearSprintGoal(this.showingGoal).subscribe((data: any) => {
        this.isLoading = false;
        this.buttonDisabled = true;
        this._snackBar.open('Sprint Goal created successfully!', 'Close', { duration: 3000 });
      });
    } // si ya existía -> PUT actualizar sprint goal
    else {
      this.sprintGoalsService.actualizarSprintGoal(this.showingGoal).subscribe((data: any) => {
        this.isLoading = false;
        this.buttonDisabled = true;
        this._snackBar.open('Sprint Goal edited successfully!', 'Close', { duration: 3000 });
      });
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
