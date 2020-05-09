import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Proyecto } from '@app/models/proyectos';
import { Permisos } from '@app/models/permisos';
import { Grafico } from '@app/proyecto/grafico.interface';
import { formatDataNumberStandardToFixed1 } from '@app/shared/formatDataNumber';

@Component({
  selector: 'app-pbc',
  templateUrl: './pbc.component.html',
  styleUrls: ['./pbc.component.scss']
})
export class PbcComponent implements Grafico, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag: boolean = false;

  // datos principales
  proyecto: Proyecto;
  pbis: Pbi[];

  // datos derivados
  listaScope: any[] = [];
  listaFeatures: any[] = [];
  listaInfrastructures: any[] = [];
  listaTechDebt: any[] = [];
  listaBugs: any[] = [];

  listaFeaturesSC: any[] = [];
  listaInfrastructuresSC: any[] = [];
  listaTechDebtSC: any[] = [];
  listaBugsSC: any[] = [];

  sprints: Sprint[] = [];

  puntosTotales: number;

  puntosTotalesFeature: number;
  puntosTotalesTechDebt: number;
  puntosTotalesInfrastructure: number;
  puntosTotalesBug: number;

  showScopeCreep: boolean = false;

  ultimoSprint: number;

  averageThroughput: number = 0;
  averageVelocity: number = 0;

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(proyecto: Proyecto, pbis: Pbi[]) {
    this.proyecto = proyecto;
    this.pbis = pbis;
    this.showScopeCreep = false;
    this.generarDatos();
    this.generarGrafico();
    this.calcularMedias();
  }

  generarDatos() {
    // inicializar:
    this.sprints = [];
    this.listaScope = [];
    this.listaFeatures = [];
    this.listaTechDebt = [];
    this.listaInfrastructures = [];
    this.listaBugs = [];

    this.listaFeaturesSC = [];
    this.listaTechDebtSC = [];
    this.listaInfrastructuresSC = [];
    this.listaBugsSC = [];

    /* this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    }); */
    this.ultimoSprint = this.proyecto.sprintActual;

    // no debería verse los sprints por el sprint ultimo sino por el del proyecto
    if (this.ultimoSprint > this.proyecto.sprintActual) this.ultimoSprint = this.proyecto.sprintActual;

    // generar suma pbis:
    this.puntosTotales = 0;
    this.pbis.forEach((pbi: Pbi) => {
      this.puntosTotales += pbi.estimacion;
    });

    // generar suma pbis:
    this.puntosTotalesFeature = 0;
    this.puntosTotalesTechDebt = 0;
    this.puntosTotalesInfrastructure = 0;
    this.puntosTotalesBug = 0;

    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.label == 'feature') this.puntosTotalesFeature += pbi.estimacion;
      else if (pbi.label == 'tech-debt') this.puntosTotalesTechDebt += pbi.estimacion;
      else if (pbi.label == 'infrastructure') this.puntosTotalesInfrastructure += pbi.estimacion;
      else if (pbi.label == 'bug') this.puntosTotalesBug += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.sprints.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaFeatures.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaInfrastructures.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaTechDebt.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaBugs.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      if (i === 0) {
        this.sprints[i].restante = this.puntosTotales;

        this.listaFeatures[i].restante = this.puntosTotalesFeature;
        this.listaTechDebt[i].restante = this.puntosTotalesTechDebt;
        this.listaInfrastructures[i].restante = this.puntosTotalesInfrastructure;
        this.listaBugs[i].restante = this.puntosTotalesBug;

        this.listaFeaturesSC[i] = [this.listaFeatures[i].sprint, undefined];
        this.listaTechDebtSC[i] = [this.listaFeatures[i].sprint, undefined];
        this.listaInfrastructuresSC[i] = [this.listaFeatures[i].sprint, undefined];
        this.listaBugsSC[i] = [this.listaFeatures[i].sprint, undefined];
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbis = 0;

        var sumpbisFeatures = 0;
        var sumpbisTechDebt = 0;
        var sumpbisInfrastructure = 0;
        var sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) {
            sumpbis += pbi.estimacion;

            if (pbi.label == 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label == 'bug') sumpbisBug += pbi.estimacion;
          }
        });
        // restar al total anterior las del sprint:
        this.sprints[i].restante = this.sprints[i - 1].restante - sumpbis;
        this.sprints[i].quemado = sumpbis;

        this.listaFeatures[i].restante = this.listaFeatures[i - 1].restante - sumpbisFeatures;
        this.listaTechDebt[i].restante = this.listaTechDebt[i - 1].restante - sumpbisTechDebt;
        this.listaInfrastructures[i].restante = this.listaInfrastructures[i - 1].restante - sumpbisInfrastructure;
        this.listaBugs[i].restante = this.listaBugs[i - 1].restante - sumpbisBug;

        // sumar datos de Scope Creep:
        sumpbisFeatures = 0;
        sumpbisTechDebt = 0;
        sumpbisInfrastructure = 0;
        sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprintCreacion == i) {
            if (pbi.label == 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label == 'bug') sumpbisBug += pbi.estimacion;
          }
        });
        if (sumpbisFeatures === 0) sumpbisFeatures = undefined;
        if (sumpbisTechDebt === 0) sumpbisTechDebt = undefined;
        if (sumpbisInfrastructure === 0) sumpbisInfrastructure = undefined;
        if (sumpbisBug === 0) sumpbisBug = undefined;
        this.listaFeaturesSC[i] = [this.listaFeatures[i].sprint, -Math.abs(sumpbisFeatures)];
        this.listaTechDebtSC[i] = [this.listaFeatures[i].sprint, -Math.abs(sumpbisTechDebt)];
        this.listaInfrastructuresSC[i] = [this.listaFeatures[i].sprint, -Math.abs(sumpbisInfrastructure)];
        this.listaBugsSC[i] = [this.listaFeatures[i].sprint, -Math.abs(sumpbisBug)];
      }
    }

    /* for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaScope[i] = [this.sprints[i].sprint, this.sprints[i].restante];

      this.listaFeatures[i] = [this.listaFeatures[i].sprint, this.listaFeatures[i].restante];
      this.listaTechDebt[i] = [this.listaTechDebt[i].sprint, this.listaTechDebt[i].restante];
      this.listaInfrastructures[i] = [this.listaInfrastructures[i].sprint, this.listaInfrastructures[i].restante];
      this.listaBugs[i] = [this.listaBugs[i].sprint, this.listaBugs[i].restante];
    } */

    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaScope[i] = [this.sprints[i].sprintNumber, this.sprints[i].restante];

      this.listaFeatures[i] = [this.listaFeatures[i].sprintNumber, this.listaFeatures[i].restante];
      this.listaTechDebt[i] = [this.listaTechDebt[i].sprintNumber, this.listaTechDebt[i].restante];
      this.listaInfrastructures[i] = [this.listaInfrastructures[i].sprintNumber, this.listaInfrastructures[i].restante];
      this.listaBugs[i] = [this.listaBugs[i].sprintNumber, this.listaBugs[i].restante];
    }
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '<b>Sprint {point.x}</b><br>',
        shared: true
      },
      xAxis: {
        title: {
          text: 'Sprints',
          style: {
            fontSize: '16px'
          }
        },
        allowDecimals: false,
        tickInterval: 1,
        min: 1,
        max: this.proyecto.sprintActual + 1
        /*  startOnTick: true */
      },
      yAxis: {
        title: {
          text: 'Story Points',
          style: {
            fontSize: '16px'
          }
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
          }
        },
        allowDecimals: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'Features',
          data: this.listaFeatures,
          type: 'column',
          pointWidth: 30,
          color: '#00ad17',
          dataLabels: {
            enabled: false
          }
          /*  tooltip: {
             headerFormat: null,
             pointFormatter: function () {
               return 'Features: <b>' + this.y.toFixed(0) + '</b><br/>Remaining Story Points: ';
             }
           } */
        },
        {
          name: 'Tech-debt',
          data: this.listaTechDebt,
          type: 'column',
          pointWidth: 30,
          color: '#ffbb00',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Infrastructure',
          data: this.listaInfrastructures,
          type: 'column',
          pointWidth: 30,
          color: '#2196f3',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Bugs',
          data: this.listaBugs,
          type: 'column',
          pointWidth: 30,
          color: '#ad0000',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Scope Creep Features',
          data: this.listaFeaturesSC,
          type: 'column',
          pointWidth: 30,
          color: '#c1ffc0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Tech-debt',
          data: this.listaTechDebtSC,
          type: 'column',
          pointWidth: 30,
          color: '#ffecc0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Infrastructure',
          data: this.listaInfrastructuresSC,
          type: 'column',
          pointWidth: 30,
          color: '#c0e9ff',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Bugs',
          data: this.listaBugsSC,
          type: 'column',
          pointWidth: 30,
          color: '#ffc0c0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Line',
          data: this.listaScope,
          type: 'line',
          color: '#4d4d4d'
        }
      ],
      navigation: {
        buttonOptions: {
          align: 'left'
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        filename: 'project_burndown_chart',
        sourceHeight: 550,
        sourceWidth: 1100
      }
    };
  }

  showSC() {
    this.chartOptions.series[4].visible = this.showScopeCreep;
    this.chartOptions.series[5].visible = this.showScopeCreep;
    this.chartOptions.series[6].visible = this.showScopeCreep;
    this.chartOptions.series[7].visible = this.showScopeCreep;
    this.updateFlag = true;
  }

  calcularMedias() {
    this.averageThroughput = 0;
    this.averageVelocity = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.done) {
        this.averageThroughput++;
        this.averageVelocity += pbi.estimacion;
      }
    });
    // ultimo sprint debe estar calculado
    this.averageThroughput /= this.ultimoSprint;
    this.averageVelocity /= this.ultimoSprint;
  }

  formatDataNumber(data: number): string {
    return formatDataNumberStandardToFixed1(data);
  }

  ngOnDestroy() {}
}
