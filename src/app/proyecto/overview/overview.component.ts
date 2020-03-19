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

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options /*  = {
    title: {
      text: 'Project Burndown Chart'
    },
    series: [
      {
        data: [1, 2, 3],
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  } */;
  chartOptionsPoC: Highcharts.Options;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  state$: Observable<object>;
  state: Proyecto;

  pbis: Pbi[];

  /* datos ejes */
  listaSprints: string[] = [];
  listaRestantes: number[] = [];
  listaData: any[] = [];

  sprints: Sprint[] = [];

  puntosConsumidos: number;
  puntosTotales: number;
  ultimoSprint: number;

  listaAverage: any[] = [];
  listaAverageBest: any[] = [];
  listaAverageWorst: any[] = [];

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

        this.proyectosService.getProyectosPBIs(proyecto.idproyecto).subscribe((pbis: []) => {
          this.pbis = pbis;
          /* grafico PB */
          this.generarEjes();
          this.generarExpectedAverage();
          this.generarBestWorstAverage();
          this.generarGrafico();

          /* grafico PoC */
          this.generarEjesPoC();
          this.generarGraficoPoC();
        });
      });
    });
  }

  generarEjes() {
    this.listaSprints = [];
    this.sprints = [];
    // obtener ultimo sprint:
    this.ultimoSprint = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
    });
    // generar suma pbis:
    this.puntosTotales = 0;
    this.pbis.forEach((pbi: Pbi) => {
      this.puntosTotales += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaSprints.push('Sprint ' + i.toString());
      this.sprints.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      if (i == 0) {
        this.listaRestantes[i] = this.puntosTotales;
        this.sprints[i].restante = this.puntosTotales;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbis = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) sumpbis += pbi.estimacion;
        });
        // restar al total anterior las del sprint
        this.listaRestantes[i] = this.listaRestantes[i - 1] - sumpbis;
        this.sprints[i].restante = this.sprints[i - 1].restante - sumpbis;
        this.sprints[i].quemado = sumpbis;
      }
    }
    //console.log(this.listaSprints);
    this.listaData = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaData[i] = [this.listaSprints[i], this.listaRestantes[i]];
      this.listaData[i] = [this.sprints[i].sprint, this.sprints[i].restante];
    }
  }

  generarExpectedAverage() {
    // inicializamos la linea:
    this.listaAverage = [];

    // insertamos el punto inicial:
    var puntoInicial = [this.sprints[this.ultimoSprint].sprintNumber, this.sprints[this.ultimoSprint].restante];
    this.listaAverage.push(puntoInicial);
    // obtenemos los puntos restantes para calcular los consumidos:
    var restantes = this.listaRestantes[this.ultimoSprint];
    var restantes = this.sprints[this.ultimoSprint].restante;
    //console.log('restantes', restantes);
    //console.log('this.ultimoSprint', this.ultimoSprint);
    var quemados = this.puntosTotales - restantes;
    //console.log('quemados', quemados);
    // calculamos la media:
    var media = quemados / this.ultimoSprint;
    //console.log('media', media);

    // calculamos los sprints enteros esperados:
    var puntoFinal = this.ultimoSprint + Math.trunc(restantes / media);
    // calculamos la proporcion del ultimo sprint esperado:
    puntoFinal += (restantes % media) / media;

    this.listaAverage.push([puntoFinal, 0]);
  }

  generarBestWorstAverage() {
    if (this.ultimoSprint >= 3 && this.sprints.length >= 4) {
      //4 por el sprint 0->3+1
      this.listaAverageWorst = [];
      this.listaAverageBest = [];
      // generar punto inicial:
      //var puntoInicial = this.listaData[this.ultimoSprint];
      var puntoInicial = [this.sprints[this.ultimoSprint].sprintNumber, this.sprints[this.ultimoSprint].restante];
      // insertamos los puntos iniciales:
      this.listaAverageWorst.push(puntoInicial);
      this.listaAverageBest.push(puntoInicial);
      // ordenar los sprints por quemado ascendente y descendente:
      var sprints1 = [...this.sprints];
      sprints1.splice(0, 1);
      var orderedWorst = [
        ...sprints1.sort((p1, p2) => {
          return p1.quemado - p2.quemado;
        })
      ];
      console.log(orderedWorst);
      var orderedBest = [
        ...sprints1.sort((p1, p2) => {
          return p2.quemado - p1.quemado;
        })
      ];
      console.log(orderedBest);
      // obtener las medias de los mejores y peores quemados:
      var mediaWorst = (orderedWorst[0].quemado + orderedWorst[1].quemado + orderedWorst[2].quemado) / 3;
      var mediaBest = (orderedBest[0].quemado + orderedBest[1].quemado + orderedBest[2].quemado) / 3;
      // generar los puntos finales:
      // calculamos los sprints enteros esperados:
      var restantes = this.sprints[this.ultimoSprint].restante;
      var puntoFinalWorst = this.ultimoSprint + Math.trunc(restantes / mediaWorst);
      var puntoFinalBest = this.ultimoSprint + Math.trunc(restantes / mediaBest);
      // calculamos la proporcion del ultimo sprint esperado:
      puntoFinalWorst += (restantes % mediaWorst) / mediaWorst;
      puntoFinalBest += (restantes % mediaBest) / mediaBest;
      // insertamos los puntos finales:
      //por si alguna media diese 0:
      if (mediaWorst > 0) this.listaAverageWorst.push([puntoFinalWorst, 0]);
      if (mediaBest > 0) this.listaAverageBest.push([puntoFinalBest, 0]);
    }
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart'
      },
      tooltip: {
        formatter: function() {
          return "<b style='font-size:10px'>Sprint " + this.x.toFixed(0) + '</b><br><b>Scope: ' + this.y + '</b>';
        }
      },
      xAxis: {
        title: {
          text: 'Sprints'
        },
        /*  max: 5, */
        tickInterval: 1
      },
      yAxis: [
        {
          title: {
            text: 'Story Points'
          }
        }
      ],
      series: [
        {
          name: 'Scope',
          data: this.listaData,
          type: 'column',
          pointWidth: 30,
          color: '#80bfff'
        },
        {
          name: 'Scope Line',
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d'
        },
        {
          name: 'Average Best',
          data: this.listaAverageBest,
          type: 'line',
          dashStyle: 'ShortDash',
          color: '#00FF00'
        },
        {
          name: 'Projected Average',
          data: this.listaAverage,
          type: 'line',
          dashStyle: 'Dash',
          color: '#ffa500'
        },
        {
          name: 'Average Worst',
          data: this.listaAverageWorst,
          type: 'line',
          dashStyle: 'LongDash',
          color: '#FF0000'
        }
      ],
      credits: {
        enabled: false
      }
    };
    console.log(this.chartOptions);
  }

  generarEjesPoC() {
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
  }

  generarGraficoPoC() {
    this.chartOptionsPoC = {
      title: {
        text: 'Percentage of Completion'
      },
      tooltip: {
        formatter: function() {
          return this.y + '%';
        }
      },
      xAxis: {
        title: {
          text: 'Sprints'
        },
        tickInterval: 1
      },
      yAxis: [
        {
          title: {
            text: 'Completed PBIs'
          },
          labels: {
            format: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Completed',
          data: this.listaData,
          type: 'column',
          pointWidth: 40,
          color: '#98FB98',
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        },
        {
          name: 'Completed Line',
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d',
          enableMouseTracking: false
        }
      ],
      credits: {
        enabled: false
      }
    };
    console.log(this.chartOptionsPoC);
  }

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
