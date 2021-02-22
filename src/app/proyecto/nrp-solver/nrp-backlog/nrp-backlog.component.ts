import { untilDestroyed } from '@app/core';
import { ProyectosService } from './../../../services/proyectos.service';
import { nrpAlgorithmGen } from './../nrp-solver.component';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { nrpAlgorithmIndividual } from '../nrp-solver.component';
import { Permisos } from '@app/models/permisos';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { getLabelColor } from '@app/shared/labelColors';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PbisService } from '@app/services/pbis.service';

@Component({
  selector: 'app-nrp-backlog',
  templateUrl: './nrp-backlog.component.html',
  styleUrls: ['./nrp-backlog.component.scss']
})
export class NrpBacklogComponent implements OnInit, OnDestroy {
  @Input() proyecto: Proyecto;
  @Input() permisos: Permisos;

  pbis: Pbi[] = [];

  backlogProposal: nrpAlgorithmIndividual;

  backlog: Pbi[] = [];

  isDragging: boolean = false;

  constructor(private proyectosService: ProyectosService, private pbisService: PbisService) {}

  ngOnInit() {
    //TESTING
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: Pbi[]) => {
        this.pbis = pbis.filter((pbi: Pbi) => pbi.done == 0);
        console.log(this.pbis);
        this.backlog = this.pbis;
      });
  }

  actualizarBacklog(backlogProposal: nrpAlgorithmIndividual) {
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: Pbi[]) => {
        this.pbis = pbis.filter((pbi: Pbi) => pbi.done == 0);
        console.log(this.pbis);
        console.log(backlogProposal);
        this.setBacklogProposal(backlogProposal);
      });
  }

  setBacklogProposal(backlogProposal: nrpAlgorithmIndividual) {
    console.log('child get');
    this.backlog = [];
    this.backlogProposal = backlogProposal;

    console.log(this.backlogProposal.genes);
    console.log(this.pbis);

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
          prioridad++;
          this.backlog.push(pbi);
        } // si no esta elegido, lo ponemos al final de los elegidos y seguimos con su contador
        else if (this.backlogProposal.genes[i].included == 0) {
          pbi.prioridad = prioridadNoElegidos;
          prioridadNoElegidos++;
          this.backlog.push(pbi);
        }
      }
    }
    console.log(this.backlog);
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

  ngOnDestroy(): void {}
}
