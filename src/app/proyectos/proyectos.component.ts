import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProyectoDialogComponent } from './proyectoDialog/proyectoDialog.component';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit, OnDestroy {
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  proyecto: Proyecto;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.actualizarDatos();
  }

  crearProyectoDialog(): void {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    /* dialogConfig.height = '400px';
    dialogConfig.width = '600px'; */
    dialogConfig.data = {
      proyecto: new Proyecto(null, null, null, null, 0, null),
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(ProyectoDialogComponent, dialogConfig);
    this.dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) this.addProyecto(data.proyecto);
      });
  }

  addProyecto(proyecto: Proyecto) {
    var data = {
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      idusuario: this.idusuario
    };
    this.proyectosService
      .crearProyecto(data)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.actualizarDatos();
      });
  }

  actualizarDatos() {
    this.isLoading = true;
    this.proyectos = [];
    var proyectos$ = this.usuariosService.getUsuarioProyectos(this.idusuario).pipe(untilDestroyed(this));
    var usuariosTotales$ = this.proyectosService.getProyectosUsuariosRoles().pipe(untilDestroyed(this));

    forkJoin([proyectos$, usuariosTotales$])
      .pipe(untilDestroyed(this))
      .subscribe(results => {
        results[0].forEach((element: any) => {
          var pr = new Proyecto(element.idproyecto, element.nombre, element.descripcion, element.vision, 0, []);
          this.proyectos.push(pr);
        });

        for (var proy of this.proyectos) {
          for (var user of results[1]) {
            if (user.idproyecto == proy.idproyecto) {
              proy.usuarios.push(user);
              console.log(user);
            }
          }
        }
        this.isLoading = false;
      });
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }

  ngOnDestroy() {
    if (this.proyecto) this.proyectosService.proyecto = this.proyecto;
  }
  proyectoSeleccionado(proyecto: Proyecto) {
    this.proyecto = proyecto;
  }
}
