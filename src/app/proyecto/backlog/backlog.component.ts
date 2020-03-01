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
import { Pbi } from '@app/models/pbis';

import { PbiDialogComponent } from './pbiDialog/pbiDialog.component';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;

  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;

  pbis: Pbi[];

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
        this.proyectosService.getProyectosPBIs(proyecto.idproyecto).subscribe((pbis: any) => {
          this.pbis = pbis;
          this.isLoading = false;
          console.log(pbis);
        });
      });
    });
  }

  crearPbiDialog() {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '800px';
    dialogConfig.width = '1920px';
    dialogConfig.data = {
      proyecto: new Proyecto(null, null, null, null),
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(data => {
      // if (data != undefined) this.addProyecto(data.proyecto);
    });
  }

  editarPbiDialog(pbi: Pbi) {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '800px';
    dialogConfig.width = '1920px';
    dialogConfig.data = {
      proyecto: new Proyecto(null, null, null, null),
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(data => {
      // if (data != undefined) this.addProyecto(data.proyecto);
    });
  }

  drop(event: any) {
    console.log('dropped');
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
