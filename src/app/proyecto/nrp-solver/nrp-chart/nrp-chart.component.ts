import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { nrpAlgorithmIndividual } from '../nrp-solver.component';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

@Component({
  selector: 'app-nrp-chart',
  templateUrl: './nrp-chart.component.html',
  styleUrls: ['./nrp-chart.component.scss']
})
export class NrpChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  backlogList: nrpAlgorithmIndividual[] = [];
  backlogData: any[] = [];
  backlogDataSelected: any[] = [];

  @Input() nrpUsed: boolean;
  @Output() eventProposalSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.generarDatos();
    this.generarGrafico();
  }

  actualizarGrafico(backlogList: nrpAlgorithmIndividual[]) {
    //console.log(backlogList)
    this.backlogList = backlogList;
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatos() {
    this.backlogData = [];
    this.backlogDataSelected = [];
    this.backlogList.forEach((backlog: nrpAlgorithmIndividual) => {
      if (backlog.score !== 0 && backlog.cost !== 0) {
        this.backlogData.push([Number(backlog.score.toFixed(2)), Number(backlog.cost.toFixed(2))]);
      }
    });
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Next Release Proposals',
        style: {
          fontSize: '20px'
        }
      },
      /*  tooltip: {
         useHTML: true,
         formatter: function () {
           return "<button (click)='console.log(1+1)'>aaaa</button>"
         }
       }, */
      xAxis: [
        {
          title: {
            text: 'Value delivered to stakeholders',
            style: {
              fontSize: '16px'
            }
          },
          /* min: 0, */
          //max: 5,
          labels: {
            /* formatter: function() {
              return (this.value === 0 ? 'Start' : this.value).toString();
            } */
          }
          /* tickInterval: 1 */
        }
      ],
      yAxis: [
        {
          title: {
            text: 'Cost in Story Points',
            style: {
              fontSize: '16px'
            }
          }
        }
      ],
      series: [
        {
          type: 'scatter',
          name: 'Proposals',
          data: this.backlogData,
          color: '#80bfff',
          marker: {
            radius: 6
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return (
                '<b><span style="color:' +
                this.color +
                '">●</span> Proposal</b><br><b>Value delivered: </b>' +
                this.x +
                '</b><br><b>Cost (SPs): </b>' +
                this.y
              );
            }
          },
          point: {
            events: {
              click: function() {}
            }
          }
        },
        {
          type: 'scatter',
          name: 'Selected',
          data: this.backlogDataSelected,
          color: '#ff0000',
          marker: {
            radius: 8,
            fillColor: '#FFFFFF',
            lineWidth: 3,
            lineColor: null // inherit from series
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return (
                '<b><span style="color:' +
                this.color +
                '">●</span> Selected Proposal</b><br><b>Value delivered: </b>' +
                this.x +
                '</b><br><b>Cost (SPs): </b>' +
                this.y
              );
            }
          },
          point: {
            events: {
              click: function() {}
            }
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
        filename: 'next_release_proposals',
        sourceHeight: 1080,
        sourceWidth: 1920
      }
    };

    this.chartOptions.series[0].point.events.click = point => {
      //console.log(point);
      this.selectBacklog(point.point.options.x, point.point.options.y);
    };
    /* this.chartOptions.series[1].point.events.click = function (a) {
      console.log(a)
    } */
  }

  selectBacklog(x: number, y: number) {
    // copiamos el listado de backlogs
    let newBacklogData = [...this.backlogData];
    //console.log(this.backlogData);
    newBacklogData = [];
    // buscamos y eliminamos de la copia el elemento al que hemos hecho click
    for (let i = 0; i < this.backlogData.length; i++) {
      if (this.backlogData[i][0] == x && this.backlogData[i][1] == y) {
      } else {
        newBacklogData.push(this.backlogData[i]);
      }
    }
    // si habia uno seleccionado, lo añadimos al backlog list nuevo
    if (this.backlogDataSelected.length > 0) {
      newBacklogData.push(this.backlogDataSelected[0]);
    }
    //console.log(newBacklogData);
    // ponemos como backlog seleccionado el punto clickado
    this.backlogDataSelected = [[x, y]];
    // guardamos la lista modificada en la original
    this.backlogData = [...newBacklogData];
    this.generarGrafico();
    this.notificarBacklog();
  }

  notificarBacklog() {
    let backlogUpdate;
    console.log(this.backlogDataSelected[0]);
    this.backlogList.forEach((backlog: nrpAlgorithmIndividual) => {
      /* console.log(backlog.score)
      console.log(backlog.cost) */
      // no se por que aqui se vuelven a poner mas de 2 decimales
      if (
        Number(backlog.score.toFixed(2)) == this.backlogDataSelected[0][0] &&
        Number(backlog.cost.toFixed(2)) == this.backlogDataSelected[0][1]
      ) {
        backlogUpdate = backlog;
        console.log('if');
      }
    });
    //console.log(backlogUpdate);
    this.eventProposalSelected.emit(backlogUpdate);
  }
}
