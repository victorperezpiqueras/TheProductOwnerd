import { Component, OnInit, OnDestroy } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Proyecto } from '@app/models/proyectos';
import { Grafico } from '@app/proyecto/grafico.interface';
import { formatDataNumberStandardToFixed1 } from '@app/shared/formatDataNumber';

@Component({
  selector: 'app-velocity',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss']
})
export class VelocityComponent implements Grafico, OnInit, OnDestroy {
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

  sprintNumber: number = 0;
  sprintNumberBW: number = 0;

  // listas
  listaAverage: any[] = [];
  listaAverageBest: any[] = [];
  listaAverageWorst: any[] = [];
  listaDeadline: any[] = [];
  deadlineSprint: number = 0;

  // puntos de corte
  puntoCorteBest: any[] = [];
  puntoCorteWorst: any[] = [];
  puntoCorteAverage: any[] = [];

  // medias
  mediaAverage: number = 0;
  mediaAverageBest: number = 0;
  mediaAverageWorst: number = 0;

  // max range
  maxValor: number = 0;
  updateFlag: boolean = false;

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
        this.generarBestWorstAverage(this.sprintNumber, this.sprintNumberBW);
        this.generarDeadline(this.deadlineSprint);
        this.generarPuntosCorte();
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
    this.listaAverageBest = [];
    this.listaAverage = [];
    this.listaAverageWorst = [];

    this.puntoCorteWorst = [];
    this.puntoCorteAverage = [];
    this.puntoCorteBest = [];

    this.mediaAverage = 0;
    this.mediaAverageBest = 0;
    this.mediaAverageWorst = 0;

    // obtener ultimo sprint:
    /*this.ultimoSprint = 0;
     this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    }); */
    this.ultimoSprint = this.proyecto.sprintActual;

    // resets de numeros de inputs:
    if (this.sprintNumber == 0) this.sprintNumber = this.ultimoSprint;
    if (this.sprintNumberBW == 0 && this.sprintNumber - 3 > 0) this.sprintNumberBW = 3;
    if (this.deadlineSprint == 0) this.deadlineSprint = this.ultimoSprint + 5; // 5 por poner un numero

