import { NrpService } from './../../services/nrp.service';
import { ProyectosService } from '@app/services/proyectos.service';
import { Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output } from '@angular/core';
import { Permisos } from '@app/models/permisos';
import { Proyecto } from '@app/models/proyectos';
import { untilDestroyed } from '@app/core';
import { NrpChartComponent } from './nrp-chart/nrp-chart.component';
import { NrpBacklogComponent } from './nrp-backlog/nrp-backlog.component';
import { generarFraseLoading } from '@app/shared/generadorFrasesLoading';
import { MatSnackBar } from '@angular/material';
import { Pbi } from '@app/models/pbis';

export interface nrpAlgorithmResult {
  hv: number;
  population: nrpAlgorithmIndividual[];
  spread: number;
  time: number;
}

export interface nrpAlgorithmIndividual {
  cost: number;
  score: number;
  total_score: number;
  crowding_distance: number;
  domination_count: number;
  rank: number;
  objectives: [];
  dominated_solutions: [];
  genes: nrpAlgorithmGen[];
}

export interface nrpAlgorithmGen {
  estimation: number;
  value: number;
  idpbi: number;
  included: number;
}

@Component({
  selector: 'app-nrp-solver',
  templateUrl: './nrp-solver.component.html',
  styleUrls: ['./nrp-solver.component.scss']
})
export class NrpSolverComponent implements OnInit, OnDestroy {
  isLoading = false;
  @Input() proyecto: Proyecto;
  @Input() permisos: Permisos;
  @Output() eventBacklogSavedParent = new EventEmitter();

  @ViewChild('nrpChart', { static: false }) nrpChart: NrpChartComponent;
  @ViewChild('nrpBacklog', { static: false }) nrpBacklog: NrpBacklogComponent;

  loadingNRP: boolean = false;
  loadingFrase: string;

  backlogList: nrpAlgorithmIndividual[] = [];

  nrpUsed: boolean = false;

  valoresStakeholders: any[] = [];

  constructor(
    private proyectosService: ProyectosService,
    private nrpService: NrpService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadingFrase = generarFraseLoading();
  }

  actualizarGrafico() {
    this.nrpChart.actualizarGrafico(this.backlogList);
  }

  findNrp() {
    this.loadingNRP = true;
    this.proyectosService
      .getProyectoPbiPonderations(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.valoresStakeholders = data.valores;
        this.nrpService
          .calculateNrp(data)
          .pipe(untilDestroyed(this))
          .subscribe((result: nrpAlgorithmResult) => {
            this.loadingNRP = false;
            this.nrpUsed = true;
            this.loadingFrase = generarFraseLoading();
            this.backlogList = result.population;
            this.actualizarGrafico();
            this._snackBar.open('Release Proposals generated successfully!', 'Close', {
              duration: 4000 //miliseconds
            });
            // dejar marcada una propuesta del medio del grafico
            /* let intermedio: number = (Number)((this.backlogList.length / 2).toFixed());
            this.eventProposalSelected(this.backlogList[intermedio]); */
          });
      });
  }

  eventProposalSelected(backlogSelected: nrpAlgorithmIndividual) {
    //console.log('parent get');
    this.nrpBacklog.actualizarBacklog(backlogSelected, this.valoresStakeholders);
  }

  eventBacklogSaved() {
    this.nrpUsed = false;
    this.eventBacklogSavedParent.emit();
  }

  ngOnDestroy(): void {}
}
