import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthenticationService, CredentialsService, I18nService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { UsuariosService } from '@app/services/usuarios.service';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { ProyectoDialogComponent } from '@app/proyectos/proyectoDialog/proyectoDialog.component';
import { FavoritosDialogComponent } from './favoritosDialog/favoritosDialog.component';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  isLoading = false;

  proyectosFavoritos: any[] = [];
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
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    /* var favoritos = localStorage.getItem('proyectosFavoritos');
    if (favoritos) this.proyectosFavoritos = JSON.parse(favoritos); */
    this.usuariosService
      .getUsuarioProyectosFavoritos(this.idusuario)
      .pipe(untilDestroyed(this))
      .subscribe(proyectosFavoritos => {
        this.proyectosFavoritos = proyectosFavoritos;
      });
  }

  proyectoSeleccionado(proyecto: Proyecto) {
    // console.log(proyecto);
    this.proyecto = proyecto;
    this.proyectosService.proyecto = proyecto;
  }

  agregarFavorito() {
    this.usuariosService.getUsuarioProyectos(this.idusuario).subscribe(proyectos => {
      for (var proy of proyectos) {
        for (var fav of this.proyectosFavoritos) {
          if (proy.idproyecto === fav.idproyecto) {
            proy.fav = true;
            break;
          } else {
            proy.fav = false;
          }
        }
        proy.oldFav = proy.fav;
      }
      // console.log(this.proyectosFavoritos);
      // console.log(proyectos);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.width = '300px';
      dialogConfig.data = {
        proyectos: proyectos
      };
      this.dialogRef = this.dialog.open(FavoritosDialogComponent, dialogConfig);
      this.dialogRef.afterClosed().subscribe(data => {
        if (data != undefined) {
          const favoritos = data.proyectos; /* .filter((proy: any) => proy.fav);console.log(favoritos) */
          /*  localStorage.setItem('proyectosFavoritos', JSON.stringify(favoritos)); */
          var posts: Observable<any>[] = [];
          favoritos.forEach((proyectoFavorito: any) => {
            const hasChanged: boolean = proyectoFavorito.oldFav !== proyectoFavorito.fav;
            // si ha cambiado y no es favorito --> borrar
            if (hasChanged && proyectoFavorito.fav === false) {
              posts.push(
                this.usuariosService.eliminarUsuarioProyectosFavoritos(this.idusuario, proyectoFavorito.idproyecto)
              );
            }
            //si ha cambiado y es favorito --> agregar
            else if (hasChanged && proyectoFavorito.fav === true) {
              posts.push(
                this.usuariosService.agregarUsuarioProyectosFavoritos(this.idusuario, proyectoFavorito.idproyecto)
              );
            } /* console.log(proyectoFavorito.idproyecto) */
          });
          // enviar todos y cargar nuevos favoritos:
          forkJoin(posts)
            .pipe(untilDestroyed(this))
            .subscribe(results => {
              this.cargarFavoritos();
            });
        }
      });
    });
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
      console.log(this.credentialsService.credentials);
    });
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
}
