import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import * as Highcharts from 'highcharts';
import { Release } from '@app/models/releases';

/**
 * @description Interface de los graficos Highchart que implementa las variables y metodos
 * de generacion de datos y visualizacion
 */
export interface Grafico {
  /**
   * Controlador para el grafico
   */
  Highcharts: typeof Highcharts;

  /**
   * Opciones para el grafico
   */
  chartOptions: Highcharts.Options;

  /**
   * Actualiza el grafico generando los ejes por label y creando las opciones del grafico y valores
   * @param {Proyecto} proyecto contiene los datos del proyecto
   * @param {Pbi[]} pbis contiene los datos de los pbis
   * @param {Release[]} releases contiene los datos de las releases
   * @param {Release} currentRelease contiene los datos de la release mas cercana
   */
  actualizarGrafico(proyecto: Proyecto, pbis: Pbi[], releases: Release[], currentRelease: Release): void;

  /**
   * Genera las listas de datos que se presentaran en el grafico
   */
  generarDatos(): void;

  /**
   * Genera la configuracion de opciones del grafico
   */
  generarGrafico(): void;
}
