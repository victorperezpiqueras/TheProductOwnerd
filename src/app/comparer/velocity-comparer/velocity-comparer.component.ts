import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Proyecto } from '@app/models/proyectos';
import { Permisos } from '@app/models/permisos';
import { Grafico } from '@app/proyecto/grafico.interface';
import { GraficoComparer } from '../grafico-comparer.interface';
import { ProyectoData } from '../proyectoData.interface';
import { SprintComparer } from '../sprint-comparer.interface';

interface ProyectoVelocidad {
  idproyecto: number;
  velocidad: number;
}

@Component({
  selector: 'app-velocity-comparer',
  templateUrl: './velocity-comparer.component.html',
  styleUrls: ['./velocity-comparer.component.scss']
})
export class VelocityComparerComponent implements GraficoComparer, OnInit, OnDestroy {
  // highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag: boolean = false;

  // datos principales
  proyectos: ProyectoData[];

  proyectosDatos: any[] = [];
  /*   proyectosVelocidades: ProyectoVelocidad[] = []; */
  listaProyectosChart: any[] = [];
  listaProyectosSeries: any[] = [];

  // datos derivados
  sprints: SprintComparer[] = [];

  puntosTotales: number;

  ultimoSprint: number;

  // deadline
  listaDeadline: any[] = [];
  maxDeadline: number;

  constructor() {}

  ngOnInit() {}

  actualizarGrafico(proyectos: ProyectoData[]) {
    this.proyectos = proyectos;
    this.generarDatos();
    this.generarGrafico();
  }

  generarDatos() {
    // inicializar:
    this.proyectosDatos = [];
    /* this.proyectosVelocidades = []; */
    this.listaProyectosChart = [];

    // generar datos de sprints y puntos para cada proyecto:
    this.proyectos.forEach((proyecto: ProyectoData) => {
      /* let velocidad = this.generarVelocidad(proyecto.pbis);
      let pv: ProyectoVelocidad = { idproyecto: proyecto.proyecto.idproyecto, velocidad: velocidad };
      this.proyectosVelocidades.push(pv); */
      let sprints = this.generarSprints(proyecto.pbis); //console.log(sprints)
      proyecto.sprints = sprints;
    }); //console.log(this.proyectos)

    // calcula los sprints relativos en funcion de todos los proyectos:
    this.recalcularEjesX();
    this.insertarDatosGrafico();

    // pintar la deadline
    this.generarDeadline(this.maxDeadline);
    //console.log(this.listaProyectosChart)
  }

  generarSprints(pbis: Pbi[]): SprintComparer[] {
    var array: SprintComparer[] = [];

    // calcular ultimo sprint:
    var ultimoSprint: number = 0;
    pbis.forEach((pbi: Pbi) => {
      if (pbi.sprint > ultimoSprint) ultimoSprint = pbi.sprint;
    });

    // generar suma pbis:
    var puntosTotales: number = 0;
    pbis.forEach((pbi: Pbi) => {
      puntosTotales += pbi.estimacion;
    });

    var puntosActuales = puntosTotales;
    // generar lista sprints y estimaciones:
    for (var i = 0; i <= ultimoSprint; i++) {
      // calcular pbis finalizados en el sprint:
      let puntosAcabados = 0;
      pbis.forEach((pbi: Pbi) => {
        if (pbi.sprint === i) puntosAcabados += pbi.estimacion;
      });
      puntosActuales -= puntosAcabados;
      // crear sprint:
      let sprint: SprintComparer = {
        sprintNumber: i,
        sprintNumberRelativo: null,
        restantes: puntosActuales,
        restantesRelativos: (puntosActuales / puntosTotales) * 100
      };
      array.push(sprint);
    }

    return array;
  }

  /* recalcularEjesX(): void {
    var maxSprint: number = 0;
    // obtener maximo sprint de todos:
    this.proyectos.forEach((proy: ProyectoData) => {
      if (proy.proyecto.sprintActual > maxSprint) maxSprint = proy.proyecto.sprintActual;
    });

    // cambiar numeros de sprint desde el maximo hasta que se agote:
    this.proyectos.forEach((proy: ProyectoData) => {
      let contadorSprints = maxSprint;
      for (var i = proy.sprints.length - 1; i >= 0; i--) {
        proy.sprints[i].sprintNumberRelativo = contadorSprints;
        contadorSprints--;
      }
    });
    //console.log(this.proyectos)
  } */

