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

  puntosConsumidos: number;
  puntosTotales: number;
  ultimoSprint: number;

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
      console.log(routeParams);
      this.proyectosService.getProyecto(routeParams.id).subscribe(proyecto => {
        console.log(proyecto);
        this.proyecto = proyecto;
        this.proyectosService.getProyectoUsuariosRoles(proyecto.idproyecto).subscribe(usuarios => {
          this.proyecto.usuarios = usuarios;
          this.isLoading = false;
          console.log(proyecto);
        });

        this.proyectosService.getProyectosPBIs(proyecto.idproyecto).subscribe((pbis: []) => {
          console.log(pbis);
          this.pbis = pbis;
          this.generarEjes();
          this.generarExpectedAverage();
          this.generarGrafico();
        });
      });
    });
  }

  generarEjes() {
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
      if (i == 0) {
        this.listaRestantes[i] = this.puntosTotales;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbis = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) sumpbis += pbi.estimacion;
        });
        // restar al total anterior las del sprint
        this.listaRestantes[i] = this.listaRestantes[i - 1] - sumpbis;
      }
    }
    console.log(this.listaSprints);
    this.listaData = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaData[i] = [this.listaSprints[i], this.listaRestantes[i]];
    }
  }

  generarExpectedAverage() {
    // obtenemos los puntos restantes para calcular los consumidos:

    var restantes = this.listaRestantes[this.ultimoSprint];
    console.log('restantes', restantes);

    console.log('this.ultimoSprint', this.ultimoSprint);
    var quemados = this.puntosTotales - restantes;
    console.log('quemados', quemados);
    // calculamos la media:
    var media = quemados / this.ultimoSprint;

    console.log('media', media);

    /* var sprintAverage = this.ultimoSprint;
    var quemadosActuales = quemados; */
    /* var bool = true;
    // calculamos cuantos sprints mas hacen falta:
    while (bool) {
      // si sobra mas de un sprint contamos uno:
      if ( (quemadosActuales - media) >= 0) {
        bool=true;
        quemadosActuales = quemadosActuales-media;
        sprintAverage++;
      }
      // si es menos de un sprint calculamos la proporcion de sprint en la que se acabaría:
      else {
        const resto = quemadosActuales / media;
        sprintAverage += resto;
        bool=false;
      }
      //if(sprintAverage>20)bool=false;
      console.log("quemadosActuales", quemadosActuales)
      console.log("sprintAverage", sprintAverage)
    } */

    // calculamos los sprints enteros esperados:
    this.ultimoSprint += Math.trunc(restantes / media);
    // calculamos la proporcion del ultimo sprint esperado:
    this.ultimoSprint += (restantes % media) / media;

    this.listaData.push([this.ultimoSprint, 0]);
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart'
      },
      xAxis: {
        /* categories: this.listaSprints, */
        title: {
          text: 'Sprints'
        }
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
          /* data: this.listaRestantes, */
          data: this.listaData,
          type: 'column',
          pointWidth: 30
        },
        {
          name: 'Projected Average',
          data: this.listaData,
          type: 'line'
        }
      ],
      credits: {
        enabled: false
      }
    };
    console.log(this.chartOptions);
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
