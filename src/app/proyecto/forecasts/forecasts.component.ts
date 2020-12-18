import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@app/core';

import { MatDialog } from '@angular/material';

import { ProyectosService } from '@app/services/proyectos.service';
import { Permisos } from '@app/models/permisos';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { VelocityComponent } from './velocity/velocity.component';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { PolynomialRegressionComponent } from './polynomial-regression/polynomial-regression.component';
import { Release } from '@app/models/releases';

@Component({
  selector: 'app-forecasts',
  templateUrl: './forecasts.component.html',
  styleUrls: ['./forecasts.component.scss']
})
export class ForecastsComponent implements OnInit, OnDestroy {
  @Input() proyecto: any;
  @Input() permisos: Permisos;

  @ViewChild('velocity', { static: false }) velocity: VelocityComponent;
  @ViewChild('linearRegression', { static: false }) linearRegression: LinearRegressionComponent;
  @ViewChild('polynomialRegression', { static: false }) polynomialRegression: PolynomialRegressionComponent;

  isLoading = false;

  proyectos: Proyecto[] = [];

  pbis: Pbi[];

  releases: Release[];
  currentRelease: Release;

  deadlineSprint: number = 12;

  constructor(
    private proyectosService: ProyectosService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      this.proyectosService
        .getProyecto(routeParams.id)
        .pipe(untilDestroyed(this))
        .subscribe(proyecto => {
          this.proyecto = proyecto;
          this.actualizarGraficos();
          this.isLoading = false;
        });
    });
  }

  actualizar() {
    // console.log('actualizar');
    this.actualizarGraficos();
  }

  actualizarGraficos() {
    this.proyectosService
      .getProyectoPBIs(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: []) => {
        this.pbis = pbis;
        this.proyectosService
          .getProyectoReleases(this.proyecto.idproyecto)
          .pipe(untilDestroyed(this))
          .subscribe((releases: []) => {
            this.releases = releases;
            this.findCurrentRelease();
            this.velocity.actualizarGrafico(this.proyecto, this.pbis, this.releases, this.currentRelease);
            this.linearRegression.actualizarGrafico(this.proyecto, this.pbis, this.releases, this.currentRelease);
            this.polynomialRegression.actualizarGrafico(this.proyecto, this.pbis, this.releases, this.currentRelease);
          });
      });
  }

  findCurrentRelease() {
    this.releases = this.releases.sort((a: Release, b: Release) => {
      if (a.sprint < b.sprint) return 1;
      else return -1;
    });
    if (this.releases.length > 0) {
      //console.log(this.releases)
      let minSprint: number = Number.MAX_VALUE;
      let minRelease: Release;
      this.releases.forEach((rel: Release) => {
        if (rel.sprint < minSprint && rel.sprint >= this.proyecto.sprintActual) {
          minRelease = rel;
          //console.log(this.proyecto.sprintActual)
        }
      });
      this.currentRelease = minRelease;
    }
  }

  ngOnDestroy() {}
}
