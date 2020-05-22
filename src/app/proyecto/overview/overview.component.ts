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
import { PbcComponent } from './pbc/pbc.component';
import { PocComponent } from './poc/poc.component';

interface Rol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  isLoading = false;
  @Input() proyecto: Proyecto;
  @Input() permisos: Permisos;

  @ViewChild('pbc', { static: false }) pbc: PbcComponent;
  @ViewChild('poc', { static: false }) poc: PocComponent;
  @ViewChild('bugs', { static: false }) bugs: PocComponent;

  pbis: Pbi[];

  /* --------------TEAM TABLE-------------- */
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  /*  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize; */

  dataTable: any;
  dialogRef: MatDialogRef<any>;
  displayedColumns: string[] = ['Name', 'Role'];
  dataSource: any[] = [];
  pageSizeOptions: number[];
  pageSize: number;

  /* --------------INVITE CARD-------------- */
  newEmail: string;
  roles: Rol[] = [
    { value: 'desarrollador', viewValue: 'Developer' },
    { value: 'productOwner', viewValue: 'Product Owner' },
    { value: 'stakeholder', viewValue: 'Stakeholder' }
  ];
  selectedRol = this.roles[0].value;

  dialogRefConfirm: MatDialogRef<any>;

  buttonDisabled: boolean = true;

  constructor(
    private credentialsService: CredentialsService,
    private proyectosService: ProyectosService,
    private usuariosService: UsuariosService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    // modificar la UI en función del rol para ajustarla a los cards
    if (this.permisos.mantenerUsuarios === 1) {
      this.displayedColumns = ['Actions', 'Name', 'Role'];
      this.pageSizeOptions = [5];
      this.pageSize = 5;
    } else {
      this.displayedColumns = ['Actions', 'Name', 'Role'];
      this.pageSizeOptions = [8];
      this.pageSize = 8;
    }
    this.activeRoute.params.subscribe(routeParams => {
      this.proyectosService
        .getProyecto(routeParams.id)
        .pipe(untilDestroyed(this))
        .subscribe(proyecto => {
          this.proyecto = proyecto;
          this.actualizar();
        });
    });
  }

  actualizar() {
    //console.log('actualizar');
    this.actualizarUsuarios();
    this.actualizarGraficos();
  }

  actualizarUsuarios() {
    this.proyectosService
      .getProyectoUsuariosRoles(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(usuarios => {
        this.proyecto.usuarios = usuarios;
        /* this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" }) */
        this.dataTable = new MatTableDataSource(this.proyecto.usuarios);
        this.dataTable.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  actualizarGraficos() {
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: []) => {
        this.pbis = pbis;
        this.pbc.actualizarGrafico(this.proyecto, this.pbis);
        this.poc.actualizarGrafico(this.proyecto, this.pbis);
        this.bugs.actualizarGrafico(this.proyecto, this.pbis);
      });
  }

  invitar() {
    this.isLoading = true;
    this.proyectosService
      .invitarUsuario(this.proyecto.idproyecto, {
        email: this.newEmail,
        rol: this.selectedRol,
        nombreProyecto: this.proyecto.nombre,
        invitadoPor: this.username
      })
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        // console.log(data);
        this.newEmail = '';
        if (data.existe) {
          this._snackBar.open('Member successfully added!', 'Close', { duration: 3000 });
          this.actualizarUsuarios();
        } else {
          this._snackBar.open(
            'This email does not have an account linked. An invitation has been sent instead!',
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      });
  }

  async eliminarUsuario(us: any) {
    const rol = formatRoles(us.rol);
    const usuario = await this.usuariosService.getUsuario(us.idusuario).toPromise();

    // console.log(usuario);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'User',
      dialogModeVerbo: 'kick out from the project',
      descripcion:
        '[' + rol + '] ' + usuario.nick + ' - ' + usuario.apellido1 + ' ' + usuario.apellido2 + ', ' + usuario.nombre,
      botonConfirm: 'Kick'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          // console.log(data);
          this.isLoading = true;
          this.proyectosService
            .eliminarUsuario(this.proyecto.idproyecto, us.idusuario)
            .pipe(untilDestroyed(this))
            .subscribe(res => {
              this.isLoading = false;
              this.actualizarUsuarios();
            });
        }
      });
  }

  actualizarProyecto() {
    this.isLoading = true;
    this.proyectosService
      .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        // console.log(this.proyecto);
        this.isLoading = false;
        this._snackBar.open('Vision edited successfully!', 'Close', { duration: 3000 });
      });
  }

  switchSaveButton() {
    if (this.buttonDisabled) this.buttonDisabled = false;
  }

  /* triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  } */

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
