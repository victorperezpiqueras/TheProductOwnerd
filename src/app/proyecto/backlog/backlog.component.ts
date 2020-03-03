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
import { PbisService } from '@app/services/pbis-service';

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

  viewDone: boolean = false;
  itemListTitle: string = 'Product Backlog Items:';

  pbiTitle: string = 'Product Backlog Items:';
  pbiDoneTitle: string = 'Done Items:';

  pbis: Pbi[] = [];
  showingPbis: Pbi[] = [];

  searchword: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    private pbisService: PbisService,
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
          this.showingPbis = pbis;
          this.isLoading = false;
          console.log(pbis);
        });
      });
    });
    /* this.crearPbiDialog(); */
  }

  actualizarFiltro() {
    this.showingPbis = this.pbis.filter(pbi => {
      if (pbi.titulo.includes(this.searchword) || pbi.descripcion.includes(this.searchword)) return true;
    });
  }

  filtrarLabel(label: string) {
    this.showingPbis = this.pbis.filter(pbi => {
      if (pbi.label == label) return true;
    });
  }

  actualizarPbis() {
    this.isLoading = true;
    this.proyectosService.getProyectosPBIs(this.proyecto.idproyecto).subscribe((pbis: any) => {
      this.pbis = pbis;
      this.showingPbis = pbis;
      this.isLoading = false;
    });
  }

  crearPbiDialog() {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.height = '800px';
    dialogConfig.width = '1920px';
    dialogConfig.data = {
      pbi: new Pbi(null, null, null, null, null, null, this.pbis.length, this.proyecto.idproyecto),
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.addPbi(data.pbi);
        console.log(data);
      }
    });
  }

  editarPbiDialog(pbi: Pbi) {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.height = '800px';
    dialogConfig.width = '1920px';
    dialogConfig.data = {
      pbi: pbi,
      dialogMode: 'edit'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.editarPbi(data.pbi);
        console.log(data);
      }
    });
  }

  verPbiDialog(pbi: Pbi) {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.height = '800px';
    dialogConfig.width = '1920px';
    dialogConfig.data = {
      pbi: pbi,
      dialogMode: 'view'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
  }

  drop(event: any) {
    console.log('dropped');
  }

  swapItemList() {
    if (this.viewDone) {
      this.itemListTitle = this.pbiTitle;
    } else {
      this.itemListTitle = this.pbiDoneTitle;
    }
    this.viewDone = !this.viewDone;
  }

  addPbi(pbi: Pbi) {
    this.pbisService.crearPbi(pbi).subscribe((v: any) => {
      console.log(v);
      //this.pbis.push(pbi);///////////////////COMPROBAR
      this.actualizarPbis();
    });
  }

  editarPbi(pbi: Pbi) {
    this.pbisService.editarPbi(pbi).subscribe((v: any) => {
      console.log(v);
      /* var itemToUpdate = this.pbis.find((item) => item.idpbi == pbi.idpbi); //////////////////COMPROBAR
      var index = this.pbis.indexOf(itemToUpdate);
      this.pbis[index] = pbi; */
      this.actualizarPbis();
    });
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
