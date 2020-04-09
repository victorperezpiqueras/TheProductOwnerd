import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService, Logger, untilDestroyed } from '@app/core';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RegistroService } from '@app/services/registro-service';
import { environment } from '@env/environment';
import { InvitacionesService } from '@app/services/invitaciones-service';

const log = new Logger('Register');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  registerForm!: FormGroup;
  error: string | undefined;
  isLoading = false;

  invitacionProyecto: string = null;
  showErrorInvitacion: boolean = false;
  showMsgInvitacion: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private registroService: RegistroService,
    private invitacionesService: InvitacionesService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      /* comprobar codigo invitacion */
      if (routeParams.id) {
        this.invitacionProyecto = routeParams.id;
        this.showMsgInvitacion = true;
        this.invitacionesService.obtenerInvitacion(this.invitacionProyecto).subscribe((res: any) => {
          if (res == null) this.showErrorInvitacion = true;
        });
      }
      console.log(this.invitacionProyecto);
      this.isLoading = false;
    });
  }

  register() {
    this.isLoading = true;

    const nick = this.registerForm.value.username;
    const name = this.registerForm.value.name;
    const surname1 = this.registerForm.value.surname1;
    const surname2 = this.registerForm.value.surname2;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    console.log(this.invitacionProyecto);
    if (this.invitacionProyecto == null) {
      this.registroService
        .registrar({
          nick: nick,
          nombre: name,
          apellido1: surname1,
          apellido2: surname2,
          email: email,
          password: password
        })
        .pipe(
          finalize(() => {
            this.registerForm.markAsPristine();
            this.isLoading = false;
          }),
          untilDestroyed(this)
        )
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate(['/login'], { replaceUrl: true });
          },
          error => {
            console.log(error);
            this.error = error.error.error;
          }
        );
    } else {
      this.registroService
        .registrarPorInvitacion({
          token: this.invitacionProyecto,
          nick: nick,
          nombre: name,
          apellido1: surname1,
          apellido2: surname2,
          email: email,
          password: password
        })
        .pipe(
          finalize(() => {
            this.registerForm.markAsPristine();
            this.isLoading = false;
          }),
          untilDestroyed(this)
        )
        .subscribe(
          data => {
            this.router.navigate(['/login'], { replaceUrl: true });
          },
          error => {
            console.log(error);
            this.error = error.error.error;
          }
        );
    }
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname1: ['', Validators.required],
      surname2: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy() {}
}
