import * as Highcharts from 'highcharts';
import { ProyectoData } from './proyectoData.interface';

/**
 * @description Interface de los graficos Highchart que implementa las variables y metodos
 * de generacion de datos y visualizacion
 */
export interface GraficoComparer {
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
   */
  actualizarGrafico(proyectos: ProyectoData[]): void;

  /**
   * Genera las listas de datos que se presentaran en el grafico
   */
  generarDatos(): void;

  /**
   * Genera la configuracion de opciones del grafico
   */
  generarGrafico(): void;
}
