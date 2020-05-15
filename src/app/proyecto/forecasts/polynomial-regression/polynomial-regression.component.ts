import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

const PolynomialRegression = require('ml-regression').PolynomialRegression;

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Proyecto } from '@app/models/proyectos';
import { Permisos } from '@app/models/permisos';
import { Grafico } from '@app/proyecto/grafico.interface';

@Component({
  selector: 'app-polynomial-regression',
  templateUrl: './polynomial-regression.component.html',
  styleUrls: ['./polynomial-regression.component.scss']
})
export class PolynomialRegressionComponent implements Grafico, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  // datos principales
  proyecto: Proyecto;
  pbis: Pbi[];

  //updated:
  newDeadlineFlag: boolean = true;

  // datos derivados
  listaScope: any[] = [];
  sprints: Sprint[] = [];
  puntosTotales: number;
  ultimoSprint: number;

  // listas
  listaAverage: any[] = [];
  listaDeadline: any[] = [];
  deadlineSprint: number = 0;

  // puntos de corte
  puntoCorteAverage: any[] = [];

  // inputs
  sprintNumber: number = 0;
  degree: number = 2;

  // max range
  maxValor: number = 0;
  updateFlag: boolean = false;

  // regresion polinomica
  regression: any;

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(proyecto: Proyecto, pbis: Pbi[]) {
    this.proyecto = proyecto;
    this.pbis = pbis;
    this.newDeadlineFlag = true;
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

    // obtener ultimo sprint:
    this.ultimoSprint = this.proyecto.sprintActual;

    // resets de numeros de inputs:
    if (this.sprintNumber == 0) this.sprintNumber = this.ultimoSprint;
    if (this.newDeadlineFlag) {
      this.deadlineSprint = this.proyecto.deadline;
      this.newDeadlineFlag = false;
    }

    // generar suma pbis:
    this.puntosTotales = 0;
    this.pbis.forEach((pbi: Pbi) => {
      this.puntosTotales += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.sprints.push(
        new Sprint(
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
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbis = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint === i) sumpbis += pbi.estimacion;
        });
        // restar al total anterior las del sprint
        this.sprints[i].restante = this.sprints[i - 1].restante - sumpbis;
        this.sprints[i].quemado = sumpbis;
      }
    }
    //console.log(this.listaSprints);
    this.listaScope = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaScope[i] = [this.sprints[i].sprintNumber, this.sprints[i].restante];
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

    for (var i = startingSprint; i <= this.ultimoSprint /*  + 1 */; i++) {
      // contar el punto del sprint siguiente
      x.push(i);
      y.push(this.sprints[i /* - 1 */].restante);
    }

    /* console.log(x)
    console.log(y) */

    // generar regresion:
    this.regression = new PolynomialRegression(x, y, this.degree);

    /* console.log(this.regression);
    console.log(this.regression.toString()); */

    // calcular puntos finales:
    for (var i = startingSprint; i <= this.ultimoSprint; i++) {
      this.listaAverage.push({ x: i /* + 1 */, y: this.regression.predict(i) }); // +1 due to axis starting at 1
    }

    var notZero = true;
    var sprint: number = this.ultimoSprint;
    while (notZero) {
      sprint += 0.1;
      var r = this.regression.predict(sprint);
      if (r > 0) this.listaAverage.push({ x: sprint /* + 1 */, y: r });
      // +1 due to axis starting at 1
      else notZero = false;
      // si se excede el limite:
      if (sprint > this.deadlineSprint + this.deadlineSprint * 0.5) notZero = false;
    }
  }

  generarPuntosCorte() {
    this.puntoCorteAverage = [];
    if (this.listaAverage[this.listaAverage.length - 1].x >= this.deadlineSprint) {
      const corteAverage = this.regression.predict(this.deadlineSprint /* - 1 */); // -1 due to axis starting at 1
      this.puntoCorteAverage.push({ x: this.deadlineSprint, y: corteAverage });
    }
  }

  generarDeadline(deadlineSprint: number) {
    this.listaDeadline = [];
    var maxY: number = 0;
    var maxList = [];
    maxList.push(this.sprints[0].restante);
    if (this.puntoCorteAverage.length) maxList.push(this.puntoCorteAverage[0].y);
    maxList.forEach((valor: number) => {
      if (maxY < valor) maxY = valor;
    });
    this.listaDeadline.push({ x: deadlineSprint, y: 0 });
    this.listaDeadline.push({ x: deadlineSprint, y: maxY });
  }

  // valor calculado para limitar el rango del grafico
  calcularMaxValor() {
    this.maxValor = 0;
    [this.deadlineSprint, this.listaAverage[this.listaAverage.length - 1].x].forEach((valor: number) => {
      if (this.maxValor < valor) this.maxValor = valor;
    });
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Parabolic Regression Model',
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
          /* min: 0, */
          max: this.maxValor + 5,
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
          },
          enableMouseTracking: false
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
          },
          enableMouseTracking: false
        },
        {
          name: 'Projected Regression',
          data: this.listaAverage,
          type: 'spline',
          color: '#00FF00',
          lineWidth: 4,
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              var x = this.x;
              if (this.x % 1 !== 0) {
                x = Math.trunc(x);
                x++;
              }
              return '<b>Sprint ' + x + '</b><br>Regression: ' + this.y.toFixed(1);
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
        filename: 'polynomial_regression_model',
        sourceHeight: 550,
        sourceWidth: 1100
      }
    };
  }

  ngOnDestroy() {}
}
