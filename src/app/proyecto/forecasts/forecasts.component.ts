import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

import * as Highcharts from 'highcharts';
import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Permisos } from '@app/models/permisos';

@Component({
  selector: 'app-forecasts',
  templateUrl: './forecasts.component.html',
  styleUrls: ['./forecasts.component.scss']
})
export class ForecastsComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;
  @Input() permisos: Permisos;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  /*  state$: Observable<object>;
  state: Proyecto; */

  pbis: Pbi[];

  /* datos ejes */
  listaData: any[] = [];
  sprints: Sprint[] = [];

  puntosConsumidos: number;
  puntosTotales: number;
  ultimoSprint: number;

  /* datos average */
  sprintNumber: number = 0;
  sprintNumberBW: number = 0;
  listaAverage: any[] = [];
  listaAverageBest: any[] = [];
  listaAverageWorst: any[] = [];
  listaDeadline: any[] = [];
  deadlineSprint: number = 0;
  puntoCorteBest: any[] = [];
  puntoCorteWorst: any[] = [];
  puntoCorteAverage: any[] = [];

  /* medias */
  mediaAverage: number = 0;
  mediaAverageBest: number = 0;
  mediaAverageWorst: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.actualizar();
  }

  actualizar() {
    console.log('actualizar');
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      //console.log(routeParams);
      this.proyectosService.getProyecto(routeParams.id).subscribe(proyecto => {
        //console.log(proyecto);
        this.proyecto = proyecto;
        this.proyectosService.getProyectoUsuariosRoles(proyecto.idproyecto).subscribe(usuarios => {
          this.proyecto.usuarios = usuarios;
          this.isLoading = false;
          //console.log(proyecto);
        });

        this.proyectosService.getProyectosPBI(proyecto.idproyecto).subscribe((pbis: []) => {
          this.pbis = pbis;
          /* grafico Velocidad */
          this.actualizarGraficoVelocidad();
          /* grafico PoC */
        });
      });
    });
  }

  actualizarGraficoVelocidad() {
    this.generarEjes();
    this.generarExpectedAverage(this.sprintNumber);
    this.generarBestWorstAverage(this.sprintNumber, this.sprintNumberBW);
    this.generarDeadline(this.deadlineSprint);
    this.generarPuntosCorte();
    this.generarGrafico();
  }

  generarEjes() {
    this.sprints = [];
    // obtener ultimo sprint:
    this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    });
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
    this.listaData = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaData[i] = [this.sprints[i].sprint, this.sprints[i].restante];
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
    //console.log('restantes', restantes);
    // console.log('this.ultimoSprint', this.ultimoSprint);
    var quemados = this.puntosTotales - restantes;
    // console.log('quemados', quemados);

    // calculamos los quemados de los sprints que no se tienen en cuenta:
    var indexSinContar = this.ultimoSprint - numeroSprints; /*  + 1; */
    // console.log('indexSinContar', indexSinContar);
    var restantesSinContar = this.sprints[indexSinContar].restante;
    var quemadosSinContar = this.puntosTotales - restantesSinContar;
    // los restamos a los totales para sacar los quemados en la franja:
    var quemadosCalculados = quemados - quemadosSinContar;
    // console.log('quemadosCalculados', quemadosCalculados);
    // calculamos la media:
    this.mediaAverage = quemadosCalculados / numeroSprints;
    // console.log('this.mediaAverage', this.mediaAverage);

    // calculamos los sprints enteros esperados:
    var puntoFinal = this.ultimoSprint + Math.trunc(restantes / this.mediaAverage);
    // calculamos la proporcion del ultimo sprint esperado:
    puntoFinal += (restantes % this.mediaAverage) / this.mediaAverage;

    this.listaAverage.push([puntoFinal, 0]);
  }

  generarBestWorstAverage(numeroSprints: number, sprintNumberBW: number) {
    // if (this.ultimoSprint >= 3 && this.sprints.length >= 4) {
    //4 por el sprint 0->3+1
    this.listaAverageWorst = [];
    this.listaAverageBest = [];
    // generar punto inicial:
    //var puntoInicial = this.listaData[this.ultimoSprint];
    var puntoInicial = [this.sprints[this.ultimoSprint].sprintNumber, this.sprints[this.ultimoSprint].restante];
    // insertamos los puntos iniciales:
    this.listaAverageWorst.push(puntoInicial);
    this.listaAverageBest.push(puntoInicial);
    // escoger solo los N ultimos:
    var sprints1 = [...this.sprints];
    sprints1.splice(0, 1);
    var num = this.ultimoSprint - numeroSprints;
    sprints1 = sprints1.slice(num);
    // console.log(sprints1);
    // console.log(this.ultimoSprint);
    // console.log(num);
    // console.log(numeroSprints);
    // ordenar los sprints por quemado ascendente y descendente:
    var orderedWorst = [
      ...sprints1.sort((p1, p2) => {
        return p1.quemado - p2.quemado;
      })
    ];
    // console.log(orderedWorst);
    var orderedBest = [
      ...sprints1.sort((p1, p2) => {
        return p2.quemado - p1.quemado;
      })
    ];
    // console.log(orderedBest);
    // obtener las medias de los mejores y peores quemados:
    /* var mediaWorst = (orderedWorst[0].quemado + orderedWorst[1].quemado + orderedWorst[2].quemado) / 3;
    var mediaBest = (orderedBest[0].quemado + orderedBest[1].quemado + orderedBest[2].quemado) / 3; */
    /*  var mediaWorst = 0;
     var mediaBest = 0 */
    this.mediaAverageWorst = 0;
    this.mediaAverageBest = 0;
    for (var x = 0; x < sprintNumberBW; x++) {
      this.mediaAverageWorst += orderedWorst[x].quemado;
      this.mediaAverageBest += orderedBest[x].quemado;
    }
    this.mediaAverageWorst /= sprintNumberBW;
    this.mediaAverageBest /= sprintNumberBW;

    // generar los puntos finales:
    // calculamos los sprints enteros esperados:
    var restantes = this.sprints[this.ultimoSprint].restante;

    var puntoFinalWorst = this.ultimoSprint + Math.trunc(restantes / this.mediaAverageWorst);
    var puntoFinalBest = this.ultimoSprint + Math.trunc(restantes / this.mediaAverageBest);
    // calculamos la proporcion del ultimo sprint esperado:
    puntoFinalWorst += (restantes % this.mediaAverageWorst) / this.mediaAverageWorst;
    puntoFinalBest += (restantes % this.mediaAverageBest) / this.mediaAverageBest;
    // insertamos los puntos finales:
    //por si alguna media diese 0:
    if (this.mediaAverageWorst > 0) this.listaAverageWorst.push([puntoFinalWorst, 0]);
    if (this.mediaAverageBest > 0) this.listaAverageBest.push([puntoFinalBest, 0]);
    //  }
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
        this.sprints[this.ultimoSprint].restante - this.mediaAverage * (this.deadlineSprint - this.ultimoSprint);
      this.puntoCorteAverage.push([this.deadlineSprint, corteAverage]);
    }
    /* console.log(this.sprints[this.ultimoSprint - this.sprintNumber + 1]);
    console.log(this.mediaAverage);
    console.log(this.puntoCorteAverage); */
    if (this.listaAverageWorst[this.listaAverageWorst.length - 1][0] >= this.deadlineSprint) {
      var corteAverageWorst =
        this.sprints[this.ultimoSprint].restante - this.mediaAverageWorst * (this.deadlineSprint - this.ultimoSprint);
      this.puntoCorteWorst.push([this.deadlineSprint, corteAverageWorst]);
    }
    if (this.listaAverageBest[this.listaAverageBest.length - 1][0] >= this.deadlineSprint) {
      var corteAverageBest =
        this.sprints[this.ultimoSprint].restante - this.mediaAverageBest * (this.deadlineSprint - this.ultimoSprint);
      this.puntoCorteBest.push([this.deadlineSprint, corteAverageBest]);
    }
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Forecast by Velocity',
        style: {
          fontSize: '30px'
        }
      },
      xAxis: {
        title: {
          text: 'Sprints',
          style: {
            fontSize: '16px'
          }
        },
        /*  max: 5, */
        tickInterval: 1
      },
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
          data: this.listaData,
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
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d',
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
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
          /* tooltip: {
            headerFormat: '<b>Worst-Average Cut-off Point</b><br/>',
            pointFormat: 'Remaining Story Points: {point.y}'
          } */
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
      credits: {
        enabled: false
      }
    };
    // console.log(this.chartOptions);
  }

  /*  generarEjesPoC() {
    //this.sprints = [];
    // obtener ultimo sprint:
    this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    });
    // generar suma pbis:
    this.puntosTotales = this.pbis.length;
    // generar lista sprints y porcentajes:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      //this.sprints.push(new Sprint('Sprint ' + i.toString(), i, 0, 0));
      if (i == 0) {
        this.sprints[i].quemadoRelativo = 0;
      } else {
        // sumar los pbis completados para cada sprint:
        var sumpbis = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) sumpbis++;
        });
        // restar al total anterior las del sprint en forma de porcentaje
        this.sprints[i].quemadoRelativo = Number(
          (this.sprints[i - 1].quemadoRelativo + (sumpbis / this.puntosTotales) * 100).toFixed(2)
        );
      }
    }
    this.listaData = [];
    // la metrica es el quemado por sprint en forma de porcentaje
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaData[i] = [this.sprints[i].sprint, this.sprints[i].quemadoRelativo];
    }
  } */

  ngOnDestroy() {}

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
