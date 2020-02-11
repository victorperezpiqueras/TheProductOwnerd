import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';

@Component({
  selector: 'app-favoritosDialog',
  templateUrl: './favoritosDialog.component.html',
  styleUrls: ['./favoritosDialog.component.scss']
})
export class FavoritosDialogComponent implements OnInit {
  form: FormGroup;

  proyectos: [] = [];

  constructor(
    public dialogRef: MatDialogRef<FavoritosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {
    this.proyectos = data.proyectos;
  }

  ngOnInit() {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000 //miliseconds
    });
  }

  toggleFavoritos(proyecto: any) {
    proyecto.fav = !proyecto.fav;
  }

  save() {
    /* var favoritos=[];
    this.proyectos.filter(proy=>proy.fav); */
    this.dialogRef.close({
      proyectos: this.proyectos
    });
    //show snackbar on success:
    this.openSnackBar('Configuración guardada correctamente', 'Cerrar');
  }

  close() {
    this.dialogRef.close();
  }
}
