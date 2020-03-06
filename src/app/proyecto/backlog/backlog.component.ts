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
  showingDonePbis: Pbi[] = [];

  searchword: string;
  botonLabel: string = 'Filter by Label';
  botonLabelColor: string = '#2196F3';

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
      // console.log(routeParams);
      this.proyectosService.getProyecto(routeParams.id).subscribe(proyecto => {
        //console.log(proyecto);
        this.proyecto = proyecto;
        this.proyectosService.getProyectosPBIs(proyecto.idproyecto).subscribe((pbis: []) => {
          this.pbis = pbis;
          this.showingPbis = pbis.filter((pbi: any) => pbi.done == 0);
          this.showingPbis.sort((pbi1, pbi2) => {
            return pbi1.prioridad - pbi2.prioridad;
          });

          this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
          //this.showingDonePbis.sort((pbi1, pbi2) => { return pbi1.prioridad - pbi2.prioridad; })

          this.isLoading = false;
          // console.log(this.showingPbis);
        });
      });
    });
    /* this.crearPbiDialog(); */
  }

  actualizarFiltro() {
    this.showingPbis = this.pbis.filter(pbi => {
      if (pbi.titulo.includes(this.searchword) || (pbi.descripcion.includes(this.searchword) && pbi.done == 0))
        return true;
    });
    this.showingDonePbis = this.pbis.filter(pbi => {
      if (pbi.titulo.includes(this.searchword) || (pbi.descripcion.includes(this.searchword) && pbi.done == 1))
        return true;
    });
  }

  filtrarLabel(label: string) {
    if (label == 'none') {
      this.botonLabel = 'Filter by Label';
      //this.showingPbis = this.pbis;
      this.showingPbis = this.pbis.filter((pbi: any) => pbi.done == 0);
      this.showingDonePbis = this.pbis.filter((pbi: any) => pbi.done == 1);
    } else {
      this.botonLabel = label.charAt(0).toUpperCase() + label.substring(1);
      this.showingPbis = this.pbis.filter(pbi => {
        if (pbi.label == label && pbi.done == 0) return true;
      });
      this.showingDonePbis = this.pbis.filter(pbi => {
        if (pbi.label == label && pbi.done == 1) return true;
      });
    }
    this.botonLabelColor = this.getLabelButtonColor();
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

  actualizarPbis() {
    this.isLoading = true;
    this.proyectosService.getProyectosPBIs(this.proyecto.idproyecto).subscribe((pbis: any) => {
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
      pbi: new Pbi(null, null, null, null, null, null, this.pbis.length, this.proyecto.idproyecto),
      dialogMode: 'create'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.addPbi(data.pbi);
        //console.log(data);
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
      dialogMode: 'view'
    };
    this.dialogRef = this.dialog.open(PbiDialogComponent, dialogConfig);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.showingPbis);
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
    this.pbisService.editarPrioridadesPbis(this.showingPbis).subscribe(pbis => {
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
    this.pbisService.crearPbi(pbi).subscribe((v: any) => {
      //console.log(v);
      //this.pbis.push(pbi);///////////////////COMPROBAR
      this.actualizarPbis();
    });
  }

  editarPbi(pbi: Pbi) {
    this.pbisService.editarPbi(pbi).subscribe((v: any) => {
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
