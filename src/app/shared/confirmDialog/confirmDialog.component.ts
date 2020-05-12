import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { Comentario } from '@app/models/comentarios';
import { PbisService } from '@app/services/pbis.service';
import { ComentariosService } from '@app/services/comentarios.service';
import { CredentialsService } from '@app/core';
import { ArchivosService } from '@app/services/archivos.service';
import { Archivo } from '@app/models/archivos';
import { DomSanitizer } from '@angular/platform-browser';
import { Permisos } from '@app/models/permisos';
import { Criterio } from '@app/models/criterios';
import { CriteriosService } from '@app/services/criterios.service';
import { DependenciasService } from '@app/services/dependencias.service';
import { Dependencia } from '@app/models/dependencias';

@Component({
  selector: 'app-confirmDialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  dialogRefConfirm: MatDialogRef<any>;
  dialogMode: string;
  dialogModeVerbo: string;
  descripcion: string;
  botonConfirm: string;
  sprintActual: number;

  sprint: number = null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.dialogMode = data.dialogMode;
    this.dialogModeVerbo = data.dialogModeVerbo;
    this.descripcion = data.descripcion;
    this.botonConfirm = data.botonConfirm;
    this.sprintActual = data.sprintActual;
    /*   if (this.dialogModeVerbo == 'remove') {
        this.botonConfirm = 'Remove';
      } else if (this.dialogModeVerbo == 'mark as done') this.botonConfirm = 'Mark as Done';
      else if (this.dialogModeVerbo == 'unmark as done') this.botonConfirm = 'Unmark as Done'; */
  }

  ngOnInit() {
    if (this.sprintActual) this.sprint = this.sprintActual;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000 //miliseconds
    });
  }

  save() {
    /* console.log(this.dialogModeVerbo); */
    if (this.dialogModeVerbo == 'remove') {
      this.dialogRef.close({
        remove: true
      });
      if (this.dialogMode == 'Acceptance Criteria')
        this.openSnackBar('Acceptance criteria removed successfully!', 'Close');
      else if (this.dialogMode == 'File') this.openSnackBar('File removed successfully!', 'Close');
    } else if (this.dialogMode == 'PBI') {
      if (this.dialogModeVerbo == 'mark as done') {
        this.dialogRef.close({
          done: 1,
          sprint: this.sprint
        });
        this.openSnackBar('PBI marked as done successfully!', 'Close');
      } else if (this.dialogModeVerbo == 'unmark as done') {
        this.dialogRef.close({
          done: 0,
          sprint: null
        });
        this.openSnackBar('PBI unmarked as done successfully!', 'Close');
      }
    } else if (this.dialogMode == 'User') {
      this.dialogRef.close({
        remove: true
      });
      this.openSnackBar('User kicked from the project!', 'Close');
    } else if (this.dialogMode == 'Sprint') {
      this.dialogRef.close({
        remove: true
      });
      this.openSnackBar('Sprint switched successfully!', 'Close');
    } /* else if (this.dialogMode == 'Deadline') {
      this.dialogRef.close({
        remove: true
      });
      this.openSnackBar('Deadline changed successfully!', 'Close');
    } */
  }

  close() {
    this.dialogRef.close();
  }
}
