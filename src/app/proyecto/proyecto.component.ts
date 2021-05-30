import { Pbi } from '@app/models/pbis';
import { ReleasesService } from './../services/releases.service';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { Permisos } from '@app/models/permisos';
import { OverviewComponent } from './overview/overview.component';
import { MatTabChangeEvent, MatSnackBar, MatStepper, MatTabGroup } from '@angular/material';
import { BacklogComponent } from './backlog/backlog.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { SprintGoal } from '@app/models/sprintGoals';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { SprintGoalsService } from '@app/services/sprintgoals.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Release } from '@app/models/releases';
import { Input } from '@angular/core';
import { MyErrorStateMatcher } from '@app/shared/default.error-matcher';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { NrpSolverComponent } from './nrp-solver/nrp-solver.component';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class ProyectoComponent implements OnInit, OnDestroy {
  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;
  @ViewChild('overview', { static: false }) overview: OverviewComponent;
  @ViewChild('backlog', { static: false }) backlog: BacklogComponent;
  @ViewChild('forecasts', { static: false }) forecasts: ForecastsComponent;
  @ViewChild('nrpSolver', { static: false }) nrpSolver: NrpSolverComponent;

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

  @ViewChild('releasesStepper', { static: false }) private releasesStepper: MatStepper;
  releases: Release[];
  currentRelease: Release;
  currentReleaseSPs: number;
  labelRelease: string = 'Current release: ';
  matcher = new MyErrorStateMatcher();
  @Input() releaseForm: FormGroup = new FormGroup({
    version: new FormControl('', Validators.required),
    description: new FormControl(''),
    sprint: new FormControl('', Validators.required)
  });
  editingRelease: Release;

  isFirstSprint: boolean;
  isFirstSprintDeadline: boolean;

  dialogRefConfirm: MatDialogRef<any>;

  buttonDisabled: boolean = true;

  editProjectMode: boolean = false;

  tabIndex: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    private sprintGoalsService: SprintGoalsService,
    private releasesService: ReleasesService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher
  ) {
    /* this.scrollDispatcher.scrolled().subscribe(x => {console.log("scroll");this.myStepper.selectedIndex=0}); */
  }

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
                  this.actualizarSprintGoals();
                  this.actualizarReleases();
                  //this.actualizarComponentes();
                  this.isLoading = false;
                });
            });
        });
    });
  }

  onNotify(type: string) {
    if (type === 'releases') {
      this.actualizarReleases();
    } else if (type === 'sprintgoals') {
      this.actualizarSprintGoals();
    } else {
      this.actualizarReleases();
      this.actualizarSprintGoals();
    }
  }

  editarRelease() {
    this.isLoading = true;
    let release: Release = {
      idrelease: this.editingRelease.idrelease,
      sprint: this.releaseForm.get('sprint').value,
      descripcion: this.releaseForm.get('description').value,
      version: this.releaseForm.get('version').value,
      idproyecto: this.proyecto.idproyecto
    };
    // console.log(release)
    this.releasesService
      .editarRelease(release)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.isLoading = false;
        this._snackBar.open('Release updated successfully!', 'Close', { duration: 3000 });
        this.resetEditingRelease();
        this.actualizarReleases();
        this.actualizarComponentes();
      });
  }

  isEditingRelease(rel: Release): boolean {
    return rel === this.editingRelease;
  }

  setEditingRelease(rel: Release) {
    this.editingRelease = rel;
    this.releaseForm.get('sprint').setValue(this.editingRelease.sprint);
    this.releaseForm.get('version').setValue(this.editingRelease.version);
    this.releaseForm.get('description').setValue(this.editingRelease.descripcion);
  }

  resetEditingRelease() {
    this.editingRelease = null;
  }

  isCurrentRelease(rel: Release): boolean {
    return rel === this.currentRelease;
  }

  crearRelease() {
    this.isLoading = true;
    let release: Release = {
      idrelease: null,
      sprint: this.releaseForm.get('sprint').value,
      descripcion: this.releaseForm.get('description').value,
      version: this.releaseForm.get('version').value,
      idproyecto: this.proyecto.idproyecto
    };
    this.releasesService
      .crearRelease(release)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.isLoading = false;
        this._snackBar.open('Release created successfully!', 'Close', { duration: 3000 });
        this.reiniciarCampos();
        this.actualizarReleases();
        this.actualizarComponentes();
        this.releasesStepper.selectedIndex = 2;
      });
  }

  borrarRelease(rel: Release) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'Release',
      dialogModeVerbo: 'remove',
      descripcion: 'Release: ' + rel.version,
      botonConfirm: 'Remove release'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.isLoading = true;
          this.releasesService
            .borrarRelease(rel.idrelease)
            .pipe(untilDestroyed(this))
            .subscribe(res => {
              this.isLoading = false;
              this._snackBar.open('Release removed successfully!', 'Close', { duration: 3000 });
              this.actualizarReleases();
              this.actualizarComponentes();
            });
        }
      });
  }

  reiniciarCampos() {
    this.releaseForm.markAsPristine();
    this.releaseForm.reset();
    this.releaseForm.markAsPristine();
  }

  actualizarReleases() {
    this.isLoading = true;
    this.proyectosService
      .getProyectoReleases(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(releases => {
        this.releases = releases;
        this.findCurrentRelease();
        this.countCurrentReleaseSPs();
        this.actualizarComponentes();
        this.isLoading = false;
      });
  }

  countCurrentReleaseSPs() {
    this.isLoading = true;
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(pbis => {
        let sps: number = 0;
        pbis.forEach((pbi: Pbi) => {
          if (pbi.done === 0 && pbi.idrelease === this.currentRelease.idrelease) {
            sps += pbi.estimacion;
          }
        });
        this.currentReleaseSPs = sps;
        this.isLoading = false;
      });
  }

  findCurrentRelease() {
    this.releases = this.releases.sort((a: Release, b: Release) => {
      if (a.sprint > b.sprint) return 1;
      //< arriba las mas lejanas abajo las mas cercanas
      else return -1;
    });
    if (this.releases.length > 0) {
      let minSprint: number = Number.MAX_VALUE;
      let minRelease: Release;
      this.releases.forEach((rel: Release) => {
        if (rel.sprint < minSprint && rel.sprint >= this.proyecto.sprintActual) {
          minRelease = rel;
          minSprint = rel.sprint;
        }
      });
      // console.log(minRelease);
      this.currentRelease = minRelease;
      this.labelRelease = 'Current release: ' + this.currentRelease.version;
      this.overview.deadline = this.currentRelease.sprint;
    }
  }

  actualizarSprintGoals() {
    this.proyectosService
      .getProyectoSprintGoals(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(sprintGoals => {
        this.sprintGoals = sprintGoals;
        this.updateSprintGoal();
        //this.actualizarComponentes();
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
    //this.tabIndex = 0;
    this.changeDetectorRef.detectChanges();

    //this.actualizarReleases();
    // console.log('actualizar proyecto');
    this.overview.proyecto = this.proyecto;
    this.overview.permisos = this.permisos;
    this.overview.actualizar();

    this.backlog.proyecto = this.proyecto;
    this.backlog.permisos = this.permisos;
    this.backlog.actualizar();

    this.nrpSolver.proyecto = this.proyecto;
    this.nrpSolver.permisos = this.permisos;
    this.nrpSolver.releases = [...this.releases];
    this.nrpSolver.currentRelease = this.currentRelease;
    this.nrpSolver.actualizar();

    if (this.isProductOwner || this.isStakeholder) {
      this.forecasts.proyecto = this.proyecto;
      this.forecasts.permisos = this.permisos;
      this.forecasts.actualizar();
    }
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
              this.actualizarReleases();
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
                this.actualizarReleases();
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

  eventBacklogSavedParent() {
    this.tabGroup.selectedIndex = 1;
  }
}
