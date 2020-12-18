import { ReleasesService } from './../../../services/releases.service';
import { UsuariosService } from '@app/services/usuarios.service';
import { Component, OnInit, Inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar,
  MatDialog,
  MatDialogConfig,
  MatSort,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { Comentario } from '@app/models/comentarios';
import { PbisService } from '@app/services/pbis.service';
import { ComentariosService } from '@app/services/comentarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { ArchivosService } from '@app/services/archivos.service';
import { Archivo } from '@app/models/archivos';
import { DomSanitizer } from '@angular/platform-browser';
import { Permisos } from '@app/models/permisos';
import { Criterio } from '@app/models/criterios';
import { CriteriosService } from '@app/services/criterios.service';
import { DependenciasService } from '@app/services/dependencias.service';
import { Dependencia } from '@app/models/dependencias';
import { ConfirmDialogComponent } from '@app/shared/confirmDialog/confirmDialog.component';
import { takeUntil } from 'rxjs/operators';
import { Importancia } from '@app/models/importancias';
import { ValoresStakeholdersService } from '@app/services/valoresStakeholders.service';
import { forkJoin, Observable } from 'rxjs';
import { ValorStakeholder } from '@app/models/valoresStakeholders';
import { ProyectosService } from '@app/services/proyectos.service';
import { Release } from '@app/models/releases';

export interface tableValores {
  nick: string;
  valor: number;
}

@Component({
  selector: 'app-pbiDialog',
  templateUrl: './pbiDialog.component.html',
  styleUrls: ['./pbiDialog.component.scss']
  //encapsulation: ViewEncapsulation.None // activar colores en mattooltip
})
export class PbiDialogComponent implements OnInit, OnDestroy {
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
  sprintCreacion: number;
  idrelease: number;

  sprintActual: number;

  /* stakeholder value data */
  valores: ValorStakeholder[] = [];
  valorStakeholder: ValorStakeholder;
  rangoValores: number[] = [0, 1, 2, 3, 4, 5];
  tablaValores: tableValores[] = [];
  displayedColumns: string[] = ['nick', 'valor'];
  /* @ViewChild(MatSort, { static: true }) sort: MatSort; */
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  /* @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; */
  @ViewChild(MatPaginator, { static: false }) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  dataSource: MatTableDataSource<tableValores>;

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

  /* releases data */
  releases: Release[];
  currentRelease: Release;

  dialogMode: string;
  permisos: Permisos;
  pbis: any[];

  labels: String[] = ['feature', 'bug', 'tech-debt', 'infrastructure'];
  fibonacci: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 40];
  labelColor: string;

  disabled: boolean = false;
  uploadFileMode: boolean = false;

  dialogRefConfirm: MatDialogRef<any>;

  saveButtonDisabled: boolean = true;

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
    private valoresService: ValoresStakeholdersService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
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
    // console.log(this.permisos);
    // console.log(data.pbi);
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
    this.sprintCreacion = data.pbi.sprintCreacion;
    this.idrelease = data.pbi.idrelease;

    this.sprintActual = data.sprintActual;

    this.fibonacci.unshift(this.estimacion);
    this.dataSource = new MatTableDataSource(this.tablaValores);
  }

  ngOnInit() {
    /* this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort; */
    this.setColor();
    this.actualizarComentarios();
    this.actualizarArchivos();
    this.actualizarCriterios();
    this.actualizarDependencias();
    this.actualizarValores();
    this.actualizarReleases();
  }

  /* RELEASES */
  actualizarReleases() {
    this.isLoading = true;
    this.proyectosService
      .getProyectoReleases(this.idproyecto)
      .pipe(untilDestroyed(this))
      .subscribe(releases => {
        this.releases = releases;
        this.releases = this.releases.sort((a: Release, b: Release) => {
          if (a.sprint < b.sprint) return 1;
          else return -1;
        });
        this.findCurrentRelease();
        this.isLoading = false;
      });
  }

  findCurrentRelease() {
    if (this.releases.length > 0) {
      let minSprint: number = Number.MAX_VALUE;
      let minRelease: Release;
      this.releases.forEach((rel: Release) => {
        if (rel.sprint < minSprint && rel.sprint >= this.sprintActual) {
          minRelease = rel;
        }
      });
      // console.log(minRelease);
      this.currentRelease = minRelease;
    }
  }

  /* IMPORTANCIAS */
  actualizarValores() {
    this.isLoading = true;
    this.pbisService
      .obtenerValores(this.idpbi)
      .pipe(untilDestroyed(this))
      .subscribe((valores: ValorStakeholder[]) => {
        this.valores = valores;
        if (this.isStakeholder) {
          this.valorStakeholder = this.valores.find((val: ValorStakeholder) => val.idrol === this.permisos.idrol);
          if (!this.valorStakeholder)
            //crear importancia sin valor: -1
            this.valorStakeholder = new ValorStakeholder(null, -1, this.permisos.idrol, this.idpbi);
        }
        if (this.isProductOwner) {
          //console.log(this.valores);
          var peticiones$: Observable<any>[] = [];
          this.valores.forEach((imp: ValorStakeholder) => {
            //hacer forkjoin
            peticiones$.push(this.usuariosService.getUsuarioPorRol(imp.idrol).pipe(untilDestroyed(this)));
          });

          forkJoin(peticiones$)
            .pipe(untilDestroyed(this))
            .subscribe(results => {
              console.log('aaa');
              results.forEach((result: any) => {
                this.valores.forEach((val: ValorStakeholder) => {
                  if (val.valor >= 0) {
                    if (result.idrol === val.idrol) {
                      this.tablaValores.push({ valor: val.valor, nick: result.nick } as tableValores);
                    }
                  }
                });
              });
              console.log(this.tablaValores);
              this.dataSource.data = this.tablaValores;
              this.isLoading = false;
            });
        }
      });
  }
  actualizarValor() {
    this.isLoading = true;
    // si la importancia existe:
    if (this.valorStakeholder.idvalor) {
      //si tiene un valor:
      if (this.valorStakeholder.valor >= 0) {
        this.valoresService
          .editarValor(this.valorStakeholder)
          .pipe(untilDestroyed(this))
          .subscribe((res: any) => {
            this.actualizarValores();
            this.isLoading = false;
          });
      }
      //si no tiene un valor:
      else if (this.valorStakeholder.valor < 0) {
        this.valoresService
          .editarValor(this.valorStakeholder)
          .pipe(untilDestroyed(this))
          .subscribe((res: any) => {
            this.actualizarValores();
            this.isLoading = false;
          });
      }
    }
    //si no existe:
    else {
      this.valoresService
        .crearValor(this.valorStakeholder)
        .pipe(untilDestroyed(this))
        .subscribe((res: any) => {
          this.actualizarValores();
          this.isLoading = false;
        });
    }
  }

  /* DEPENDENCIAS */
  actualizarDependencias() {
    this.isLoading = true;
    this.pbisService
      .obtenerDependencias(this.idpbi)
      .pipe(untilDestroyed(this))
      .subscribe((dependencias: Dependencia[]) => {
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
      this.dependenciasService
        .crearDependencia(dependencia)
        .pipe(untilDestroyed(this))
        .subscribe((res: any) => {
          this.actualizarDependencias();
          this.openSnackBar('Dependency created successfully!', 'Close');
        });
    } else {
      this.dependenciasService
        .borrarDependencia(this.idpbi, this.dependenciaData.idpbi)
        .pipe(untilDestroyed(this))
        .subscribe((res: any) => {
          this.actualizarDependencias();
          this.openSnackBar('Dependency removed successfully!', 'Close');
        });
    }
  }
  borrarDependencia(dep: Dependencia) {
    this.dependenciasService
      .borrarDependencia(dep.idpbi, dep.idpbi2)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.actualizarDependencias();
      });
  }

  /* CRITERIOS */
  actualizarCriterios() {
    this.isLoading = true;
    this.pbisService
      .obtenerCriterios(this.idpbi)
      .pipe(untilDestroyed(this))
      .subscribe((criterios: Criterio[]) => {
        // console.log(criterios);
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
    this.criteriosService
      .crearCriterio(criterio)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.actualizarCriterios();
        this.openSnackBar('Acceptance Criteria created successfully!', 'Close');
      });
  }
  actualizarCriterio(criterio: Criterio) {
    this.criteriosService
      .actualizarCriterio(criterio)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.actualizarCriterios();
        this.openSnackBar('Acceptance Criteria edited successfully!', 'Close');
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
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.isLoading = true;
          this.criteriosService
            .borrarCriterio(criterio.idcriterio)
            .pipe(untilDestroyed(this))
            .subscribe((res: any) => {
              this.actualizarCriterios();
              this.openSnackBar('Acceptance Criteria removed successfully!', 'Close');
              this.isLoading = false;
            });
        }
      });
  }

  /* COMENTARIOS */
  actualizarComentarios() {
    this.isLoading = true;
    this.pbisService
      .obtenerComentarios(this.idpbi)
      .pipe(untilDestroyed(this))
      .subscribe((comentarios: Comentario[]) => {
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
    this.comentariosService
      .crearComentario(comentario)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.actualizarComentarios();
        this.isLoading = false;
        this.comentarioData = '';
        this.openSnackBar('Comment posted successfully!', 'Close');
      });
  }

  /* ARCHIVOS */
  actualizarArchivos() {
    this.isLoading = true;
    this.pbisService
      .obtenerArchivos(this.idpbi)
      .pipe(untilDestroyed(this))
      .subscribe((archivos: any[]) => {
        // console.log(archivos);
        this.archivos = archivos;
        this.archivos.forEach(archivo => {});

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
    // console.log(archivo.src);
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
    this.archivosService
      .crearArchivo(archivo)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.actualizarArchivos();
        this.isLoading = false;
        this.archivoSrcData = '';
        this.archivoNombreData = '';
        this.openSnackBar('File uploaded successfully!', 'Close');
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
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          this.isLoading = true;
          this.archivosService
            .borrarArchivo(archivo.idarchivo)
            .pipe(untilDestroyed(this))
            .subscribe((res: any) => {
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
    this.dialogRefConfirm
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data != undefined) {
          // console.log(data);
          this.done = data.done;
          this.sprint = data.sprint;
          this.saveButtonDisabled = false;
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
    if (this.isStakeholder) this.actualizarValor();
    console.log(this.idrelease);
    this.dialogRef.close({
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
        this.idproyecto,
        this.sprintCreacion,
        this.idrelease
      )
    });
    // console.log(this.dialogMode);
    //show snackbar on success:
    if (this.dialogMode == 'Edit') this.openSnackBar('PBI edited successfully!', 'Close');
    else if (this.dialogMode == 'Create new PBI') this.openSnackBar('PBI created successfully!', 'Close');
  }

  close() {
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

  getFileType(file: any) {
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

  labelFormatter(label: string): string {
    return label.charAt(0).toUpperCase() + label.substring(1);
  }

  changed() {
    this.saveButtonDisabled = false;
  }

  get isStakeholder(): boolean {
    return this.permisos.rol === 'stakeholder';
  }

  get isProductOwner(): boolean {
    return this.permisos.rol === 'productOwner';
  }

  get isCreateMode(): boolean {
    return this.dialogMode === 'Create new PBI';
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }

  ngOnDestroy(): void {}
}
