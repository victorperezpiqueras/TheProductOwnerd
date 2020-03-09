import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { Comentario } from '@app/models/comentarios';
import { PbisService } from '@app/services/pbis-service';
import { ComentariosService } from '@app/services/comentarios-service';
import { CredentialsService } from '@app/core';
import { ArchivosService } from '@app/services/archivos-service';
import { Archivo } from '@app/models/archivos';
import { DomSanitizer } from '@angular/platform-browser';
import { Permisos } from '@app/models/permisos';
import { Criterio } from '@app/models/criterios';
import { CriteriosService } from '@app/services/criterios-service';
import { DependenciasService } from '@app/services/dependencias-service';
import { Dependencia } from '@app/models/dependencias';

@Component({
  selector: 'app-confirmDialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  dialogRefConfirm: MatDialogRef<any>;
  dialogMode: string;
  descripcion: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.dialogMode = data.dialogMode;
    this.descripcion = data.descripcion;
  }

  ngOnInit() {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500 //miliseconds
    });
  }

  save() {
    this.dialogRef.close({
      remove: true
    });
    //show snackbar on success:
    if (this.dialogMode == 'Acceptance Criteria')
      this.openSnackBar('Acceptance criteria removed successfully', 'Close');
    else if (this.dialogMode == 'File') this.openSnackBar('File removed successfully', 'Close');
  }

  close() {
    this.dialogRef.close();
  }
}
