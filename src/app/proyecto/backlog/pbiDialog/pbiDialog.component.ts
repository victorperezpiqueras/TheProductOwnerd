import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
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
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-pbiDialog',
  templateUrl: './pbiDialog.component.html',
  styleUrls: ['./pbiDialog.component.scss']
})
export class PbiDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  /* pbi data */
  idpbi: number;
  titulo: string;
  descripcion: string;
  acceptanceCriteria: string;
  done: number;
  label: string;
  estimacion: number;
  valor: number;
  idproyecto: number;
  prioridad: number;
  sprint: number;
  sprintActual: number;

  /* archivos data */
  archivos: any[] = [];
  archivoSrcData: any;
  archivoNombreData: string;

  /* comentarios data */
  comentarios: any[] = [];
  comentarioData: string;

  /* criterios data */
  criterios: Criterio[];
  criterioData: string;

  /* dependencias data */
  dependencias: Dependencia[];
  dependenciaData: any;
  notSelectedPbis: any[];

  dialogMode: string;
  permisos: Permisos;
  pbis: any[];

  labels: String[] = ['feature', 'bug', 'tech-debt', 'infrastructure'];
  fibonacci: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 40];
  labelColor: string;

  disabled: boolean = false;
  uploadFileMode: boolean = false;

  dialogRefConfirm: MatDialogRef<any>;

  constructor(
    public dialogRef: MatDialogRef<PbiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private credentialsService: CredentialsService,
    private pbisService: PbisService,
    private comentariosService: ComentariosService,
    private archivosService: ArchivosService,
    private criteriosService: CriteriosService,
    private dependenciasService: DependenciasService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    if (data.dialogMode == 'create') {
      this.dialogMode = 'Create new PBI';
    } else if (data.dialogMode == 'edit') {
      this.dialogMode = 'Edit';
    } else if (data.dialogMode == 'view') {
      this.dialogMode = 'View';
      this.disabled = true;
    }
    this.permisos = data.permisos;
    this.pbis = data.pbis;
    this.notSelectedPbis = [...this.pbis];
    const index: number = this.notSelectedPbis.indexOf(data.pbi);
    if (index !== -1) {
      this.notSelectedPbis.splice(index, 1);
    }

    console.log(data.pbi);
    this.idpbi = data.pbi.idpbi;
    this.titulo = data.pbi.titulo;
    this.descripcion = data.pbi.descripcion;
    this.done = data.pbi.done ? data.pbi.done : 0;
    this.label = data.pbi.label;
    this.estimacion = data.pbi.estimacion;
    this.valor = data.pbi.valor;
    this.idproyecto = data.pbi.idproyecto;
    this.prioridad = data.pbi.prioridad;
    this.sprint = data.pbi.sprint;
    this.sprintActual = data.sprintActual;

    this.fibonacci.unshift(this.estimacion);
  }

  ngOnInit() {
    this.setColor();
    this.actualizarComentarios();
    this.actualizarArchivos();
    this.actualizarCriterios();
    this.actualizarDependencias();
  }

  /* DEPENDENCIAS */
  actualizarDependencias() {
    this.isLoading = true;
    this.pbisService.obtenerDependencias(this.idpbi).subscribe((dependencias: Dependencia[]) => {
      this.dependencias = dependencias;
      this.notSelectedPbis = [...this.pbis];
      //borrar los pbis que ya estan puestos
      for (var d of this.dependencias) {
        var p = false;
        var pbi1;
        this.notSelectedPbis.forEach((pbi: any) => {
          if (pbi.idpbi == d.idpbi2) {
            p = true;
            pbi1 = pbi;
          }
        });
        if (p) {
          const index: number = this.notSelectedPbis.indexOf(pbi1);
          if (index !== -1) {
            this.notSelectedPbis.splice(index, 1);
          }
        }
      }
      this.isLoading = false;
    });
  }
  actualizarDependencia() {
    var existe = false;
    this.dependencias.forEach((dep: any) => {
      if (dep.idpbi2 == this.dependenciaData.idpbi) existe = true;
    });
    if (!existe) {
      var dependencia = {
        idpbi: this.idpbi,
        idpbi2: this.dependenciaData.idpbi
      };
      this.dependenciasService.crearDependencia(dependencia).subscribe((res: any) => {
        this.actualizarDependencias();
      });
    } else {
      this.dependenciasService.borrarDependencia(this.idpbi, this.dependenciaData.idpbi).subscribe((res: any) => {
        this.actualizarDependencias();
      });
    }
  }
  borrarDependencia(dep: Dependencia) {
    this.dependenciasService.borrarDependencia(dep.idpbi, dep.idpbi2).subscribe((res: any) => {
      this.actualizarDependencias();
    });
  }

  /* CRITERIOS */
  actualizarCriterios() {
    this.isLoading = true;
    this.pbisService.obtenerCriterios(this.idpbi).subscribe((criterios: Criterio[]) => {
      console.log(criterios);
      this.criterios = criterios;
      this.isLoading = false;
    });
  }
  crearCriterio() {
    var criterio = {
      done: 0,
      nombre: this.criterioData,
      idpbi: this.idpbi
    };
    this.criterioData = '';
    this.criteriosService.crearCriterio(criterio).subscribe((res: any) => {
      this.actualizarCriterios();
    });
  }
  actualizarCriterio(criterio: Criterio) {
    this.criteriosService.actualizarCriterio(criterio).subscribe((res: any) => {
      this.actualizarCriterios();
    });
  }
  borrarCriterio(criterio: Criterio) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    /*  dialogConfig.height = '800px';
     dialogConfig.width = '1920px'; */
    dialogConfig.data = {
      dialogMode: 'Acceptance Criteria',
      dialogModeVerbo: 'remove',
      descripcion: criterio.nombre,
      botonConfirm: 'Remove'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.isLoading = true;
        this.criteriosService.borrarCriterio(criterio.idcriterio).subscribe((res: any) => {
          this.actualizarCriterios();
          this.isLoading = false;
        });
      }
    });
  }

  /* COMENTARIOS */
  actualizarComentarios() {
    this.isLoading = true;
    this.pbisService.obtenerComentarios(this.idpbi).subscribe((comentarios: Comentario[]) => {
      this.comentarios = comentarios.sort((com1, com2) => {
        if (new Date(com1.fecha) < new Date(com2.fecha)) return -1;
        else return 1;
      });
      /* this.comentarios = comentarios.reverse(); */
      this.isLoading = false;
    });
  }
  crearComentario() {
    this.isLoading = true;
    var comentario = {
      comentario: this.comentarioData,
      idpbi: this.idpbi,
      idusuario: this.idusuario,
      fecha: Date.now()
    };
    this.comentariosService.crearComentario(comentario).subscribe((res: any) => {
      this.actualizarComentarios();
      this.isLoading = false;
      this.comentarioData = '';
      this.openSnackBar('Comment successfully posted', 'Close');
    });
  }

  /* ARCHIVOS */
  actualizarArchivos() {
    this.isLoading = true;
    this.pbisService.obtenerArchivos(this.idpbi).subscribe((archivos: any[]) => {
      console.log(archivos);
      this.archivos = archivos;
      this.archivos.forEach(archivo => {
        console.log(archivo);

        var fileType = this.getFileType(archivo);

        //archivo.nombre += fileType.ending;
        console.log(archivo);

        //archivo.src = Buffer.from(archivo.src, 'base64').toString();

        //var blob = new Blob([archivo.src, { type: fileType.format }]);

        /*  var array = new Array<Blob>();
         array.push(blob);
         blob = new File(array, archivo.nombre, { type: fileType.format }); */

        /*  console.log(fileType);
         console.log(archivo);
         console.log(blob); */

        // archivo.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      });

      this.isLoading = false;
    });
  }

  descargar(archivo: any) {
    //var fileType = this.getFileType(archivo);
    /* archivo.nombre += fileType.ending; */
    //var blob = new Blob([archivo.src, { type: fileType.format }]);
    archivo.src = Buffer.from(archivo.src, 'base64').toString();

    const downloadLink = document.createElement('a');
    const fileName = archivo.nombre;
    console.log(archivo.src);
    downloadLink.href = archivo.src;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  crearArchivo() {
    this.isLoading = true;
    var archivo = {
      nombre: this.archivoNombreData,
      src: this.archivoSrcData,
      idpbi: this.idpbi,
      idusuario: this.idusuario
    };
    //console.log(archivo);
    this.archivosService.crearArchivo(archivo).subscribe((res: any) => {
      this.actualizarArchivos();
      this.isLoading = false;
      this.archivoSrcData = '';
      this.archivoNombreData = '';
      this.openSnackBar('File successfully uploaded', 'Close');
      this.cargarImagen();
    });
  }

  borrarArchivo(archivo: Archivo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      dialogMode: 'File',
      dialogModeVerbo: 'remove',
      descripcion: archivo.nombre,
      botonConfirm: 'Remove'
    };
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.isLoading = true;
        this.archivosService.borrarArchivo(archivo.idarchivo).subscribe((res: any) => {
          this.actualizarArchivos();
          this.isLoading = false;
        });
      }
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    if (this.done == 0) {
      dialogConfig.data = {
        dialogMode: 'PBI',
        dialogModeVerbo: 'mark as done',
        descripcion: this.titulo,
        sprintActual: this.sprintActual,
        botonConfirm: 'Mark as Done'
      };
    } else {
      dialogConfig.data = {
        dialogMode: 'PBI',
        dialogModeVerbo: 'unmark as done',
        descripcion: this.titulo,
        botonConfirm: 'Unmark as Done'
      };
    }
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm.afterClosed().subscribe(data => {
      if (data != undefined) {
        console.log(data);
        this.done = data.done;
        this.sprint = data.sprint;
      }
    });
  }

  setColor() {
    switch (this.label) {
      case 'feature':
        this.labelColor = '#00ad17';
        break;
      case 'bug':
        this.labelColor = '#ad0000';
        break;
      case 'infrastructure':
        this.labelColor = '#2196f3';
        break;
      case 'tech-debt':
        this.labelColor = '#ffbb00';
        break;
      default:
        this.labelColor = '#000000';
    }
  }

  getPbiColor(idpbi: number) {
    var pbi1: any = {};
    // pbi = this.pbis.find((pbi:Pbi) => { pbi.idpbi == idpbi })
    this.pbis.forEach((pbi: any) => {
      if (pbi.idpbi == idpbi) pbi1 = pbi;
    });
    var label = pbi1.label;
    if (label == 'feature') return '#00ad17';
    else if (label == 'tech-debt') return '#ffbb00';
    else if (label == 'bug') return '#ad0000';
    else if (label == 'infrastructure') return '#2196f3';
  }

  getPbiTitulo(idpbi: number) {
    var pbi1: any = {};
    this.pbis.forEach((pbi: any) => {
      if (pbi.idpbi == idpbi) pbi1 = pbi;
    });
    return pbi1.titulo;
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
    /* console.log(new Pbi(
    this.idpbi,
    this.titulo,
    this.descripcion,
    this.done,
    this.label,
    this.estimacion,
    this.valor,
    this.prioridad,
    this.sprint,
    this.idproyecto
  )) */
    this.dialogRef.close({
      //proyecto: new Proyecto(null, this.name, this.descripcion, [])
      pbi: new Pbi(
        this.idpbi,
        this.titulo,
        this.descripcion,
        this.done,
        this.label,
        this.estimacion,
        this.valor,
        this.prioridad,
        this.sprint,
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

  prettifier(date: any) {
    date = new Date(date);
    var h = date.getHours();
    var m = date.getMinutes();
    var D = date.getDate();
    var M = date.getMonth();
    var Y = date.getFullYear();

    if (M == 0) M = 'Jan';
    else if (M == 1) M = 'Feb';
    else if (M == 2) M = 'Mar';
    else if (M == 3) M = 'Apr';
    else if (M == 4) M = 'May';
    else if (M == 5) M = 'Jun';
    else if (M == 6) M = 'Jul';
    else if (M == 7) M = 'Aug';
    else if (M == 8) M = 'Sep';
    else if (M == 9) M = 'Oct';
    else if (M == 10) M = 'Nov';
    else if (M == 11) M = 'Dec';
    return h + ':' + m + ' - ' + D + ' ' + M + ' of ' + Y;
  }

  onFileSelected(event: any) {
    this.archivoSrcData = event.target.files[0];
    this.archivoNombreData = event.target.files[0].name;
    //console.log(this.archivoSrcData);
    const reader = (file: any) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });
    };
    reader(this.archivoSrcData).then(result => {
      // console.log(result);
      this.archivoSrcData = result;
    });
  }

  cargarImagen() {
    this.uploadFileMode = !this.uploadFileMode;
  }

  download(archivo: any) {
    /*  window.location.href = archivo.src; */
    var blob = new Blob([archivo.src]);
    archivo.src = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    //window.open(url);
  }

  getFileType(file: any) {
    /*  let checkFileType = Buffer.from(file.src, 'base64').toString();
    checkFileType = checkFileType.split(':').pop(); */
    //console.log(checkFileType);
    /* if (checkFileType.includes('image/png')) return { format: 'image/png', ending: '.png' };
    else if (checkFileType.includes('application/pdf')) return { format: 'application/pdf', ending: '.pdf' };
    else {
      return { format: 'image/png', ending: '.png' };
    } */
    let checkFileType = file.nombre;
    /* imagenes */
    if (checkFileType.endsWith('.png')) return { format: 'image/png', ending: '.png' };
    else if (checkFileType.endsWith('.jpg')) return { format: 'image/jpg', ending: '.jpg' };
    else if (checkFileType.endsWith('.bmp')) return { format: 'image/bmp', ending: '.bmp' };
    else if (checkFileType.endsWith('.jpeg')) return { format: 'image/jpeg', ending: '.jpeg' };
    /* textos */ else if (checkFileType.endsWith('.json')) return { format: 'application/json', ending: '.json' };
    /* audio */ else if (checkFileType.endsWith('.wav')) return { format: 'audio/wav', ending: '.wav' };
    /* docs */ else if (checkFileType.endsWith('.pdf')) return { format: 'application/pdf', ending: '.pdf' };
    else if (checkFileType.endsWith('.zip')) return { format: 'application/zip', ending: '.zip' };
    else if (checkFileType.endsWith('.7z')) return { format: 'application/x-7z-compressed', ending: '.7z' };
    else {
      return { format: 'text/plain', ending: '.txt' };
    }
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
