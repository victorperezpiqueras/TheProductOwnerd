import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit, OnDestroy {
  isLoading = false;
  panelOpenState = false;

  proyectos: Proyecto[] = [];

  displayedColumns: string[] = ['Nombre', 'Rol'];
  dataSource: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    var proyectos$ = this.usuariosService.getUsuariosProyectos(this.idusuario);
    var usuariosTotales$ = this.proyectosService.getProyectosUsuariosRoles();

    forkJoin([proyectos$, usuariosTotales$]).subscribe(results => {
      results[0].forEach((element: any) => {
        var pr = new Proyecto(element.idproyecto, element.nombre, element.descripcion, []);
        this.proyectos.push(pr);
      });

      for (var proy of this.proyectos) {
        for (var user of results[1]) {
          if (user.idproyecto == proy.idproyecto) {
            proy.usuarios.push(user);
            console.log(user);
          }
        }
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy() {}

  /* getUsuarios(proyecto:any){
    this.proyectosService.getProyectosUsuarios(proyecto.idproyecto).subscribe((usuarios)=>{
      console.log(proyectos);
      this.proyectos=proyectos;
      console.log(this.proyectos)
      this.isLoading = false;
    })
  } */

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }
}
