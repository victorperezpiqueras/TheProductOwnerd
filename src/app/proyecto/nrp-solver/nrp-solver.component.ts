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
import { Release } from '@app/models/releases';
import { isNull } from '@angular/compiler/src/output/output_ast';

export interface nrpAlgorithmResult {
  hv: number;
  population: nrpAlgorithmIndividual[];
  spread: number;
  time: number;
  warning: boolean;
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
  @Input() releases: Release[];
  @Input() currentRelease: Release;

  @Output() eventBacklogSavedParent = new EventEmitter();

  @ViewChild('nrpChart', { static: false }) nrpChart: NrpChartComponent;
  @ViewChild('nrpBacklog', { static: false }) nrpBacklog: NrpBacklogComponent;

  loadingNRP: boolean = false;
  loadingFrase: string;

  backlogList: nrpAlgorithmIndividual[] = [];

  nrpUsed: boolean = false;

  valoresStakeholders: any[] = [];

  searchTypeButtonLabelOptions: string[] = ['All Backlog PBIs', 'Current release PBIs', 'Other release PBIs'];
  searchTypeButtonLabel: string = this.searchTypeButtonLabelOptions[0];
  selectedRelease: Release;

  searchOptionsHelpMessages: string[] = [
    'The advisor will find a set of backlog proposals taking into account all the backlog PBIs',
    'The advisor will find a set of backlog proposals taking into account ONLY the PBIs assigned to the current release',
    'The advisor will find a set of backlog proposals taking into account ONLY the PBIs assigned to the specified future release. As these releases are futuristics, the <Set Backlog> option will be disabled'
  ];

  warning: boolean = false;

  constructor(
    private proyectosService: ProyectosService,
    private nrpService: NrpService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadingFrase = generarFraseLoading();
  }

  actualizar() {
    this.prepareReleaseList();
  }

  actualizarBacklog() {
    this.nrpBacklog.warning = this.warning;
  }

  actualizarGrafico() {
    this.nrpChart.actualizarGrafico(this.backlogList);
  }

  findNrp() {
    if (this.searchTypeButtonLabel === this.searchTypeButtonLabelOptions[0]) {
      this.findNrpAllBacklog();
    } else if (
      this.searchTypeButtonLabel ===
      this.searchTypeButtonLabelOptions[1] + ' ' + this.currentRelease.version
    ) {
      this.findNrpRelease(this.currentRelease, true);
    } else {
      this.findNrpRelease(this.selectedRelease, false);
    }
  }

  findNrpRelease(release: Release, allowSetBacklog: boolean) {
    this.loadingNRP = true;
    this.nrpUsed = false;
    if (allowSetBacklog) {
      this.nrpBacklog.setBacklogMode('release', release.idrelease);
    } else {
      this.nrpBacklog.setBacklogMode('otherRelease', release.idrelease);
    }
    //this.nrpBacklog.releaseMode = release.idrelease;
    this.nrpBacklog.resetBacklog();
    //this.nrpBacklog.allowSetBacklog = allowSetBacklog;
    this.proyectosService
      .getProyectoPbiPonderationsRelease(this.proyecto.idproyecto, release.idrelease)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        //console.log(data)
        this.showData(data);
      });
  }

  findNrpAllBacklog() {
    this.loadingNRP = true;
    this.nrpUsed = false;
    //this.nrpBacklog.releaseMode = null;
    this.nrpBacklog.setBacklogMode('all', null);
    this.nrpBacklog.resetBacklog();
    //this.nrpBacklog.allowSetBacklog = true;
    this.proyectosService
      .getProyectoPbiPonderations(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.showData(data);
      });
  }

  showData(data: any) {
    if (data.pbis.length <= 0) {
      this._snackBar.open('There are no PBIs assigned to this release', 'Close', {
        duration: 4000 //miliseconds
      });
      this.loadingNRP = false;
    } else {
      //console.log(this.warning)
      this.valoresStakeholders = data.valores;
      this.actualizarBacklog();
      this.nrpService
        .calculateNrp(data)
        .pipe(untilDestroyed(this))
        .subscribe((result: nrpAlgorithmResult) => {
          this.loadingNRP = false;
          this.nrpUsed = true;
          this.loadingFrase = generarFraseLoading();
          this.backlogList = result.population;
          this.warning = result.warning;
          this.actualizarGrafico();
          this.actualizarBacklog();
          this._snackBar.open('Release Proposals generated successfully!', 'Close', {
            duration: 4000 //miliseconds
          });
        });
    }
  }

  eventProposalSelected(backlogSelected: nrpAlgorithmIndividual) {
    //console.log('parent get');
    this.nrpBacklog.actualizarBacklog(backlogSelected, this.valoresStakeholders);
  }

  eventBacklogSaved() {
    this.nrpUsed = false;
    this.eventBacklogSavedParent.emit();
  }

  setSearchType(type: string, release?: Release) {
    this.searchTypeButtonLabel = type;
    console.log(this.searchTypeButtonLabel);
    if (release) this.selectedRelease = release;
    //console.log(release)
  }

  prepareReleaseList() {
    for (let rel of this.releases) {
      if (rel.idrelease === this.currentRelease.idrelease) {
        const index: number = this.releases.indexOf(rel);
        if (index !== -1) {
          this.releases.splice(index, 1);
        }
        break;
      }
    }
    this.releases.sort((a, b) => (a.sprint > b.sprint ? 1 : -1));
  }

  /*   findNoEstimatedPBIs(pbiList: Pbi[]) {
      let found: boolean = false;
      for (let pbi of pbiList) {
        if (!pbi.estimacion) {
          found = true;
          break;
        }
      }
      return found;
    } */

  ngOnDestroy(): void {}
}