    // generar suma pbis:
    this.puntosTotales = 0;
    this.pbis.forEach((pbi: Pbi) => {
      this.puntosTotales += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.sprints.push(new Sprint((i + 1).toString(), i + 1, 0, 0, 0, ''));
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

    // insertamos el punto inicial:
    var puntoInicial = [this.sprints[this.ultimoSprint].sprintNumber, this.sprints[this.ultimoSprint].restante];
    this.listaAverage.push(puntoInicial);

    // obtenemos los puntos restantes para calcular los consumidos:
    var restantes = this.sprints[this.ultimoSprint].restante;

    var quemados = this.puntosTotales - restantes;

    // calculamos los quemados de los sprints que no se tienen en cuenta:
    var indexSinContar = this.ultimoSprint - numeroSprints; /*  + 1; */

    var restantesSinContar = this.sprints[indexSinContar].restante;
    var quemadosSinContar = this.puntosTotales - restantesSinContar;

    // los restamos a los totales para sacar los quemados en la franja:
    var quemadosCalculados = quemados - quemadosSinContar;

    // calculamos la media:
    this.mediaAverage = quemadosCalculados / numeroSprints;
    // console.log('this.mediaAverage', this.mediaAverage);

    // calculamos los sprints enteros esperados:
    var puntoFinal = this.ultimoSprint + Math.trunc(restantes / this.mediaAverage);
    // calculamos la proporcion del ultimo sprint esperado:
    puntoFinal += (restantes % this.mediaAverage) / this.mediaAverage;

    this.listaAverage.push([puntoFinal + 1, 0]); // +1 due to axis starting at 1
  }

  generarBestWorstAverage(numeroSprints: number, sprintNumberBW: number) {
    this.listaAverageWorst = [];
    this.listaAverageBest = [];

    // generar punto inicial:
    const puntoInicial = [this.sprints[this.ultimoSprint].sprintNumber, this.sprints[this.ultimoSprint].restante];

    // insertamos los puntos iniciales:
    this.listaAverageWorst.push(puntoInicial);
    this.listaAverageBest.push(puntoInicial);

    // escoger solo los N ultimos:
    var sprints1 = [...this.sprints];
    sprints1.splice(0, 1);
    const num = this.ultimoSprint - numeroSprints;
    sprints1 = sprints1.slice(num);

    // ordenar los sprints por quemado ascendente y descendente:
    var orderedWorst = [
      ...sprints1.sort((p1, p2) => {
        return p1.quemado - p2.quemado;
      })
    ];
    var orderedBest = [
      ...sprints1.sort((p1, p2) => {
        return p2.quemado - p1.quemado;
      })
    ];

    // obtener las medias de los mejores y peores quemados:
    this.mediaAverageWorst = 0;
    this.mediaAverageBest = 0;
    for (var x = 0; x < sprintNumberBW; x++) {
      this.mediaAverageWorst += orderedWorst[x].quemado;
      this.mediaAverageBest += orderedBest[x].quemado;
    }
    this.mediaAverageWorst /= sprintNumberBW;
    this.mediaAverageBest /= sprintNumberBW;

    // calculamos los sprints enteros esperados:
    const restantes = this.sprints[this.ultimoSprint].restante;

    // generar los puntos finales:
    var puntoFinalWorst = this.ultimoSprint + Math.trunc(restantes / this.mediaAverageWorst);
    var puntoFinalBest = this.ultimoSprint + Math.trunc(restantes / this.mediaAverageBest);

    // calculamos la proporcion del ultimo sprint esperado:
    puntoFinalWorst += (restantes % this.mediaAverageWorst) / this.mediaAverageWorst;
    puntoFinalBest += (restantes % this.mediaAverageBest) / this.mediaAverageBest;
    // insertamos los puntos finales:
    // por si alguna media diese 0:
    if (this.mediaAverageWorst > 0) this.listaAverageWorst.push([puntoFinalWorst + 1, 0]); // +1 due to axis starting at 1
    if (this.mediaAverageBest > 0) this.listaAverageBest.push([puntoFinalBest + 1, 0]); // +1 due to axis starting at 1
  }

  generarDeadline(deadlineSprint: number) {
    this.listaDeadline = [];
    this.listaDeadline.push([deadlineSprint, 0]);
    this.listaDeadline.push([deadlineSprint, this.sprints[0].restante]);
  }

  generarPuntosCorte() {
    this.puntoCorteBest = [];
    this.puntoCorteWorst = [];
    this.puntoCorteAverage = [];

    if (this.listaAverage[this.listaAverage.length - 1][0] >= this.deadlineSprint) {
      // y - y0 = m·(x-x0) --> y - this.sprints[this.ultimoSprint].restante = media*(deadline-this.ultimoSprint)
      var corteAverage =
        this.sprints[this.ultimoSprint].restante - this.mediaAverage * (this.deadlineSprint - (this.ultimoSprint + 1)); // +1 due to axis starting at 1
      this.puntoCorteAverage.push([this.deadlineSprint, corteAverage]);
    }
    if (this.listaAverageWorst[this.listaAverageWorst.length - 1][0] >= this.deadlineSprint) {
      var corteAverageWorst =
        this.sprints[this.ultimoSprint].restante -
        this.mediaAverageWorst * (this.deadlineSprint - (this.ultimoSprint + 1)); // +1 due to axis starting at 1
      this.puntoCorteWorst.push([this.deadlineSprint, corteAverageWorst]);
    }
    if (this.listaAverageBest[this.listaAverageBest.length - 1][0] >= this.deadlineSprint) {
      var corteAverageBest =
        this.sprints[this.ultimoSprint].restante -
        this.mediaAverageBest * (this.deadlineSprint - (this.ultimoSprint + 1)); // +1 due to axis starting at 1
      this.puntoCorteBest.push([this.deadlineSprint, corteAverageBest]);
    }
  }

  // valor calculado para limitar el rango del grafico
  calcularMaxValor() {
    //console.log(this.chartOptions)
    this.maxValor = 0;
    [this.deadlineSprint, this.listaAverageWorst[this.listaAverageWorst.length - 1][0]].forEach((valor: number) => {
      if (this.maxValor < valor) this.maxValor = valor;
    });
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Forecast by Velocity',
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
          min: 1,
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
          name: 'Average Best',
          data: this.listaAverageBest,
          type: 'line',
          dashStyle: 'ShortDash',
          color: '#00FF00',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          }
        },
        {
          name: 'Projected Average',
          data: this.listaAverage,
          type: 'line',
          dashStyle: 'Dash',
          color: '#ffa500',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          }
        },
        {
          name: 'Average Worst',
          data: this.listaAverageWorst,
          type: 'line',
          dashStyle: 'LongDash',
          color: '#FF0000',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          }
        },
        {
          name: 'Worst Cut-off Point',
          data: this.puntoCorteWorst,
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
              return '<b>Worst-Average Cut-off Point</b><br/>Remaining Story Points: ' + this.y.toFixed(0);
            }
          }
        },
        {
          name: 'Average Cut-off Point',
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
              return '<b>Average Cut-off Point</b><br/>Remaining Story Points: ' + this.y.toFixed(0);
            }
          }
        },
        {
          name: 'Best Cut-off Point',
          data: this.puntoCorteBest,
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
              return '<b>Best-Average Cut-off Point</b><br/>Remaining Story Points: ' + this.y.toFixed(0);
            }
          }
        }
      ],
      legend: {
        x: -80
      },
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
        filename: 'forecast_by_velocity',
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
