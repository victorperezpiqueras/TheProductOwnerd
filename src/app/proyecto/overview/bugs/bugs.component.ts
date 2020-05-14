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
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss']
})
export class BugsComponent implements Grafico, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  //data
  proyecto: Proyecto;
  pbis: Pbi[];

  /* datos ejes */
  listaTotal: any[] = [];

  listaOpenBugs: any[] = [];
  listaClosedBugs: any[] = [];
  listaCreatedBugs: any[] = [];

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
    this.listaOpenBugs = [];
    this.listaClosedBugs = [];
    this.listaCreatedBugs = [];

    this.ultimoSprint = this.proyecto.sprintActual;

    // no debería verse los sprints por el sprint ultimo sino por el del proyecto
    if (this.ultimoSprint > this.proyecto.sprintActual) this.ultimoSprint = this.proyecto.sprintActual;

    var totalCreatedBugs = 0;
    // generar lista sprints y nº de bugs:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      if (i === 0) {
        var sumBugsClosed = 0;
        var sumNewBugs = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint === i + 1 && pbi.label === 'bug') {
            sumBugsClosed++;
          }
          if (pbi.sprintCreacion === i + 1 && pbi.label === 'bug') {
            sumNewBugs++;
          }
        });
        totalCreatedBugs += sumNewBugs;
        this.listaClosedBugs[i] = { value: 0, displayed: sumBugsClosed };
        this.listaOpenBugs[i] = { value: sumNewBugs, displayed: sumNewBugs };
        this.listaCreatedBugs[i] = { value: 0, displayed: totalCreatedBugs };
      } else {
        var sumBugsClosed = 0;
        var sumNewBugs = 0;
        var sumPbiBugsOpened = this.listaOpenBugs[i - 1].opened;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint === i + 1 && pbi.label === 'bug') {
            sumBugsClosed++;
          }
          if (pbi.sprintCreacion === i + 1 - 1 && pbi.label === 'bug') {
            sumPbiBugsOpened++;
          }
          if (pbi.sprintCreacion === i + 1 && pbi.label === 'bug') {
            sumNewBugs++;
          }
        });
        totalCreatedBugs += sumNewBugs;
        let closed = this.listaClosedBugs[i - 1].value + this.listaClosedBugs[i - 1].displayed;
        this.listaClosedBugs[i] = { value: closed, displayed: sumBugsClosed };
        this.listaCreatedBugs[i] = { value: totalCreatedBugs - sumNewBugs, displayed: sumNewBugs };
        let openedValue = totalCreatedBugs - closed;
        let openedDisplayed = sumPbiBugsOpened - sumBugsClosed;
        this.listaOpenBugs[i] = { value: openedValue, displayed: openedDisplayed };
      }
    }
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaClosedBugs[i] = {
        x: i + 1,
        y: this.listaClosedBugs[i].value,
        displayed: this.listaClosedBugs[i].displayed
      };
      this.listaOpenBugs[i] = { x: i + 1, y: this.listaOpenBugs[i].value, displayed: this.listaOpenBugs[i].displayed };
      this.listaCreatedBugs[i] = {
        x: i + 1,
        y: this.listaCreatedBugs[i].value,
        displayed: this.listaCreatedBugs[i].displayed
      };
    }
    console.log(this.listaCreatedBugs);
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Bug Status',
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
        tickInterval: 1,
        min: 1,
        max: this.proyecto.sprintActual + 1
      },
      yAxis: {
        /* min: 0, */
        tickInterval: 1,
        title: {
          text: 'Nº of Bugs',
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
        }
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [
        /* {
          name: 'Created Bugs',
          data: this.listaCreatedBugs,
          type: 'area',
          pointWidth: 60,
          color: '#74eeff',
          fillOpacity: 0.4,
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}:' +
              ' <b>{point.y}</b>. <span style="font-size:10px">(During sprint: <b>{point.displayed}</b>)</span><br/>'
          }
        }, */
        {
          name: 'Closed Bugs',
          data: this.listaClosedBugs,
          type: 'area',
          pointWidth: 60,
          color: '#898989',
          fillOpacity: 0.4,
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">●</span> {series.name}:' +
              ' <b>{point.y}</b>. <span style="font-size:10px">(During sprint: <b>{point.displayed}</b>)</span><br/>'
          }
        },
        {
          name: 'Opened Bugs',
          data: this.listaOpenBugs,
          type: 'area',
          pointWidth: 60,
          color: '#ad0000',
          fillOpacity: 0.4,
          dataLabels: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> Total {series.name}: <b>{point.y}</b><br/>'
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
        filename: 'bugs_status',
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
