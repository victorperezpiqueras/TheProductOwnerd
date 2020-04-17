import { Component, OnInit, OnDestroy, Input, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map, takeUntil, take } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { Pbi } from '@app/models/pbis';
import { Sprint } from '@app/models/sprints';
import { Permisos } from '@app/models/permisos';
import { MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { Usuario } from '@app/models/usuarios';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { formatRoles } from '@app/shared/helperRoles';

interface Rol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;
  @Input() permisos: Permisos;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  dataTable: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chartOptionsPoC: Highcharts.Options;

  updateFlag: boolean = false;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Name', 'Role'];
  dataSource: any[] = [];
  pageSizeOptions: number[];
  pageSize: number;

  pbis: Pbi[];

  /* datos ejes */
  listaData: any[] = [];
  listaFeatures: any[] = [];
  listaInfrastructures: any[] = [];
  listaTechDebt: any[] = [];
  listaBugs: any[] = [];

  listaFeaturesSC: any[] = [];
  listaInfrastructuresSC: any[] = [];
  listaTechDebtSC: any[] = [];
  listaBugsSC: any[] = [];

  sprints: Sprint[] = [];

  puntosTotales: number;

  puntosTotalesFeature: number;
  puntosTotalesTechDebt: number;
  puntosTotalesInfrastructure: number;
  puntosTotalesBug: number;

  showScopeCreep: boolean = false;

  ultimoSprint: number;

  averageThroughput: number = 0;
  averageVelocity: number = 0;

  /* invite */
  newEmail: string;
  roles: Rol[] = [
    { value: 'desarrollador', viewValue: 'Developer' },
    { value: 'productOwner', viewValue: 'Product Owner' },
    { value: 'stakeholder', viewValue: 'Stakeholder' }
  ];
  selectedRol = this.roles[0].value;

  dialogRefConfirm: MatDialogRef<any>;

  buttonDisabled: boolean = true;

  constructor(
    private credentialsService: CredentialsService,
    private proyectosService: ProyectosService,
    private usuariosService: UsuariosService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // modificar la UI en función del rol para ajustarla a los cards
    if (this.permisos.mantenerUsuarios === 1) {
      this.displayedColumns = ['Actions', 'Name', 'Role'];
      this.pageSizeOptions = [5];
      this.pageSize = 5;
    } else {
      this.displayedColumns = ['Name', 'Role'];
      this.pageSizeOptions = [8];
      this.pageSize = 8;
    }
    this.activeRoute.params.subscribe(routeParams => {
      //console.log(routeParams);
      this.proyectosService
        .getProyecto(routeParams.id)
        .pipe(untilDestroyed(this))
        .subscribe(proyecto => {
          //console.log(proyecto);
          this.proyecto = proyecto;
          this.actualizar();
        });
    });
  }

  actualizar() {
    console.log('actualizar');
    this.actualizarUsuarios();
    this.actualizarGraficos();
  }

  actualizarUsuarios() {
    this.proyectosService
      .getProyectoUsuariosRoles(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(usuarios => {
        this.proyecto.usuarios = usuarios;
        /* this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
      this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" }) */
        this.dataTable = new MatTableDataSource(this.proyecto.usuarios);
        this.dataTable.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  actualizarGraficos() {
    this.showScopeCreep = false;
    this.proyectosService
      .getProyectosPBI(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: []) => {
        this.pbis = pbis;
        this.actualizarGraficoPBC();
        this.actualizarGraficoPoC();
        this.calcularMedias();
      });
  }

  actualizarGraficoPBC() {
    // console.log("actualizar")
    this.generarEjes();
    this.generarEjesPorLabel();
    this.generarGraficoSC();
    // console.log(this.chartOptions.series)
  }

  showSC() {
    this.chartOptions.series[4].visible = this.showScopeCreep;
    this.chartOptions.series[5].visible = this.showScopeCreep;
    this.chartOptions.series[6].visible = this.showScopeCreep;
    this.chartOptions.series[7].visible = this.showScopeCreep;
    this.updateFlag = true;
  }

  actualizarGraficoPoC() {
    this.generarEjesPocPorLabel();
    this.generarGraficoPoC();
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

  generarEjesPorLabel() {
    // inicializar:
    this.listaFeatures = [];
    this.listaTechDebt = [];
    this.listaInfrastructures = [];
    this.listaBugs = [];

    this.listaFeaturesSC = [];
    this.listaTechDebtSC = [];
    this.listaInfrastructuresSC = [];
    this.listaBugsSC = [];
    /*     // obtener ultimo sprint:
        this.ultimoSprint = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint > this.ultimoSprint) this.ultimoSprint = pbi.sprint;
        }); */
    // generar suma pbis:
    this.puntosTotalesFeature = 0;
    this.puntosTotalesTechDebt = 0;
    this.puntosTotalesInfrastructure = 0;
    this.puntosTotalesBug = 0;

    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.label == 'feature') this.puntosTotalesFeature += pbi.estimacion;
      else if (pbi.label == 'tech-debt') this.puntosTotalesTechDebt += pbi.estimacion;
      else if (pbi.label == 'infrastructure') this.puntosTotalesInfrastructure += pbi.estimacion;
      else if (pbi.label == 'bug') this.puntosTotalesBug += pbi.estimacion;
    });

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaFeatures.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaInfrastructures.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaTechDebt.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaBugs.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      if (i == 0) {
        this.listaFeatures[i].restante = this.puntosTotalesFeature;
        this.listaTechDebt[i].restante = this.puntosTotalesTechDebt;
        this.listaInfrastructures[i].restante = this.puntosTotalesInfrastructure;
        this.listaBugs[i].restante = this.puntosTotalesBug;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbisFeatures = 0;
        var sumpbisTechDebt = 0;
        var sumpbisInfrastructure = 0;
        var sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) {
            if (pbi.label == 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label == 'bug') sumpbisBug += pbi.estimacion;
          }
        });
        // restar al total anterior las del sprint
        this.listaFeatures[i].restante = this.listaFeatures[i - 1].restante - sumpbisFeatures;
        this.listaTechDebt[i].restante = this.listaTechDebt[i - 1].restante - sumpbisTechDebt;
        this.listaInfrastructures[i].restante = this.listaInfrastructures[i - 1].restante - sumpbisInfrastructure;
        this.listaBugs[i].restante = this.listaBugs[i - 1].restante - sumpbisBug;

        // sumar datos de Scope Creep:
        sumpbisFeatures = 0;
        sumpbisTechDebt = 0;
        sumpbisInfrastructure = 0;
        sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprintCreacion == i) {
            if (pbi.label == 'feature') sumpbisFeatures += pbi.estimacion;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt += pbi.estimacion;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure += pbi.estimacion;
            else if (pbi.label == 'bug') sumpbisBug += pbi.estimacion;
          }
        });
        if (sumpbisFeatures === 0) sumpbisFeatures = undefined;
        if (sumpbisTechDebt === 0) sumpbisTechDebt = undefined;
        if (sumpbisInfrastructure === 0) sumpbisInfrastructure = undefined;
        if (sumpbisBug === 0) sumpbisBug = undefined;
        this.listaFeaturesSC[i - 1] = [this.listaFeatures[i - 1].sprint, -Math.abs(sumpbisFeatures)];
        this.listaTechDebtSC[i - 1] = [this.listaFeatures[i - 1].sprint, -Math.abs(sumpbisTechDebt)];
        this.listaInfrastructuresSC[i - 1] = [this.listaFeatures[i - 1].sprint, -Math.abs(sumpbisInfrastructure)];
        this.listaBugsSC[i - 1] = [this.listaFeatures[i - 1].sprint, -Math.abs(sumpbisBug)];
      }
    }

    //console.log(this.listaSprints);
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaFeatures[i] = [this.listaFeatures[i].sprint, this.listaFeatures[i].restante];
      this.listaTechDebt[i] = [this.listaTechDebt[i].sprint, this.listaTechDebt[i].restante];
      this.listaInfrastructures[i] = [this.listaInfrastructures[i].sprint, this.listaInfrastructures[i].restante];
      this.listaBugs[i] = [this.listaBugs[i].sprint, this.listaBugs[i].restante];
    }
  }

  generarGraficoSC() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '<b>Sprint {point.x}</b><br>',
        shared: true
      },
      xAxis: {
        title: {
          text: 'Sprints',
          style: {
            fontSize: '16px'
          }
        },
        tickInterval: 1,
        min: 0,
        startOnTick: true
      },
      yAxis: {
        title: {
          text: 'Story Points',
          style: {
            fontSize: '16px'
          }
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color:
              // theme
              (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
          }
        },
        allowDecimals: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'Features',
          data: this.listaFeatures,
          type: 'column',
          pointWidth: 30,
          color: '#00ad17',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Tech-debt',
          data: this.listaTechDebt,
          type: 'column',
          pointWidth: 30,
          color: '#ffbb00',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Infrastructure',
          data: this.listaInfrastructures,
          type: 'column',
          pointWidth: 30,
          color: '#2196f3',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Bugs',
          data: this.listaBugs,
          type: 'column',
          pointWidth: 30,
          color: '#ad0000',
          dataLabels: {
            enabled: false
          }
        },
        {
          name: 'Scope Creep Features',
          data: this.listaFeaturesSC,
          type: 'column',
          pointWidth: 30,
          color: '#c1ffc0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Tech-debt',
          data: this.listaTechDebtSC,
          type: 'column',
          pointWidth: 30,
          color: '#ffecc0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Infrastructure',
          data: this.listaInfrastructuresSC,
          type: 'column',
          pointWidth: 30,
          color: '#c0e9ff',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Creep Bugs',
          data: this.listaBugsSC,
          type: 'column',
          pointWidth: 30,
          color: '#ffc0c0',
          dataLabels: {
            enabled: false
          },
          visible: false
        },
        {
          name: 'Scope Line',
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d'
          /* tooltip: {
            headerFormat: null,
            pointFormatter: function () {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Scope: ' + this.y;
            }
          } */
        }
      ],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      }
    };
  }

  generarEjesPocPorLabel() {
    this.listaFeatures = [];
    this.listaTechDebt = [];
    this.listaInfrastructures = [];
    this.listaBugs = [];
    // generar suma pbis:
    this.puntosTotalesFeature = 0;
    this.puntosTotalesTechDebt = 0;
    this.puntosTotalesInfrastructure = 0;
    this.puntosTotalesBug = 0;
    // generar suma pbis:
    this.puntosTotales = this.pbis.length;
    /* this.pbis.forEach((pbi: Pbi) => {
      if (pbi.label == "feature") this.puntosTotalesFeature += pbi.estimacion;
      else if (pbi.label == "tech-debt") this.puntosTotalesTechDebt += pbi.estimacion;
      else if (pbi.label == "infrastructure") this.puntosTotalesInfrastructure += pbi.estimacion;
      else if (pbi.label == "bug") this.puntosTotalesBug += pbi.estimacion;
    }); */

    // generar lista sprints y estimaciones:
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaFeatures.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaInfrastructures.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaTechDebt.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      this.listaBugs.push(new Sprint('Sprint ' + i.toString(), i, 0, 0, 0, ''));
      if (i == 0) {
        this.sprints[i].quemadoRelativo = 0;
        this.listaFeatures[i].quemadoRelativo = 0;
        this.listaTechDebt[i].quemadoRelativo = 0;
        this.listaInfrastructures[i].quemadoRelativo = 0;
        this.listaBugs[i].quemadoRelativo = 0;
      } else {
        // sumar las estimaciones para cada sprint:
        var sumpbisFeatures = 0;
        var sumpbisTechDebt = 0;
        var sumpbisInfrastructure = 0;
        var sumpbisBug = 0;
        this.pbis.forEach((pbi: Pbi) => {
          if (pbi.sprint == i) {
            if (pbi.label == 'feature') sumpbisFeatures++;
            else if (pbi.label == 'tech-debt') sumpbisTechDebt++;
            else if (pbi.label == 'infrastructure') sumpbisInfrastructure++;
            else if (pbi.label == 'bug') sumpbisBug++;
          }
        });
        this.sprints[i].quemadoRelativo = Number(
          (
            this.sprints[i - 1].quemadoRelativo +
            ((sumpbisFeatures + sumpbisTechDebt + sumpbisInfrastructure + sumpbisBug) / this.puntosTotales) * 100
          ).toFixed(2)
        );
        this.listaFeatures[i].quemadoRelativo = Number(
          (this.listaFeatures[i - 1].quemadoRelativo + (sumpbisFeatures / this.puntosTotales) * 100).toFixed(2)
        );
        this.listaTechDebt[i].quemadoRelativo = Number(
          (this.listaTechDebt[i - 1].quemadoRelativo + (sumpbisTechDebt / this.puntosTotales) * 100).toFixed(2)
        );
        this.listaInfrastructures[i].quemadoRelativo = Number(
          (
            this.listaInfrastructures[i - 1].quemadoRelativo +
            (sumpbisInfrastructure / this.puntosTotales) * 100
          ).toFixed(2)
        );
        this.listaBugs[i].quemadoRelativo = Number(
          (this.listaBugs[i - 1].quemadoRelativo + (sumpbisBug / this.puntosTotales) * 100).toFixed(2)
        );

        // restar al total anterior las del sprint
        /* this.listaFeatures[i].restante = this.listaFeatures[i - 1].restante - sumpbisFeatures;
        this.listaTechDebt[i].restante = this.listaTechDebt[i - 1].restante - sumpbisTechDebt;
        this.listaInfrastructures[i].restante = this.listaInfrastructures[i - 1].restante - sumpbisInfrastructure;
        this.listaBugs[i].restante = this.listaBugs[i - 1].restante - sumpbisBug; */
      }
    }
    this.listaData = [];
    for (var i = 0; i <= this.ultimoSprint; i++) {
      this.listaData[i] = [this.sprints[i].sprint, this.sprints[i].quemadoRelativo];
      this.listaFeatures[i] = [this.listaFeatures[i].sprint, this.listaFeatures[i].quemadoRelativo];
      this.listaTechDebt[i] = [this.listaTechDebt[i].sprint, this.listaTechDebt[i].quemadoRelativo];
      this.listaInfrastructures[i] = [
        this.listaInfrastructures[i].sprint,
        this.listaInfrastructures[i].quemadoRelativo
      ];
      this.listaBugs[i] = [this.listaBugs[i].sprint, this.listaBugs[i].quemadoRelativo];
    }
  }

  generarGraficoPoC() {
    this.chartOptionsPoC = {
      title: {
        text: 'Percentage of Completion',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '<b>Sprint {point.x}</b><br>',
        valueSuffix: ' %',
        shared: true
      },
      xAxis: {
        title: {
          text: 'Sprints',
          style: {
            fontSize: '16px'
          }
        },
        tickInterval: 1
      },
      yAxis: {
        title: {
          text: 'Completed PBIs',
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
            color:
              // theme
              (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'Features',
          data: this.listaFeatures,
          type: 'column',
          pointWidth: 60,
          color: '#00ad17',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            /* headerFormat: null, */
            /* pointFormatter: function () {
              return '<b>Features</b><br>Completion: ' + this.y.toFixed(2) + '%';
            } */
          }
        },
        {
          name: 'Tech-debt',
          data: this.listaTechDebt,
          type: 'column',
          pointWidth: 60,
          color: '#ffbb00',
          dataLabels: {
            enabled: false
          }
          /*  tooltip: {
             headerFormat: null,
             pointFormatter: function () {
               return '<b>Tech-debt</b><br>Completion: ' + this.y.toFixed(2) + '%';
             }
           } */
        },
        {
          name: 'Infrastructure',
          data: this.listaInfrastructures,
          type: 'column',
          pointWidth: 60,
          color: '#2196f3',
          dataLabels: {
            enabled: false
          }
          /*  tooltip: {
             headerFormat: null,
             pointFormatter: function () {
               return '<b>Infrastructure</b><br>Completion: ' + this.y.toFixed(2) + '%';
             }
           } */
        },
        {
          name: 'Bugs',
          data: this.listaBugs,
          type: 'column',
          pointWidth: 60,
          color: '#ad0000',
          dataLabels: {
            enabled: false
          }
          /*  tooltip: {
             headerFormat: null,
             pointFormatter: function () {
               return '<b>Bugs</b><br>Completion: ' + this.y.toFixed(2) + '%';
             }
           } */
        },
        {
          name: 'Total',
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d',
          enableMouseTracking: false
          /* tooltip: {
            headerFormat: null,
            pointFormatter: function () {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
          } */
        }
      ],
      credits: {
        enabled: false
      }
    };
    // console.log(this.chartOptionsPoC);
  }

  calcularMedias() {
    this.averageThroughput = 0;
    this.averageVelocity = 0;
    this.pbis.forEach((pbi: Pbi) => {
      if (pbi.done) {
        this.averageThroughput++;
        this.averageVelocity += pbi.estimacion;
      }
    });
    console.log(this.averageVelocity);
    // ultimo sprint debe estar calculado
    this.averageThroughput /= this.ultimoSprint;
    this.averageVelocity /= this.ultimoSprint;
  }

  invitar() {
    this.isLoading = true;
    this.proyectosService
      .invitarUsuario(this.proyecto.idproyecto, {
        email: this.newEmail,
        rol: this.selectedRol,
        nombreProyecto: this.proyecto.nombre,
        invitadoPor: this.username
      })
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        // console.log(data);
        this.newEmail = '';
        if (data.existe) {
          this._snackBar.open('Member successfully added!', 'Close', { duration: 3000 });
          this.actualizarUsuarios();
        } else {
          this._snackBar.open(
            'This email does not have an account linked. An invitation has been sent instead!',
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      });
  }

  async eliminarUsuario(us: any) {
    const rol = formatRoles(us.rol);
    const usuario = await this.usuariosService.getUsuario(us.idusuario).toPromise();

    console.log(usuario);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'User',
      dialogModeVerbo: 'kick out from the project',
      descripcion:
        '[' + rol + '] ' + usuario.nick + ' - ' + usuario.apellido1 + ' ' + usuario.apellido2 + ', ' + usuario.nombre,
      botonConfirm: 'Kick'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          console.log(data);
          this.isLoading = true;
          this.proyectosService
            .eliminarUsuario(this.proyecto.idproyecto, us.idusuario)
            .pipe(untilDestroyed(this))
            .subscribe(res => {
              this.isLoading = false;
              this.actualizarUsuarios();
            });
        }
      });
  }

  actualizarProyecto() {
    this.isLoading = true;
    this.proyectosService
      .actualizarProyecto(this.proyecto.idproyecto, this.proyecto)
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        console.log(this.proyecto);
        this.isLoading = false;
        this._snackBar.open('Vision edited successfully!', 'Close', { duration: 3000 });
      });
  }

  switchSaveButton() {
    if (this.buttonDisabled) this.buttonDisabled = false;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
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
