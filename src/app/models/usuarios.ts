export class Usuario {
  constructor(
    public idusuario: number,
    public nick: string,
    public nombre: string,
    public apellido1: string,
    public apellido2: string,
    public password: string,
    public email: string
  ) {}
}
