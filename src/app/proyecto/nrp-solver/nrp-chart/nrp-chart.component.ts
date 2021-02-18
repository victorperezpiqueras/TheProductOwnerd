import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(backlogList: nrpAlgorithmIndividual[]) {
    this.backlogList = backlogList;
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatos() {
    //this.backlogList[0].
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Next Release Proposals',
        style: {
          fontSize: '20px'
        }
      },
      xAxis: [
        {
          title: {
            text: 'Score',
            style: {
              fontSize: '16px'
            }
          },
          min: 0,
          max: 5,
          labels: {
            formatter: function() {
              return (this.value === 0 ? 'Start' : this.value).toString();
            }
          },
          tickInterval: 1
        }
      ],
      yAxis: [
        {
          title: {
            text: 'Cost',
            style: {
              fontSize: '16px'
            }
          }
        }
      ],
      series: [
        {
          type: 'scatter',
          name: 'Browser share',
          data: [1, 1.5, 2.8, 3.5, 3.9, 4.2]
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
  }
}
