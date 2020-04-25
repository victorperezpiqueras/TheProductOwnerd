import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

const SLR = require('ml-regression').SLR;

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Proyecto } from '@app/models/proyectos';
import { Permisos } from '@app/models/permisos';
import { Grafico } from '@app/proyecto/grafico.interface';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements Grafico, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  // datos principales
  proyecto: Proyecto;
  pbis: Pbi[];

  // datos derivados
  listaScope: any[] = [];
  sprints: Sprint[] = [];

  puntosConsumidos: number;
  puntosTotales: number;
  ultimoSprint: number;

  // listas
  listaAverage: any[] = [];
  listaDeadline: any[] = [];
  deadlineSprint: number = 0;

  // puntos de corte
  puntoCorteAverage: any[] = [];

  // medias
  mediaAverage: number = 0;

  // inputs
  sprintNumber: number = 0;

  // max range
  maxValor: number = 0;
  updateFlag: boolean = false;

  // regresion lineal
  regression: any;

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(proyecto: Proyecto, pbis: Pbi[]) {
    this.proyecto = proyecto;
    this.pbis = pbis;
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatos() {
    if (this.pbis.length > 0) {
      this.generarDatosBasicos();
      // si no hay pbis acabados no se puede calcular el ultimo sprint
      if (this.sprints.length) {
        this.generarExpectedAverage(this.sprintNumber);
        this.generarPuntosCorte();
        this.generarDeadline(this.deadlineSprint);
        this.calcularMaxValor();
      }
    }
  }

  // accion del boton de update chart
  updateChart() {
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatosBasicos() {
    this.sprints = [];
    this.listaScope = [];
    this.listaDeadline = [];

    this.listaAverage = [];

    this.puntoCorteAverage = [];

    this.mediaAverage = 0;

    // obtener ultimo sprint:
    this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    });
    // resets de numeros de inputs:
    if (this.sprintNumber == 0) this.sprintNumber = this.ultimoSprint;
    if (this.deadlineSprint == 0) this.deadlineSprint = this.ultimoSprint + 5; // 5 por poner un numero

    // generar suma pbis:
    this.puntosTotales = 0;
    this.pbis.forEach((pbi: Pbi) => {
      this.puntosTotales += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.sprints.push(new Sprint(i.toString(), i, 0, 0, 0, ''));
      if (i == 0) {
        this.sprints[i].restante = this.puntosTotales;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbis = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) sumpbis += pbi.estimacion;
        });
        // restar al total anterior las del sprint
        this.sprints[i].restante = this.sprints[i - 1].restante - sumpbis;
        this.sprints[i].quemado = sumpbis;
      }
    }
    //console.log(this.listaSprints);
    this.listaScope = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaScope[i] = [this.sprints[i].sprint, this.sprints[i].restante];
    }
  }

  generarExpectedAverage(numeroSprints: number) {
    // inicializamos la linea:
    this.listaAverage = [];

    // calcular el sprint desde el que se cuenta
    const startingSprint = this.ultimoSprint - numeroSprints + 1;

    // serializamos las X y las Y:
    var x: number[] = [];
    var y: number[] = [];

    for (var i = startingSprint; i <= this.ultimoSprint; i++) {
      x.push(i);
      y.push(this.sprints[i].restante);
    }

    // generar regresion:
    this.regression = new SLR(x, y);

    // calcular punto inicial:
    const initialX = startingSprint;
    const initialY = this.regression.predict(startingSprint);
    /* console.log(initialX)
        console.log(initialY) */

    //calcular punto final: [Y=0: y=mx+n] --> [0 = regression.coefficients[1]* X + regression.coefficients[0] ]
    const finalX = -this.regression.coefficients[0] / this.regression.coefficients[1];
    const finalY = 0;

    this.listaAverage.push([initialX, initialY]);
    this.listaAverage.push([finalX, finalY]);
    //console.log(this.listaAverage)

    //calcular media:
    this.mediaAverage = initialY / finalX;
  }

  generarPuntosCorte() {
    this.puntoCorteAverage = [];
    if (this.listaAverage[this.listaAverage.length - 1][0] >= this.deadlineSprint) {
      this.puntoCorteAverage.push([this.deadlineSprint, this.regression.predict(this.deadlineSprint)]);
    }
  }

  generarDeadline(deadlineSprint: number) {
    this.listaDeadline = [];
    this.listaDeadline.push([deadlineSprint, 0]);
    this.listaDeadline.push([deadlineSprint, this.sprints[0].restante]);
  }

  // valor calculado para limitar el rango del grafico
  calcularMaxValor() {
    this.maxValor = 0;
    [this.deadlineSprint, this.listaAverage[this.listaAverage.length - 1][0]].forEach((valor: number) => {
      if (this.maxValor < valor) this.maxValor = valor;
    });
    if (this.maxValor > this.deadlineSprint * 2) this.maxValor = this.deadlineSprint;
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Linear Regression Model',
        style: {
          fontSize: '30px'
        }
      },
      xAxis: [
        {
          title: {
            text: 'Sprints',
            style: {
              fontSize: '16px'
            }
          },
          min: 0,
          max: this.maxValor + 5,
          tickInterval: 1
        }
      ],
      yAxis: [
        {
          title: {
            text: 'Story Points',
            style: {
              fontSize: '16px'
            }
          }
        }
      ],
      series: [
        {
          name: 'Scope',
          data: this.listaScope,
          type: 'column',
          pointWidth: 30,
          color: '#80bfff',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          }
        },
        {
          name: 'Scope Line',
          data: this.listaScope,
          type: 'line',
          color: '#4d4d4d',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          },
          enableMouseTracking: false,
          marker: {
            enabled: true,
            radius: 1
          }
        },
        {
          name: 'Deadline',
          data: this.listaDeadline,
          type: 'line',
          color: '#b20000',
          lineWidth: 3,
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint Deadline: ' + this.x.toFixed(0);
            }
          }
        },
        {
          name: 'Projected Regression',
          data: this.listaAverage,
          type: 'line',
          color: '#ffa500',
          lineWidth: 4,
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Regression: ' + this.y.toFixed(1);
            }
          },
          marker: {
            enabled: false
          }
        },
        {
          name: 'Regression Cut-off Point',
          data: this.puntoCorteAverage,
          type: 'line',
          color: '#000000',
          lineWidth: 0,
          marker: {
            enabled: true,
            radius: 4
          },
          states: {
            hover: {
              lineWidthPlus: 0
            }
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Regression Cut-off Point</b><br/>Remaining Story Points: ' + this.y.toFixed(0);
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
        filename: 'linear_regression_model',
        sourceHeight: 550,
        sourceWidth: 1100
      }
    };
  }

  ngOnDestroy() {}
}
