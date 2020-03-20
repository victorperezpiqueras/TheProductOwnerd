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
  chartOptions: Highcharts.Options;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Name', 'Role'];
  dataSource: any[] = [];

  pbis: Pbi[];

  /* datos ejes */
  listaData: any[] = [];

  sprints: Sprint[] = [];

  puntosTotales: number;
  ultimoSprint: number;

  constructor(
    private credentialsService: CredentialsService,
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
          this.generarGrafico();
        });
      });
    });
  }

  generarEjes() {
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
      this.sprints.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
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

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart'
      },
      tooltip: {
        formatter: function() {
          return "<b style='font-size:12px'>Sprint " + this.x.toFixed(0) + '</b><br><b>Scope: ' + this.y + '</b>';
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
        }
      ],
      credits: {
        enabled: false
      }
    };
    //console.log(this.chartOptions);
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
