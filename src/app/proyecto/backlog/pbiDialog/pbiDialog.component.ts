import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
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
  acceptanceCriteria: string;
  done: number;
  label: string;
  estimacion: number;
  valor: number;
  idproyecto: number;
  prioridad: number;

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
    private sanitizer: DomSanitizer
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
      console.log(dependencias);
      this.dependencias = dependencias;
      console.log(this.pbis);
      this.notSelectedPbis = [...this.pbis];
      //borrar los pbis que ya estan puestos
      for (var d of this.dependencias) {
        console.log(d);
        var p = false;
        var pbi1;
        this.notSelectedPbis.forEach((pbi: any) => {
          if (pbi.idpbi == d.idpbi2) {
            p = true;
            pbi1 = pbi;
          }
        });
        console.log(p);
        if (p) {
          const index: number = this.notSelectedPbis.indexOf(pbi1);
          console.log(index);
          if (index !== -1) {
            this.notSelectedPbis.splice(index, 1);
          }
        }
      }
      console.log(this.notSelectedPbis);
      this.isLoading = false;
    });
  }
  actualizarDependencia() {
    console.log('actualizardep');
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

  /* existeDependencia(pbi: Pbi) {
    var existe = false;
    this.dependencias.forEach((dep: any) => {
      if (dep.idpbi2 == pbi.idpbi) existe = true;
    });
    return existe;
    // return this.dependencias.find((dep: any) => { dep.idpbi2 == pbi.idpbi }); 
  } 
  */

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
      console.log(res);
      this.actualizarCriterios();
    });
  }
  actualizarCriterio(criterio: Criterio) {
    console.log(criterio);
    this.criteriosService.actualizarCriterio(criterio).subscribe((res: any) => {
      this.actualizarCriterios();
    });
  }
  borrarCriterio(criterio: Criterio) {
    console.log(criterio);
    this.criteriosService.borrarCriterio(criterio.idcriterio).subscribe((res: any) => {
      this.actualizarCriterios();
    });
  }

  /* COMENTARIOS */
  actualizarComentarios() {
    this.isLoading = true;
    this.pbisService.obtenerComentarios(this.idpbi).subscribe((comentarios: Comentario[]) => {
      //  console.log(comentarios);
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
    this.pbisService.obtenerArchivos(this.idpbi).subscribe((archivos: Archivo[]) => {
      //  console.log(archivos);
      this.archivos = archivos;
      this.archivos.forEach(archivo => {
        // console.log(archivo);

        var fileType = this.getFileType(archivo);

        archivo.nombre += fileType.ending;
        //archivo.src = Buffer.from(archivo.src, 'base64').toString();

        var blob = new Blob([archivo.src, { type: fileType.format }]);
        var array = new Array<Blob>();
        array.push(blob);
        blob = new File(array, archivo.nombre, { type: fileType.format });

        /*  console.log(fileType);
         console.log(archivo);
         console.log(blob); */
        archivo.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      });

      this.isLoading = false;
    });
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
    var D = date.getDay();
    var M = date.getMonth();
    var Y = date.getFullYear();

    if (M == 1) M = 'Jan';
    else if (M == 2) M = 'Feb';
    else if (M == 3) M = 'Mar';
    else if (M == 4) M = 'Apr';
    else if (M == 5) M = 'May';
    else if (M == 6) M = 'Jun';
    else if (M == 7) M = 'Jul';
    else if (M == 8) M = 'Aug';
    else if (M == 9) M = 'Sep';
    else if (M == 10) M = 'Oct';
    else if (M == 11) M = 'Nov';
    else if (M == 12) M = 'Dec';
    return h + ':' + m + ' - ' + D + ' ' + M + ' of ' + Y;
  }

  onFileSelected(event: any) {
    this.archivoSrcData = event.target.files[0];
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
    let checkFileType = Buffer.from(file.src, 'base64').toString();
    checkFileType = checkFileType.split(':').pop();
    //console.log(checkFileType);
    if (checkFileType.includes('image/png')) return { format: 'image/png', ending: '.png' };
    else if (checkFileType.includes('image/png')) return { format: 'application/pdf', ending: '.pdf' };
    else {
      return { format: 'image/png', ending: '.png' };
    }
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
