import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios.service';
import { CredentialsService, untilDestroyed } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos.service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Usuario } from '@app/models/usuarios';
import { MatSnackBar } from '@angular/material';
import { LoginService } from '@app/services/login.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit, OnDestroy {
  isLoading = false;
  usuario: Usuario;

  /*  password: string;
   repeatPassword: string; */

  myForm: FormGroup;
  myForm2: FormGroup;
  /* errorPasswordMissmatch: string; */

  buttonDisabled: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private usuariosService: UsuariosService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = this.formBuilder.group(
      {
        nick: ['', [Validators.required]],
        email: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apellido1: ['', [Validators.required]],
        apellido2: ['', [Validators.required]]
        /*  password: ['', [Validators.required]],
         newPassword: ['', [Validators.required]],
         confirmNewPassword: ['', [Validators.required]] */
      } /* ,
      { validator: this.checkPasswords } */
    );
    this.myForm2 = this.formBuilder.group(
      {
        /*   nick: ['', [Validators.required]],
          email: ['', [Validators.required]],
          nombre: ['', [Validators.required]],
          apellido1: ['', [Validators.required]],
          apellido2: ['', [Validators.required]], */
        password: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit() {
    this.isLoading = true;
    /*  this.errorPasswordMissmatch = ""; */
    this.activeRoute.params.pipe(untilDestroyed(this)).subscribe(routeParams => {
      /* this.usuariosService.getUsuario(routeParams.id).subscribe(usuario => { */
      this.usuariosService
        .getUsuario(this.idusuario)
        .pipe(untilDestroyed(this))
        .subscribe(usuario => {
          this.usuario = usuario;
          /*         this.repeatPassword = this.usuario.password; */
          /* this.myForm.get('password').setValue(this.usuario.password);
        this.myForm.get('confirmPassword').setValue(this.usuario.password); */
          this.myForm.controls['nick'].setValue(usuario.nick);
          this.myForm.controls['email'].setValue(usuario.email);
          this.myForm.controls['nombre'].setValue(usuario.nombre);
          this.myForm.controls['apellido1'].setValue(usuario.apellido1);
          this.myForm.controls['apellido2'].setValue(usuario.apellido2);

          /*  this.myForm.controls['email'].disable();
           */
          /*  console.log(usuario); */
          this.isLoading = false;
        });
    });
  }

  actualizarUsuario() {
    /* if (this.myForm.get('password').value == this.myForm.get('confirmPassword').value && this.myForm.get('password').value.length > 8) { */
    /*  if (this.checkPasswordOk()) { */
    this.isLoading = true;
    this.usuario.nick = this.myForm.get('nick').value;
    this.usuario.email = this.myForm.get('email').value;
    this.usuario.nombre = this.myForm.get('nombre').value;
    this.usuario.apellido1 = this.myForm.get('apellido1').value;
    this.usuario.apellido2 = this.myForm.get('apellido2').value;
    /*  this.usuario.password = this.myForm.get('password').value; */
    this.usuariosService
      .actualizarUsuario(this.usuario)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          /* actualizar nick de credenciales */
          const cred = {
            username: this.usuario.nick,
            id: this.idusuario,
            token: this.token
          };
          this.credentialsService.setCredentials(cred, true);

          this.isLoading = false;
          this.buttonDisabled = true;
          this.openSnackBar('Account edited successfully!', 'Close');
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
    /* } */
  }

  async actualizarPasswordUsuario() {
    if (this.checkPasswordOk()) {
      this.isLoading = true;
      const credenciales = { email: this.usuario.email, password: this.usuario.password };
      /*  const response = await this.loginService.login(credenciales).toPromise();console.log(response)
       if (response.token && response.token === this.credentialsService.credentials.token) { */
      const oldPassword = this.myForm2.get('password').value;
      const newPassword = this.myForm2.get('newPassword').value;
      //this.usuario.password = newPassword;
      this.usuariosService
        .actualizarUsuarioPassword({
          idusuario: this.usuario.idusuario,
          password: oldPassword,
          newPassword: newPassword
        })
        .pipe(untilDestroyed(this))
        .subscribe(
          data => {
            this.myForm2.get('password').setValue('');
            this.myForm2.get('password').markAsPristine();
            this.myForm2.get('password').markAsUntouched();
            this.myForm2.get('password').updateValueAndValidity();

            this.myForm2.get('newPassword').setValue('');
            this.myForm2.get('newPassword').markAsPristine();
            this.myForm2.get('newPassword').markAsUntouched();
            this.myForm2.get('newPassword').updateValueAndValidity();

            this.myForm2.get('confirmNewPassword').setValue('');
            this.myForm2.get('confirmNewPassword').markAsPristine();
            this.myForm2.get('confirmNewPassword').markAsUntouched();
            this.myForm2.get('confirmNewPassword').updateValueAndValidity();

            /* this.myForm2.reset(); */
            if (data.error && data.error === 'password_missmatch') {
              /*  this.errorPasswordMissmatch = "Password is not correct"; */
              this.openSnackBar('Password is not correct', 'Close');
            } else {
              this.openSnackBar('Password changed successfully!', 'Close');
            }
            this.isLoading = false;
            console.log(data);
          },
          error => {
            console.log(error);
          }
        );
      /*  }
       else if (response.error && response.error === "password_missmatch"){ console.log(response.error);console.log("aaaa")} */
    }
  }

  checkFieldsOk() {
    if (
      this.errorLength('nick', 1) ||
      this.errorLength('email', 1) ||
      this.errorLength('nombre', 1) ||
      this.errorLength('apellido1', 1) ||
      this.errorLength('apellido2', 1)
    )
      return false;
    else return true;
  }

  checkPasswordOk() {
    if (
      this.myForm2.get('password').value &&
      this.myForm2.get('newPassword').value &&
      this.myForm2.get('newPassword').value.length >= 8 &&
      this.myForm2.get('confirmNewPassword').value &&
      this.myForm2.get('confirmNewPassword').value.length >= 8 &&
      this.myForm2.get('newPassword').value == this.myForm2.get('confirmNewPassword').value
    )
      return true;
    /* else if (!this.myForm.get('password').value && !this.myForm.get('confirmPassword').value) return true; */ else
      return false;
  }

  errorLength(st: string, min: number) {
    if (this.myForm.get(st).value.length < min || this.myForm.get(st).value === null) return true;
    else return false;
  }
  errorLength2(st: string, min: number) {
    if (this.myForm2.get(st).value.length < min || this.myForm2.get(st).value === null) return true;
    else return false;
  }

  errorSame() {
    if (this.myForm2.get('newPassword').value != this.myForm2.get('confirmNewPassword').value) return true;
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    var error = {
      notSame: false,
      min: false
    };
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmNewPassword.value;
    if (pass !== confirmPass || pass == null || confirmPass == null) error.notSame = true;
    else if (pass.length < 8 || confirmPass.length < 8) error.min = true;
    /* return pass === confirmPass ? null : { notSame: true } */
    return error;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get idusuario(): number | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.id : null;
  }

  get token(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.token : null;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500 //miliseconds
    });
  }

  switchSaveButton() {
    if (this.buttonDisabled) this.buttonDisabled = false;
  }

  ngOnDestroy() {}
}
