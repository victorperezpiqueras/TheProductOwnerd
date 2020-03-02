import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';

@Component({
  selector: 'app-pbiDialog',
  templateUrl: './pbiDialog.component.html',
  styleUrls: ['./pbiDialog.component.scss']
})
export class PbiDialogComponent implements OnInit {
  form: FormGroup;

  titulo: string;
  descripcion: string;
  done: number;
  label: string;
  estimacion: number;
  idproyecto: string;
  prioridad: number;

  dialogMode: string;

  labels: String[] = ['feature', 'bug', 'tech-debt', 'infrastructre'];
  fibonacci: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 40];

  constructor(
    public dialogRef: MatDialogRef<PbiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {
    if (data.dialogMode == 'create') {
      this.dialogMode = 'Create new PBI';
    } else if (data.dialogMode == 'edit') {
      this.dialogMode = 'Edit';
    }
    console.log(data.pbi);
    this.titulo = data.pbi.titulo;
    this.descripcion = data.pbi.descripcion;
    this.done = data.pbi.done;
    this.label = data.pbi.label;
    this.estimacion = data.pbi.estimacion;
    /*  this.idproyecto = data.pbi.idproyecto; */
    this.prioridad = data.pbi.prioridad;

    this.fibonacci.unshift(this.estimacion);
  }

  ngOnInit() {}

  filled(): boolean {
    console.log(this.titulo);
    var titulo = this.titulo && this.titulo.length > 0;
    var done = this.done != null;
    var label = this.label && this.label.length > 0;
    /* var estimacion=this.estimacion; */
    var prioridad = this.prioridad != null;
    return titulo && done && label && prioridad;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500 //miliseconds
    });
  }

  save() {
    this.dialogRef.close({
      //proyecto: new Proyecto(null, this.name, this.descripcion, [])
    });
    //show snackbar on success:
    if (this.dialogMode == 'edit') this.openSnackBar('PBI edited successfully', 'Close');
    else if (this.dialogMode == 'create') this.openSnackBar('PBI created successfully', 'Close');
  }

  close() {
    this.dialogRef.close();
  }

  markDone() {
    if (this.done == 1) this.done = 0;
    else this.done = 1;
  }
}
