import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { untilDestroyed } from '@app/core';
import { ProyectosService } from './../../../services/proyectos.service';
import { nrpAlgorithmGen } from './../nrp-solver.component';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { nrpAlgorithmIndividual } from '../nrp-solver.component';
import { Permisos } from '@app/models/permisos';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { getLabelColor } from '@app/shared/labelColors';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PbisService } from '@app/services/pbis.service';
import { PbiDialogComponent } from '@app/proyecto/backlog/pbiDialog/pbiDialog.component';

interface stakeholderHappiness {
  stakeholderName: string;
  stakeholderHappiness: number;
  stakeholderMaxHappiness: number;
}

@Component({
  selector: 'app-nrp-backlog',
  templateUrl: './nrp-backlog.component.html',
  styleUrls: ['./nrp-backlog.component.scss']
})
export class NrpBacklogComponent implements OnInit, OnDestroy {
  isLoading = false;

  @Input() proyecto: Proyecto;
  @Input() permisos: Permisos;
  @Input() nrpUsed: boolean;
  @Output() eventBacklogSaved = new EventEmitter();

  pbis: Pbi[] = [];

  backlogProposal: nrpAlgorithmIndividual;

  backlog: Pbi[] = [];

  isDragging: boolean = false;

  dialogRef: MatDialogRef<any>;

  stakeholderHappinessList: stakeholderHappiness[] = [];

  constructor(
    private proyectosService: ProyectosService,
    private pbisService: PbisService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    //TESTING
    /*     this.proyectosService
          .getProyectoPBIs(this.proyecto.idproyecto)
          .pipe(untilDestroyed(this))
          .subscribe((pbis: Pbi[]) => {
            this.pbis = pbis.filter((pbi: Pbi) => pbi.done == 0);
            console.log(this.pbis);
            this.backlog = this.pbis;
          }); */
  }

  actualizarBacklog(backlogProposal: nrpAlgorithmIndividual, valoresStakeholders: any[]) {
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: Pbi[]) => {
        this.pbis = pbis.filter((pbi: Pbi) => pbi.done == 0);
        /* console.log(this.pbis);
        console.log(backlogProposal); */
        this.setBacklogProposal(backlogProposal);
        this.calculatePercentageBarStakeholders(backlogProposal, valoresStakeholders);
      });
  }

  setBacklogProposal(backlogProposal: nrpAlgorithmIndividual) {
    //console.log('child get');
    this.backlog = [];
    this.backlogProposal = backlogProposal;

    /*     console.log(this.backlogProposal.genes);
        console.log(this.pbis); */

    let prioridad: number = 0;
    let prioridadNoElegidos: number = 0;
    // contar cuantos pbis van a estar ordenados por delante de los no elegidos
    this.backlogProposal.genes.forEach((gen: nrpAlgorithmGen) => {
      if (gen.included == 1) prioridadNoElegidos++;
    });

    // buscamos para cada gen el pbi al que corresponde
    for (let i = 0; i < this.backlogProposal.genes.length; i++) {
      let pbi = this.pbis.find((pbi: Pbi) => pbi.idpbi === this.backlogProposal.genes[i].idpbi);
      if (pbi) {
        // si esta elegido, lo guardamos en el backlog con la prioridad que corresponda
        if (this.backlogProposal.genes[i].included == 1) {
          pbi.prioridad = prioridad;
          let npbi: any = pbi;
          npbi.included = 1;
          prioridad++;
          this.backlog.push(npbi);
        } // si no esta elegido, lo ponemos al final de los elegidos y seguimos con su contador
        else if (this.backlogProposal.genes[i].included == 0) {
          pbi.prioridad = prioridadNoElegidos;
          let npbi: any = pbi;
          npbi.included = 0;
          prioridadNoElegidos++;
          this.backlog.push(npbi);
        }
      }
    }
    this.backlog.sort((pbi1, pbi2) => {
      return pbi1.prioridad - pbi2.prioridad;
    });
    //console.log(this.backlog);
  }

  calculatePercentageBarStakeholders(backlogProposal: nrpAlgorithmIndividual, valoresStakeholders: any[]) {
    this.stakeholderHappinessList = [];
    this.proyectosService
      .getProyectoUsuariosRoles(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((roles: any) => {
        for (let rol of roles) {
          // para cada stakeholder
          if (rol.rol === 'stakeholder') {
            let valorMax: number = 0;
            let valorReal: number = 0;
            // para cada una de las valoraciones
            for (let valor of valoresStakeholders) {
              // si es suya => calcular el valor maximo
              if (rol.idrol === valor.idrol) {
                valorMax += valor.valor;
                // calcular valor real si en el backlog proposal esta incluido el pbi valorado
                backlogProposal.genes.forEach((gen: nrpAlgorithmGen) => {
                  if (gen.idpbi === valor.idpbi && gen.included == 1) {
                    valorReal += valor.valor;
                  }
                });
              }
            }
            this.stakeholderHappinessList.push({
              stakeholderName: rol.nick,
              stakeholderMaxHappiness: valorMax,
              stakeholderHappiness: valorReal
            });
          }
        }
        console.log(this.stakeholderHappinessList);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.backlog, event.previousIndex, event.currentIndex);
    var auxPrioridad = this.backlog[event.previousIndex].prioridad;
    this.backlog[event.previousIndex].prioridad = this.backlog[event.currentIndex].prioridad;
    this.backlog[event.currentIndex].prioridad = auxPrioridad;
    this.recalcularPrioridad();
  }

  recalcularPrioridad() {
    for (var x = 0; x < this.backlog.length; x++) {
      this.backlog[x].prioridad = x + 1;
    }
    /*  this.pbisService
      .editarPrioridadesPbis(this.backlog)
      .pipe(untilDestroyed(this))
      .subscribe(pbis => {
        console.log(pbis);
      }); */
  }

  getLabelColor(label: string) {
    return getLabelColor(label);
  }

  getPbiIncluded(pbi: any) {
    return pbi.included == 1;
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
        /* if (data != undefined) {
          data.pbi.prioridad = this.showingPbis.length + 1;
          this.editarPbi(data.pbi);
        } */
      });
  }

  setBacklog() {
    this.isLoading = true;
    //console.log(this.backlog);
    let formatedBacklog = [...this.backlog];
    formatedBacklog.forEach((npbi: any) => {
      let newPbi = Object.assign({}, npbi);
      delete newPbi.included;
      //console.log(newPbi);
    });
    this.pbisService
      .editarPrioridadesPbis(formatedBacklog)
      .pipe(untilDestroyed(this))
      .subscribe(pbis => {
        //console.log(pbis);
        this._snackBar.open('Backlog changed successfully!', 'Close', {
          duration: 4000 //miliseconds
        });
        this.eventBacklogSaved.emit();
        this.backlog = [];
        this.isLoading = false;
      });
  }

  get isBacklogEmpty(): boolean {
    return this.backlog.length === 0;
  }

  percentageHappiness(data: stakeholderHappiness): number {
    return (data.stakeholderHappiness / data.stakeholderMaxHappiness) * 100;
  }

  getPercentageColorStyle(stakeholderHappiness: stakeholderHappiness) {
    let val = this.percentageHappiness(stakeholderHappiness);
    if (val > 75) {
      return '#00dd00';
    } else if (val > 50) {
      return '#ffd800';
    } else if (val > 25) {
      return '#ff7800';
    } else {
      return '#ff5050';
    }
  }

  ngOnDestroy(): void {}
}
