import { NrpService } from './../../services/nrp.service';
import { ProyectosService } from '@app/services/proyectos.service';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Permisos } from '@app/models/permisos';
import { Proyecto } from '@app/models/proyectos';
import { untilDestroyed } from '@app/core';
import { NrpChartComponent } from './nrp-chart/nrp-chart.component';
import { NrpBacklogComponent } from './nrp-backlog/nrp-backlog.component';

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

  @ViewChild('nrpChart', { static: false }) nrpChart: NrpChartComponent;
  @ViewChild('nrpBacklog', { static: false }) nrpBacklog: NrpBacklogComponent;

  loadingNRP: boolean = false;

  backlogList: nrpAlgorithmIndividual[] = [];

  constructor(private proyectosService: ProyectosService, private nrpService: NrpService) {}

  ngOnInit() {}

  actualizarGrafico() {
    this.nrpChart.actualizarGrafico(this.backlogList);
  }

  findNrp() {
    this.loadingNRP = true;
    this.proyectosService
      .getProyectoPbiPonderations(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.nrpService
          .calculateNrp(data)
          .pipe(untilDestroyed(this))
          .subscribe((result: nrpAlgorithmResult) => {
            this.loadingNRP = false;
            this.backlogList = result.population;
            this.actualizarGrafico();
          });
      });
  }

  ngOnDestroy(): void {}
}
