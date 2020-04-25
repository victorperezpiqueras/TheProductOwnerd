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

  deadlineSprint: number = 12;

  constructor(
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

  actualizarGraficos() {
    this.proyectosService
      .getProyectosPBI(this.proyecto.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe((pbis: []) => {
        this.pbis = pbis;
        this.velocity.actualizarGrafico(this.proyecto, this.pbis);
        this.linearRegression.actualizarGrafico(this.proyecto, this.pbis);
        this.polynomialRegression.actualizarGrafico(this.proyecto, this.pbis);
      });
  }

  ngOnDestroy() {}
}
