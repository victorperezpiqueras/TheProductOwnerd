export class Pbi {
  constructor(
    public idpbi: number,
    public titulo: string,
    public descripcion: string,
    public done: number,
    public label: string,
    public estimacion: number,
    public valor: number,
    public prioridad: number,
    public sprint: number,
    public idproyecto: number,
    public sprintCreacion: number
  ) {}
}
