import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UsuariosService } from '@app/services/usuarios-service';
import { CredentialsService } from '@app/core';
import { Proyecto } from '@app/models/proyectos';
import { ProyectosService } from '@app/services/proyectos-service';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Usuario } from '@app/models/usuarios';
import { MatSnackBar } from '@angular/material';

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
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.params.subscribe(routeParams => {
      this.usuariosService.getUsuario(routeParams.id).subscribe(usuario => {
        this.usuario = usuario;
        /*         this.repeatPassword = this.usuario.password; */
        /* this.myForm.get('password').setValue(this.usuario.password);
        this.myForm.get('confirmPassword').setValue(this.usuario.password); */
        console.log(usuario);
        this.isLoading = false;
        console.log(this.myForm.get('confirmPassword').value);
      });
    });
  }

  actualizarUsuario() {
    /* if (this.myForm.get('password').value == this.myForm.get('confirmPassword').value && this.myForm.get('password').value.length > 8) { */
    if (this.checkPasswordOk()) {
      this.isLoading = true;
      this.usuario.password = this.myForm.get('password').value;
      this.usuariosService.actualizarUsuario(this.usuario).subscribe(data => {
        this.myForm.get('password').setValue('');
        this.myForm.get('password').markAsPristine();
        this.myForm.get('password').markAsUntouched();
        this.myForm.get('password').updateValueAndValidity();

        this.myForm.get('confirmPassword').setValue('');
        this.myForm.get('confirmPassword').markAsPristine();
        this.myForm.get('confirmPassword').markAsUntouched();
        this.myForm.get('confirmPassword').updateValueAndValidity();

        this.isLoading = false;
        this.openSnackBar('Account edited successfully', 'Close');
        console.log(data);
      });
    }
  }

  checkPasswordOk() {
    if (
      this.myForm.get('password').value &&
      this.myForm.get('password').value.length >= 8 &&
      this.myForm.get('confirmPassword').value &&
      this.myForm.get('confirmPassword').value.length >= 8 &&
      this.myForm.get('password').value == this.myForm.get('confirmPassword').value
    )
      return true;
    else if (!this.myForm.get('password').value && !this.myForm.get('confirmPassword').value) return true;
    else return false;
  }

  errorLength(st: string) {
    if (this.myForm.get(st).value.length < 8 || this.myForm.get(st).value === null) return true;
  }

  errorSame() {
    if (this.myForm.get('password').value != this.myForm.get('confirmPassword').value) return true;
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    var error = {
      notSame: false,
      min: false
    };
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500 //miliseconds
    });
  }

  ngOnDestroy() {}
}
