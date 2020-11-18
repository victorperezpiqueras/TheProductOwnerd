import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Pbi } from '@app/models/pbis';

import { PbiDialogComponent } from './pbiDialog/pbiDialog.component';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PbisService } from '@app/services/pbis.service';
import { Permisos } from '@app/models/permisos';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit, OnDestroy {
  @Input() proyecto: Proyecto;
  @Input() permisos: Permisos;

  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;

  viewDone: boolean = false;
  itemListTitle: string = 'Product Backlog Items:';

  pbiTitle: string = 'Product Backlog Items:';
  pbiDoneTitle: string = 'Done Items:';

  pbis: Pbi[] = [];
  showingPbis: Pbi[] = [];
  showingDonePbis: Pbi[] = [];

  searchword: string;
  botonLabel: string = 'Filter by Label';
  botonLabelColor: string = '#2196F3';

  botonOrder: string = 'default';
  priorityOn: boolean = true;

  isDragging: boolean = false;

  /*   orderValueMode: boolean = false; */

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
    this.actualizar();
  }

  actualizar() {
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      // console.log(routeParams);
      this.proyectosService
        .getProyecto(routeParams.id)
        .pipe(untilDestroyed(this))
        .subscribe(proyecto => {
          //console.log(proyecto);
          this.proyecto = proyecto;
          this.proyectosService
            .getProyectoPBIs(proyecto.idproyecto)
            .pipe(untilDestroyed(this))
            .subscribe((pbis: []) => {
              this.pbis = pbis;
              this.showingPbis = pbis.filter((pbi: any) => pbi.done == 0);
              this.showingPbis.sort((pbi1, pbi2) => {
                return pbi1.prioridad - pbi2.prioridad;
              });

              this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
              this.usuariosService
                .getUsuarioProyectoPermisos(this.idusuario, this.proyecto.idproyecto)
                .pipe(untilDestroyed(this))
                .subscribe((permisos: Permisos) => {
                  this.permisos = permisos;
                  console.log('Permisos', this.permisos);
                  this.isLoading = false;
                });
            });
        });
    });
  }

  actualizarFiltro() {
    if (this.searchword === '') {
      this.clearSearch();
    } else {
      this.botonLabel = 'Filter by Label';
      this.botonLabelColor = this.getLabelButtonColor();
      this.priorityOn = false;
    }

    this.showingPbis = this.pbis.filter(pbi => {
      if (
        pbi.titulo.toLowerCase().includes(this.searchword.toLowerCase()) ||
        (pbi.descripcion && pbi.descripcion.toLowerCase().includes(this.searchword.toLowerCase()) && pbi.done == 0)
      )
        return true;
    });
    this.showingPbis.sort((pbi1, pbi2) => {
      return pbi1.prioridad - pbi2.prioridad;
    });
    this.showingDonePbis = this.pbis.filter(pbi => {
      if (
        pbi.titulo.toLowerCase().includes(this.searchword.toLowerCase()) ||
        (pbi.descripcion && pbi.descripcion.toLowerCase().includes(this.searchword.toLowerCase()) && pbi.done == 1)
      )
        return true;
    });
  }

  /* ordenarValor() {
    this.filtrarLabel('none');
    this.showingPbis = this.pbis.filter((pbi: any) => pbi.done == 0);
    this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
    if (!this.orderValueMode) {
      this.showingPbis.sort((pbi1, pbi2) => {
        return pbi2.valor - pbi1.valor;
      });
      this.showingDonePbis.sort((pbi1, pbi2) => {
        return pbi2.valor - pbi1.valor;
      });
    } else {
      this.showingPbis.sort((pbi1, pbi2) => {
        return pbi1.valor - pbi2.valor;
      });
      this.showingDonePbis.sort((pbi1, pbi2) => {
        return pbi1.valor - pbi2.valor;
      });
    }
    this.orderValueMode = !this.orderValueMode;
  } */

  orderBy(modo: string) {
    this.botonOrder = modo;
    if (modo === 'priority') {
      this.priorityOn = true;
      this.showingPbis.sort((pbi1, pbi2) => {
        return pbi1.prioridad - pbi2.prioridad;
      });
    } else if (modo === 'valueup') {
      this.priorityOn = false;
      this.showingPbis.sort((pbi1, pbi2) => {
        return pbi2.valor - pbi1.valor;
      });
      this.showingDonePbis.sort((pbi1, pbi2) => {
        return pbi2.valor - pbi1.valor;
      });
    } else if (modo === 'valuedown') {
      this.priorityOn = false;
      this.showingPbis.sort((pbi1, pbi2) => {
        return pbi1.valor - pbi2.valor;
      });
      this.showingDonePbis.sort((pbi1, pbi2) => {
        return pbi1.valor - pbi2.valor;
      });
    }
  }

  filtrarLabel(label: string) {
    this.priorityOn = false;
    if (label == 'none') {
      this.botonLabel = 'Filter by Label';
      //this.showingPbis = this.pbis;
      this.showingPbis = this.pbis.filter((pbi: any) => pbi.done == 0);
      /*  this.showingPbis.sort((pbi1, pbi2) => {
         return pbi1.prioridad - pbi2.prioridad;
       }); */
      this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
    } else {
      this.botonLabel = label.charAt(0).toUpperCase() + label.substring(1);
      this.showingPbis = this.pbis.filter(pbi => {
        if (pbi.label === label && pbi.done === 0) return true;
      });
      this.showingDonePbis = this.pbis.filter(pbi => {
        if (pbi.label === label && pbi.done === 1) return true;
      });
    }
    this.botonLabelColor = this.getLabelButtonColor();
  }

  clearSearch() {
    this.priorityOn = true;
    this.botonOrder = 'default';
    this.searchword = '';
    this.botonLabel = 'Filter by Label';
    this.botonLabelColor = this.getLabelButtonColor();
    this.showingPbis = this.pbis.filter((pbi: any) => pbi.done == 0);
    this.showingPbis.sort((pbi1, pbi2) => {
      return pbi1.prioridad - pbi2.prioridad;
    });
    this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
  }

  getLabelButtonColor() {
    if (this.botonLabel == 'Filter by Label') {
      if (this.viewDone) return '#FF4081';
      else return '#2196F3';
    } else if (this.botonLabel == 'Feature') return '#00ad17';
    else if (this.botonLabel == 'Tech-debt') return '#ffbb00';
    else if (this.botonLabel == 'Bug') return '#ad0000';
    else if (this.botonLabel == 'Infrastructure') return '#2196f3';
  }

  getLabelColor(label: string) {
    if (label == 'feature') return '#00ad17';
    else if (label == 'tech-debt') return '#ffbb00';
    else if (label == 'bug') return '#ad0000';
    else if (label == 'infrastructure') return '#2196f3';
  }

  actualizarPbis() {
    this.isLoading = true;
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: any) => {
        this.pbis = pbis;
        // this.showingPbis = pbis;
        this.showingPbis = this.pbis.filter((pbi: any) => pbi.done == 0);
        this.showingPbis.sort((pbi1, pbi2) => {
          return pbi1.prioridad - pbi2.prioridad;
        });
        this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
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
      pbi: new Pbi(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.pbis.length,
        null,
        this.proyecto.idproyecto,
        this.proyecto.sprintActual
      ),
      permisos: this.permisos,
      pbis: this.pbis,
      sprintActual: this.proyecto.sprintActual,
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.addPbi(data.pbi);
          // console.log(data);
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
      permisos: this.permisos,
      pbis: this.pbis,
      sprintActual: this.proyecto.sprintActual,
      dialogMode: 'edit'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.editarPbi(data.pbi);
          //console.log(data);
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
      permisos: this.permisos,
      pbis: this.pbis,
      sprintActual: this.proyecto.sprintActual,
      dialogMode: 'view'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          data.pbi.prioridad = this.showingPbis.length + 1;
          this.editarPbi(data.pbi);
          //console.log(data);
        }
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log(this.showingPbis);
    if (!this.viewDone) {
      moveItemInArray(this.showingPbis, event.previousIndex, event.currentIndex);
      /* console.log(this.showingPbis)
      console.log("drop")
      console.log(this.showingPbis[event.previousIndex])
      console.log(this.showingPbis[event.currentIndex]) */
      var auxPrioridad = this.showingPbis[event.previousIndex].prioridad;
      this.showingPbis[event.previousIndex].prioridad = this.showingPbis[event.currentIndex].prioridad;
      this.showingPbis[event.currentIndex].prioridad = auxPrioridad;
      /* console.log("drop2")
      console.log(this.showingPbis[event.previousIndex])
      console.log(this.showingPbis[event.currentIndex]) */
    }
    this.recalcularPrioridad();
    /*     else {
          moveItemInArray(this.showingDonePbis, event.previousIndex, event.currentIndex);
          console.log("drop")
          console.log(this.showingDonePbis[event.previousIndex])
          console.log(this.showingDonePbis[event.currentIndex])
          var auxPrioridad = this.showingDonePbis[event.previousIndex].prioridad;
          this.showingDonePbis[event.previousIndex].prioridad = this.showingDonePbis[event.currentIndex].prioridad;
          this.showingDonePbis[event.currentIndex].prioridad = auxPrioridad;
          console.log("drop2")
          console.log(this.showingDonePbis[event.previousIndex])
          console.log(this.showingDonePbis[event.currentIndex])
        } */

    //this.showingPbis = this.pbis;
  }

  recalcularPrioridad() {
    for (var x = 0; x < this.showingPbis.length; x++) {
      this.showingPbis[x].prioridad = x + 1;
    }
    this.pbisService
      .editarPrioridadesPbis(this.showingPbis)
      .pipe(untilDestroyed(this))
      .subscribe(pbis => {
        //console.log(pbis);
      });
  }

  swapItemList() {
    if (this.viewDone) {
      this.itemListTitle = this.pbiTitle;
      this.botonLabelColor = '#2196F3';
    } else {
      this.itemListTitle = this.pbiDoneTitle;
      this.botonLabelColor = '#FF4081';
    }
    this.viewDone = !this.viewDone;
  }

  addPbi(pbi: Pbi) {
    this.pbisService
      .crearPbi(pbi)
      .pipe(untilDestroyed(this))
      .subscribe((v: any) => {
        //console.log(v);
        //this.pbis.push(pbi);///////////////////COMPROBAR
        this.actualizarPbis();
      });
  }

  editarPbi(pbi: Pbi) {
    // console.log(pbi);
    this.pbisService
      .editarPbi(pbi)
      .pipe(untilDestroyed(this))
      .subscribe((v: any) => {
        //console.log(v);
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
