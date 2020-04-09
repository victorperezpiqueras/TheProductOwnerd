import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
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
import { MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';

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
  dataTable: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chartOptionsPoC: Highcharts.Options;

  updateFlag: boolean = true;
  /* --------------DIALOG ELEMENTS AND VARIABLES-------------- */
  dialogRef: MatDialogRef<any>;

  isLoading = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Name', 'Role'];
  dataSource: any[] = [];

  pbis: Pbi[];

  /* datos ejes */
  listaData: any[] = [];

  listaFeatures: any[] = [];
  listaInfrastructures: any[] = [];
  listaTechDebt: any[] = [];
  listaBugs: any[] = [];

  sprints: Sprint[] = [];

  puntosTotales: number;

  puntosTotalesFeature: number;
  puntosTotalesTechDebt: number;
  puntosTotalesInfrastructure: number;
  puntosTotalesBug: number;

  ultimoSprint: number;

  /* invite */
  newEmail: string;
  roles: Rol[] = [
    { value: 'desarrollador', viewValue: 'Developer' },
    { value: 'productOwner', viewValue: 'Product Owner' },
    { value: 'stakeholder', viewValue: 'Stakeholder' }
  ];
  selectedRol = this.roles[0].value;

  constructor(
    private credentialsService: CredentialsService,
    private proyectosService: ProyectosService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
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

          /*   this.proyecto.usuarios.push({ nick: "aaaaaaa", rol: "stakeholder" })
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
          console.log(proyecto);
        });

        this.proyectosService.getProyectosPBIs(proyecto.idproyecto).subscribe((pbis: []) => {
          this.pbis = pbis;
          this.actualizarGraficoPBC();
          this.actualizarGraficoPoC();
        });
      });
    });
  }

  actualizarGraficoPBC() {
    this.generarEjes();
    this.generarEjesPorLabel();
    this.generarGrafico();
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
    this.listaFeatures = [];
    this.listaTechDebt = [];
    this.listaInfrastructures = [];
    this.listaBugs = [];
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
        //this.listaFeatures[i].quemado = sumpbisFeatures;
        this.listaTechDebt[i].restante = this.listaTechDebt[i - 1].restante - sumpbisTechDebt;
        this.listaInfrastructures[i].restante = this.listaInfrastructures[i - 1].restante - sumpbisInfrastructure;
        this.listaBugs[i].restante = this.listaBugs[i - 1].restante - sumpbisBug;
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

  generarGrafico() {
    this.chartOptions = {
      title: {
        text: 'Project Burndown Chart',
        style: {
          fontSize: '30px'
        }
      },
      tooltip: {
        headerFormat: '<b>Sprint {point.x}</b><br>'
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
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
        /* series: {
          marker: {
            enabled: true
          }
        } */
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
        }
      ],
      credits: {
        enabled: false
      }
    };
    //console.log(this.chartOptions);
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
      /* tooltip: {
        headerFormat: "<b>Sprint {point.x}</b><br>"
      }, */
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
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Features</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
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
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Tech-debt</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
          }
        },
        {
          name: 'Infrastructure',
          data: this.listaInfrastructures,
          type: 'column',
          pointWidth: 60,
          color: '#2196f3',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Infrastructure</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
          }
        },
        {
          name: 'Bugs',
          data: this.listaBugs,
          type: 'column',
          pointWidth: 60,
          color: '#ad0000',
          dataLabels: {
            enabled: false
          },
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Bugs</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
          }
        },
        {
          name: 'Total',
          data: this.listaData,
          type: 'line',
          color: '#4d4d4d',
          enableMouseTracking: false,
          tooltip: {
            headerFormat: null,
            pointFormatter: function() {
              return '<b>Sprint ' + this.x.toFixed(0) + '</b><br>Completion: ' + this.y.toFixed(2) + '%';
            }
          }
        }
      ],
      credits: {
        enabled: false
      }
    };
    console.log(this.chartOptionsPoC);
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
      .subscribe((data: any) => {
        console.log(data);
        this.newEmail = '';
        if (data.existe) {
          this._snackBar.open('Member successfully added!', 'Close', { duration: 3000 });
          this.actualizar();
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
