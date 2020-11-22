import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { Permisos } from '@app/models/permisos';
import { OverviewComponent } from './overview/overview.component';
import { MatTabChangeEvent, MatSnackBar } from '@angular/material';
import { BacklogComponent } from './backlog/backlog.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { SprintGoal } from '@app/models/sprintGoals';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { SprintGoalsService } from '@app/services/sprintgoals.service';

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
  isFirstSprintDeadline: boolean;

  dialogRefConfirm: MatDialogRef<any>;

  buttonDisabled: boolean = true;

  editProjectMode: boolean = false;

  tabIndex: number = 0;

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
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tabIndex = 0;
    this.activeRoute.params.pipe(untilDestroyed(this)).subscribe(routeParams => {
      this.proyectosService
        .getProyecto(routeParams.id)
        .pipe(untilDestroyed(this))
        .subscribe(proyecto => {
          this.proyecto = proyecto;

          this.checkSprintZero();

          this.proyectosService
            .getProyectoUsuariosRoles(proyecto.idproyecto)
            .pipe(untilDestroyed(this))
            .subscribe(usuarios => {
              this.proyecto.usuarios = usuarios;
              this.usuariosService
                .getUsuarioProyectoPermisos(this.idusuario, this.proyecto.idproyecto)
                .pipe(untilDestroyed(this))
                .subscribe((permisos: Permisos) => {
                  this.permisos = permisos;
                  this.isLoading = false;
                });
              this.actualizarSprintGoals();
            });
        });
    });
  }

  actualizarSprintGoals() {
    this.proyectosService
      .getProyectoSprintGoals(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(sprintGoals => {
        this.sprintGoals = sprintGoals;
        this.updateSprintGoal();
        this.actualizarComponentes();
        this.isLoading = false;
      });
  }

  onTabChanged(event: MatTabChangeEvent) {
    // console.log("onTabChanged")
    if (event.index == 0) {
      this.overview.actualizar();
    } else if (event.index == 1) {
      this.backlog.actualizar();
    } else if (event.index == 2) {
      this.forecasts.actualizar();
    }
  }

  actualizarComponentes() {
    this.tabIndex = 0;
    this.changeDetectorRef.detectChanges();
    // console.log('actualizar proyecto');
    this.overview.proyecto = this.proyecto;
    this.backlog.proyecto = this.proyecto;
    this.forecasts.proyecto = this.proyecto;
    this.overview.actualizar();
    this.backlog.actualizar();
    this.forecasts.actualizar();
  }

  editMode() {
    this.editProjectMode = !this.editProjectMode;
  }
  guardarProyecto() {
    this.isLoading = true;
    this.proyectosService
      .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.isLoading = false;
        this.editMode();
        this._snackBar.open('Project edited successfully!', 'Close', { duration: 3000 });
      });
  }

  checkSprintZero() {
    this.proyecto.sprintActual === 1 ? (this.isFirstSprint = true) : (this.isFirstSprint = false);
    this.proyecto.deadline <= this.proyecto.sprintActual
      ? (this.isFirstSprintDeadline = true)
      : (this.isFirstSprintDeadline = false);
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
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.isLoading = true;
          this.proyecto.sprintActual++;
          if (this.proyecto.deadline < this.proyecto.sprintActual) this.proyecto.deadline++;
          this.proyectosService
            .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
            .pipe(untilDestroyed(this))
            .subscribe(res => {
              this.actualizarSprintGoals();
              //this.updateSprintGoal();
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
      this.dialogRefConfirm
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(data => {
          if (data != undefined) {
            this.isLoading = true;
            this.proyecto.sprintActual--;
            this.proyectosService
              .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
              .pipe(untilDestroyed(this))
              .subscribe(res => {
                this.actualizarSprintGoals();
                //this.updateSprintGoal();
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
      this.sprintGoalsService
        .crearSprintGoal(this.showingGoal)
        .pipe(untilDestroyed(this))
        .subscribe((data: any) => {
          this.isLoading = false;
          this.buttonDisabled = true;
          this._snackBar.open('Sprint Goal created successfully!', 'Close', { duration: 3000 });
        });
    } // si ya existía -> PUT actualizar sprint goal
    else {
      this.sprintGoalsService
        .actualizarSprintGoal(this.showingGoal)
        .pipe(untilDestroyed(this))
        .subscribe((data: any) => {
          this.isLoading = false;
          this.buttonDisabled = true;
          this._snackBar.open('Sprint Goal edited successfully!', 'Close', { duration: 3000 });
          this.actualizarComponentes();
        });
    }
  }

  previousDeadline() {
    if (!this.isFirstSprintDeadline) {
      /* const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.data = {
        dialogMode: 'Deadline',
        dialogModeVerbo: 'shorten deadline to',
        descripcion: 'Deadline Sprint ' + this.proyecto.deadline + ' -> Deadline Sprint ' + (this.proyecto.deadline - 1),
        botonConfirm: 'Shorten Deadline'
      };
      this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      this.dialogRefConfirm
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(data => {
          if (data != undefined) { */
      this.isLoading = true;
      this.proyecto.deadline--;
      this.proyectosService
        .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.checkSprintZero();
          this.actualizarComponentes();
          this.isLoading = false;
          this._snackBar.open('Deadline changed successfully!', 'Close', { duration: 3000 });
        });
      /*    }
       }); */
    }
  }

  nextDeadline() {
    /* const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'Deadline',
      dialogModeVerbo: 'delay to',
      descripcion: 'Deadline Sprint ' + this.proyecto.deadline + ' -> Deadline Sprint ' + (this.proyecto.deadline + 1),
      botonConfirm: 'Delay Deadline'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) { */
    this.isLoading = true;
    this.proyecto.deadline++;
    this.proyectosService
      .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.checkSprintZero();
        this.actualizarComponentes();
        this.isLoading = false;
        this._snackBar.open('Deadline changed successfully!', 'Close', { duration: 3000 });
      });
    /*   }
      }); */
  }

  get isStakeholder(): boolean {
    return this.permisos.rol === 'stakeholder';
  }

  get isProductOwner(): boolean {
    return this.permisos.rol === 'productOwner';
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