  recalcularEjesX(): void {
    this.maxDeadline = 0;
    // obtener maximo sprint de todos:
    this.proyectos.forEach((proy: ProyectoData) => {
      if (proy.proyecto.deadline > this.maxDeadline) this.maxDeadline = proy.proyecto.deadline;
    });

    // cambiar numeros de sprint desde el maximo hasta que se agote:
    this.proyectos.forEach((proy: ProyectoData) => {
      let contadorSprints = this.maxDeadline - (proy.proyecto.deadline - proy.proyecto.sprintActual);
      for (var i = proy.sprints.length - 1; i >= 0; i--) {
        proy.sprints[i].sprintNumberRelativo = contadorSprints;
        contadorSprints--;
      }
    });
    //console.log(this.proyectos)
  }

  insertarDatosGrafico(): void {
    // crear la estructura de listas
    this.proyectos.forEach((proy: ProyectoData) => {
      var datosLinea: any[] = [];
      // para cada proyecto crear una lista de sus sprints para una linea:
      proy.sprints.forEach((sprint: SprintComparer) => {
        /* datosLinea.push([sprint.sprintNumberRelativo, Number(sprint.restantesRelativos.toFixed(2))]); */
        let sprintLabel: string;
        sprint.sprintNumber === 0 ? (sprintLabel = 'Start') : (sprintLabel = sprint.sprintNumber.toString());
        datosLinea.push({
          x: sprint.sprintNumberRelativo,
          y: Number(sprint.restantesRelativos.toFixed(2)),
          sprint: sprintLabel
        });
      });

      // crea la nueva linea:
      //this.listaProyectosChart.push(datosLinea);
      proy.series = datosLinea;
    });

    // generar colores para los proyectos:
    var colores = this.generarColoresAleatorios(this.proyectos.length);
    console.log(colores);
    let colorIndex: number = 0;
    this.proyectos.forEach((proy: ProyectoData) => {
      this.listaProyectosSeries.push({
        name: proy.proyecto.nombre,
        data: proy.series,
        type: 'line',
        color: colores[colorIndex],
        tooltip: {
          pointFormat:
            '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y} %</b> (Sprint <b>{point.sprint}</b>)<br/>'
        },
        marker: {
          enabled: true,
          radius: 3
        }
      });
      colorIndex++;
    }); //console.log(this.listaProyectosSeries)
  }

  generarColoresAleatorios(numeroProyectos: number): string[] {
    var colores: string[] = ['#ffbb00', '#00ad17', '#ff06a4', '#2196f3', '#00ffe8', '#7c00ff'];
    var selectedColores: string[] = [];
    var counter = 0;
    while (counter < numeroProyectos) {
      selectedColores.push(colores[counter % colores.length]);
      counter++;
    }
    return selectedColores;
  }

  generarDeadline(deadlineSprint: number) {
    this.listaDeadline = [];
    /* this.listaDeadline.push([deadlineSprint, 0]);
    this.listaDeadline.push([deadlineSprint, 100]); */
    this.listaDeadline.push({ x: deadlineSprint, y: 0 });
    this.listaDeadline.push({ x: deadlineSprint, y: 100 });
    this.listaProyectosSeries.push({
      name: 'Deadline',
      data: this.listaDeadline,
      type: 'line',
      color: '#b20000',
      lineWidth: 3,
      tooltip: {
        headerFormat: null,
        pointFormatter: function() {
          return '<b>Deadline</b>';
        }
      }
    });
  }

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Velocity Comparison',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '',
        shared: true
      },
      xAxis: {
        title: {
          text: 'Sprint History',
          style: {
            fontSize: '16px'
          }
        },
        labels: {
          enabled: false
        },
        tickInterval: 1,
        min: 0,
        max: this.maxDeadline + 1,
        startOnTick: true
      },
      yAxis: {
        max: 100,
        title: {
          text: 'Story Points',
          style: {
            fontSize: '16px'
          }
        },
        labels: {
          format: '{value}%'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
          }
        },
        allowDecimals: false
      },
      series: this.listaProyectosSeries,
      /* [
        {
          name: 'Scope Line',
          data: [[0, 2], [2, 4]],
          type: 'line',
          color: '#4d4d4d'
        }

      ] */
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
        filename: 'projects_velocity_comparison',
        sourceHeight: 550,
        sourceWidth: 1100
      }
    };
  }

  ngOnDestroy() {}
}
