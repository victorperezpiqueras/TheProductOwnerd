import { Usuario } from './usuarios';

export class Proyecto {
  constructor(
    public idproyecto: number,
    public nombre: string,
    public descripcion: string,
    public vision: string,
    public sprintActual: number,
    public usuarios: Usuario[]
  ) {}
}
