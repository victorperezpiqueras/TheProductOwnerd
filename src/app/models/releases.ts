export class Release {
  constructor(
    public idrelease: number,
    public version: string,
    public descripcion: string,
    public sprint: number,
    public idproyecto: number
  ) {}
}
