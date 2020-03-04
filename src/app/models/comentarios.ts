export class Comentario {
  constructor(
    public idcomentario: number,
    public comentario: string,
    public idpbi: number,
    public idusuario: number,
    public nombre: string, //usuario
    public fecha: Date
  ) {}
}
