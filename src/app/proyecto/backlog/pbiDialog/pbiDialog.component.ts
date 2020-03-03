import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { Comentario } from '@app/models/comentarios';
import { PbisService } from '@app/services/pbis-service';
import { ComentariosService } from '@app/services/comentarios-service';
import { CredentialsService } from '@app/core';

@Component({
  selector: 'app-pbiDialog',
  templateUrl: './pbiDialog.component.html',
  styleUrls: ['./pbiDialog.component.scss']
})
export class PbiDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  idpbi: number;
  titulo: string;
  descripcion: string;
  done: number;
  label: string;
  estimacion: number;
  idproyecto: number;
  prioridad: number;

  comentarios: any[] = [];

  /* comentarios data */
  comentarioData: string;

  dialogMode: string;

  labels: String[] = ['feature', 'bug', 'tech-debt', 'infrastructre'];
  fibonacci: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 40];
  labelColor: string;

  disabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PbiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private credentialsService: CredentialsService,
    private pbisService: PbisService,
    private comentariosService: ComentariosService
  ) {
    if (data.dialogMode == 'create') {
      this.dialogMode = 'Create new PBI';
    } else if (data.dialogMode == 'edit') {
      this.dialogMode = 'Edit';
    } else if (data.dialogMode == 'view') {
      this.dialogMode = 'View';
      this.disabled = true;
    }
    console.log(data.pbi);
    this.idpbi = data.pbi.idpbi;
    this.titulo = data.pbi.titulo;
    this.descripcion = data.pbi.descripcion;
    this.done = data.pbi.done ? data.pbi.done : 0;
    this.label = data.pbi.label;
    this.estimacion = data.pbi.estimacion;
    this.idproyecto = data.pbi.idproyecto;
    this.prioridad = data.pbi.prioridad;

    this.fibonacci.unshift(this.estimacion);
  }

  ngOnInit() {
    this.setColor();
    this.actualizarComentarios();
  }

  actualizarComentarios() {
    this.isLoading = true;
    this.pbisService.obtenerComentarios(this.idpbi).subscribe((comentarios: Comentario[]) => {
      console.log(comentarios);
      this.comentarios = comentarios;
      this.isLoading = false;
    });
  }

  crearComentario() {
    this.isLoading = true;
    var comentario = {
      comentario: this.comentarioData,
      idpbi: this.idpbi,
      idusuario: this.idusuario
    };
    this.comentariosService.crearComentario(comentario).subscribe((res: any) => {
      this.actualizarComentarios();
      this.isLoading = false;
    });
  }

  filled(): boolean {
    //console.log(this.titulo);
    var titulo = this.titulo && this.titulo.length > 0;
    /* var done = this.done != null; */
    var label = this.label && this.label.length > 0;
    /* var estimacion=this.estimacion; */
    return titulo && label;
  }

  markDone() {
    if (this.done == 1) this.done = 0;
    else this.done = 1;
  }

  setColor() {
    switch (this.label) {
      case 'feature':
        this.labelColor = '#00ad17';
        break;
      case 'bug':
        this.labelColor = '#ad0000';
        break;
      case 'infrastructre':
        this.labelColor = '#2196f3';
        break;
      case 'tech-debt':
        this.labelColor = '#ffbb00';
        break;
      default:
        this.labelColor = '#000000';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500 //miliseconds
    });
  }

  checkDone() {
    if (this.done == 1) return true;
    else return false;
  }

  save() {
    this.dialogRef.close({
      //proyecto: new Proyecto(null, this.name, this.descripcion, [])
      pbi: new Pbi(
        this.idpbi,
        this.titulo,
        this.descripcion,
        this.done,
        this.label,
        this.estimacion,
        this.prioridad,
        this.idproyecto
      )
    });
    //show snackbar on success:
    if (this.dialogMode == 'edit') this.openSnackBar('PBI edited successfully', 'Close');
    else if (this.dialogMode == 'create') this.openSnackBar('PBI created successfully', 'Close');
  }

  close() {
    console.log();
    this.dialogRef.close();
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
