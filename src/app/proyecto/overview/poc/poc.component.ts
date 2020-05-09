import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Proyecto } from '@app/models/proyectos';
import { Grafico } from '@app/proyecto/grafico.interface';
import { formatDataNumberStandardToFixed1 } from '@app/shared/formatDataNumber';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.scss']
})
export class PocComponent implements Grafico, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  //data
  proyecto: Proyecto;
  pbis: Pbi[];

  /* datos ejes */
  listaTotal: any[] = [];
  listaFeatures: any[] = [];
  listaInfrastructures: any[] = [];
  listaTechDebt: any[] = [];
  listaBugs: any[] = [];

  sprints: Sprint[] = [];

  puntosTotales: number;

  puntosTotalesFeature: number;
  puntosTotalesTechDebt: number;
  puntosTotalesInfrastructure: number;
  puntosTotalesBug: number;

  ultimoSprint: number;

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(proyecto: Proyecto, pbis: Pbi[]) {
    this.proyecto = proyecto;
    this.pbis = pbis;
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatos() {
    this.sprints = [];

    this.listaFeatures = [];
    this.listaTechDebt = [];
    this.listaInfrastructures = [];
    this.listaBugs = [];

    /* this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    }); */
    this.ultimoSprint = this.proyecto.sprintActual;

    // no debería verse los sprints por el sprint ultimo sino por el del proyecto
    if (this.ultimoSprint > this.proyecto.sprintActual) this.ultimoSprint = this.proyecto.sprintActual;

    // generar suma pbis:
    this.puntosTotales = this.pbis.length;

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.sprints.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));

      this.listaFeatures.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaInfrastructures.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaTechDebt.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      this.listaBugs.push(new Sprint('Sprint ' + (i + 1).toString(), i + 1, 0, 0, 0, ''));
      if (i == 0) {
        this.sprints[i].quemadoRelativo = 0;
        this.listaFeatures[i].quemadoRelativo = 0;
        this.listaTechDebt[i].quemadoRelativo = 0;
        this.listaInfrastructures[i].quemadoRelativo = 0;
        this.listaBugs[i].quemadoRelativo = 0;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbisFeatures = 0;
        var sumpbisTechDebt = 0;
        var sumpbisInfrastructure = 0;
        var sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) {
            if (pbi.label == 'feature') sumpbisFeatures++;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt++;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure++;
            else if (pbi.label == 'bug') sumpbisBug++;
          }
        });
        this.sprints[i].quemadoRelativo = Number(
          this.formatDataNumber(
            this.sprints[i - 1].quemadoRelativo +
              ((sumpbisFeatures + sumpbisTechDebt + sumpbisInfrastructure + sumpbisBug) / this.puntosTotales) * 100
          )
        );
        this.listaFeatures[i].quemadoRelativo = Number(
          this.formatDataNumber(
            this.listaFeatures[i - 1].quemadoRelativo + (sumpbisFeatures / this.puntosTotales) * 100
          )
        );
        this.listaTechDebt[i].quemadoRelativo = Number(
          this.formatDataNumber(
            this.listaTechDebt[i - 1].quemadoRelativo + (sumpbisTechDebt / this.puntosTotales) * 100
          )
        );
        this.listaInfrastructures[i].quemadoRelativo = Number(
          this.formatDataNumber(
            this.listaInfrastructures[i - 1].quemadoRelativo + (sumpbisInfrastructure / this.puntosTotales) * 100
          )
        );
        this.listaBugs[i].quemadoRelativo = Number(
          this.formatDataNumber(this.listaBugs[i - 1].quemadoRelativo + (sumpbisBug / this.puntosTotales) * 100)
        );
      }
    }
    this.listaTotal = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaTotal[i] = [this.listaFeatures[i].sprintNumber, this.sprints[i].quemadoRelativo];
      this.listaFeatures[i] = [this.listaFeatures[i].sprintNumber, this.listaFeatures[i].quemadoRelativo];
      this.listaTechDebt[i] = [this.listaTechDebt[i].sprintNumber, this.listaTechDebt[i].quemadoRelativo];
      this.listaInfrastructures[i] = [
        this.listaInfrastructures[i].sprintNumber,
        this.listaInfrastructures[i].quemadoRelativo
      ];
      this.listaBugs[i] = [this.listaBugs[i].sprintNumber, this.listaBugs[i].quemadoRelativo];
    }
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Percentage of Completion',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '<b>Sprint {point.x}</b><br>',
        valueSuffix: ' %',
        shared: true
      },
      xAxis: {
        title: {
          text: 'Sprints',
          style: {
            fontSize: '16px'
          }
        },
        tickInterval: 1,
        min: 1,
        max: this.proyecto.sprintActual + 1
      },
      yAxis: {
        title: {
          text: 'Completed PBIs',
          style: {
            fontSize: '16px'
          }
        },
        labels: {
          format: '{value}%'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
          }
        }
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
          pointWidth: 60,
          color: '#00ad17',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Tech-debt',
          data: this.listaTechDebt,
          type: 'column',
          pointWidth: 60,
          color: '#ffbb00',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Infrastructure',
          data: this.listaInfrastructures,
          type: 'column',
          pointWidth: 60,
          color: '#2196f3',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Bugs',
          data: this.listaBugs,
          type: 'column',
          pointWidth: 60,
          color: '#ad0000',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Total',
          data: this.listaTotal,
          type: 'line',
          color: '#4d4d4d',
          enableMouseTracking: false
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
        filename: 'percentage_of_completion',
        sourceHeight: 550,
        sourceWidth: 1100
      }
    };
  }

  formatDataNumber(data: number): string {
    return formatDataNumberStandardToFixed1(data);
  }

  ngOnDestroy() {}
}
