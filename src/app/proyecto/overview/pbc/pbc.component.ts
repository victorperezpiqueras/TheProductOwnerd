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
    /* if (this.ultimoSprint > this.proyecto.sprintActual) this.ultimoSprint = this.proyecto.sprintActual; */

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
      this.sprints.push(
        new Sprint(
          'Sprint ' +
            i /* + 1 */
              .toString(),
          i /* + 1 */,
          0,
          0,
          0,
          ''
        )
      );
      this.listaFeatures.push(
        new Sprint(
          'Sprint ' +
            i /* + 1 */
              .toString(),
          i /* + 1 */,
          0,
          0,
          0,
          ''
        )
      );
      this.listaInfrastructures.push(
        new Sprint(
          'Sprint ' +
            i /* + 1 */
              .toString(),
          i /* + 1 */,
          0,
          0,
          0,
          ''
        )
      );
      this.listaTechDebt.push(
        new Sprint(
          'Sprint ' +
            i /* + 1 */
              .toString(),
          i /* + 1 */,
          0,
          0,
          0,
          ''
        )
      );
      this.listaBugs.push(
        new Sprint(
          'Sprint ' +
            i /* + 1 */
              .toString(),
          i /* + 1 */,
          0,
          0,
          0,
          ''
        )
      );
      if (i === 0) {
        this.sprints[i].restante = this.puntosTotales;
        this.sprints[i].sprint = 'Start';
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
          if (pbi.sprint === i) {
            sumpbis += pbi.estimacion;

            if (pbi.label === 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label === 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label === 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label === 'bug') sumpbisBug += pbi.estimacion;
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
            if (pbi.label === 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label === 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label === 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label === 'bug') sumpbisBug += pbi.estimacion;
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
      if (i > 0) {
        this.listaScope[i] = {
          x: this.sprints[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.sprints[i].restante,
          quemado: this.sprints[i - 1].restante - this.sprints[i].restante
        };
        this.listaFeatures[i] = {
          x: this.listaFeatures[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaFeatures[i].restante,
          quemado: this.listaFeatures[i - 1].y - this.listaFeatures[i].restante
        };
        this.listaTechDebt[i] = {
          x: this.listaTechDebt[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaTechDebt[i].restante,
          quemado: this.listaTechDebt[i - 1].y - this.listaTechDebt[i].restante
        };
        this.listaInfrastructures[i] = {
          x: this.listaInfrastructures[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaInfrastructures[i].restante,
          quemado: this.listaInfrastructures[i - 1].y - this.listaInfrastructures[i].restante
        };
        this.listaBugs[i] = {
          x: this.listaBugs[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaBugs[i].restante,
          quemado: this.listaBugs[i - 1].y - this.listaBugs[i].restante
        };
      } else {
        this.listaScope[i] = {
          x: this.sprints[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.sprints[i].restante,
          quemado: '- '
        };
        this.listaFeatures[i] = {
          x: this.listaFeatures[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaFeatures[i].restante,
          quemado: '- '
        };
        this.listaTechDebt[i] = {
          x: this.listaTechDebt[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaTechDebt[i].restante,
          quemado: '- '
        };
        this.listaInfrastructures[i] = {
          x: this.listaInfrastructures[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaInfrastructures[i].restante,
          quemado: '- '
        };
        this.listaBugs[i] = {
          x: this.listaBugs[i].sprintNumber,
          xLabel: this.sprints[i].sprint,
          y: this.listaBugs[i].restante,
          quemado: '- '
        };
      }
    }
    console.log(this.listaFeatures);
    console.log(this.listaFeaturesSC);
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
        min: 0,
        max: this.proyecto.sprintActual,
        /*  startOnTick: true, */
        labels: {
          formatter: function() {
            return (this.value === 0 ? 'Start' : this.value).toString();
          }
        }
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
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>. (Burned: <b>{point.quemado}</b>)<br/>'
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
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>. (Burned: <b>{point.quemado}</b>)<br/>'
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
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>. (Burned: <b>{point.quemado}</b>)<br/>'
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
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>. (Burned: <b>{point.quemado}</b>)<br/>'
          }
        },
        {
          name: 'Scope Creep Features',
          data: this.listaFeaturesSC,
          type: 'column',
          pointWidth: 30,
          color: '#87ff85',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
          },
          visible: false
        },
        {
          name: 'Scope Creep Tech-debt',
          data: this.listaTechDebtSC,
          type: 'column',
          pointWidth: 30,
          color: '#ffda84',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
          },
          visible: false
        },
        {
          name: 'Scope Creep Infrastructure',
          data: this.listaInfrastructuresSC,
          type: 'column',
          pointWidth: 30,
          color: '#7cd1ff',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
          },
          visible: false
        },
        {
          name: 'Scope Creep Bugs',
          data: this.listaBugsSC,
          type: 'column',
          pointWidth: 30,
          color: '#ff8181',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
          },
          visible: false
        },
        {
          name: 'Scope',
          data: this.listaScope,
          type: 'line',
          color: '#4d4d4d',
          tooltip: {
            pointFormat:
              '____________________________________' +
              '<br><span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>. (Total Burned: <b>{point.quemado}</b>)<br/>'
          }
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
    this.chartOptions.tooltip.formatter = function() {
      var s: string = '';
      for (var i = 0; i < this.points.length; i++) {
        // puntos basicos:
        if (i < 4) {
          var point: any = this.points[i];
          s +=
            '<span style="color:' +
            this.points[i].color +
            '">●</span> ' +
            this.points[i].series.name +
            ': <b>' +
            this.points[i].y +
            '</b>. (Burned: <b>' +
            point.point.options.quemado +
            '</b>)<br/>';
        }
        // puntos scope creep:
        if (i >= 4 && i !== this.points.length - 1 && this.points.length > 4) {
          s +=
            '<span style="color:' +
            this.points[i].color +
            '">●</span> ' +
            this.points[i].series.name +
            ': <b>' +
            -this.points[i].y +
            '</b><br/>';
        }
        // scope:
        if (i === this.points.length - 1) {
          s =
            '<span style="color:' +
            this.points[i].color +
            '">●</span> ' +
            this.points[i].series.name +
            ': <b>' +
            this.points[i].y +
            '</b>. (Total Burned: <b>' +
            point.point.options.quemado +
            '</b>)<br/>' +
            s;
        }
      }

      if (this.x == 0) s = '<b>Start</b><br>' + s;
      else s = '<b>Sprint ' + this.x + '</b><br>' + s;

      return s;
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
