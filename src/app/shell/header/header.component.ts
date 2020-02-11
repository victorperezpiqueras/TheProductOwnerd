import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthenticationService, CredentialsService, I18nService } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { UsuariosService } from '@app/services/usuarios-service';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { ProyectoDialogComponent } from '@app/proyectos/proyectoDialog/proyectoDialog.component';
import { FavoritosDialogComponent } from './favoritosDialog/favoritosDialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  proyectosFavoritos: Proyecto[] = [];
  proyecto: Proyecto;
  dialogRef: MatDialogRef<any>;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    /* this.usuariosService.getUsuariosProyectos(this.idusuario).subscribe(proyectos => {
      this.proyectosFavoritos = proyectos;
    }); */
    //this.proyectosFavoritos
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    var favoritos = localStorage.getItem('proyectosFavoritos');
    if (favoritos) this.proyectosFavoritos = JSON.parse(favoritos);
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }

  ngOnDestroy() {
    //if(this.proyecto)this.proyectosService.proyecto=this.proyecto;
  }
  proyectoSeleccionado(proyecto: Proyecto) {
    console.log(proyecto);
    this.proyecto = proyecto;
    this.proyectosService.proyecto = proyecto;
  }

  agregarFavorito() {
    //var proyectos;
    this.usuariosService.getUsuariosProyectos(this.idusuario).subscribe(proyectos => {
      for (var proy of proyectos) {
        for (var fav of this.proyectosFavoritos) {
          if (proy.idproyecto == fav.idproyecto) {
            proy.fav = true;
            break;
          } else {
            proy.fav = false;
          }
        }
      }
      console.log(this.proyectosFavoritos);
      console.log(proyectos);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        //favoritos: this.proyectosFavoritos,
        proyectos: proyectos
      };
      this.dialogRef = this.dialog.open(FavoritosDialogComponent, dialogConfig);
      this.dialogRef.afterClosed().subscribe(data => {
        if (data != undefined) {
          var favoritos = data.proyectos.filter((proy: any) => proy.fav);
          localStorage.setItem('proyectosFavoritos', JSON.stringify(favoritos));
          this.cargarFavoritos();
        }
      });
    });
  }
}
