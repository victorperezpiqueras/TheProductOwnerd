import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { SprintComparer } from './sprint-comparer.interface';

export interface ProyectoData {
  proyecto: Proyecto;
  pbis: Pbi[];
  sprints: SprintComparer[];
  series: any[];
}
