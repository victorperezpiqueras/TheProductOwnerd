import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { LoginModule } from './login/login.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HolaMundoService } from './hola-mundo-service/hola-mundo-service.service';
import { LoginService } from './services/login-service';
import { ProyectosModule } from './proyectos/proyectos.module';
import { UsuariosService } from './services/usuarios-service';
import { ProyectosService } from './services/proyectos-service';
import { ProyectoDialogComponent } from './proyectos/proyectoDialog/proyectoDialog.component';
import { ProyectoModule } from './proyecto/proyecto.module';
import { FavoritosDialogComponent } from './shell/header/favoritosDialog/favoritosDialog.component';
import { PbiDialogComponent } from './proyecto/backlog/pbiDialog/pbiDialog.component';
import { PbisService } from './services/pbis-service';
import { TruncatePipe } from './shared/truncatePipe/truncatePipe';
import { TruncatePipeModule } from './shared/truncatePipe/truncatePipe.module';
import { ArchivosService } from './services/archivos-service';
import { CriteriosService } from './services/criterios-service';
import { DependenciasService } from './services/dependencias-service';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,

    DragDropModule,

    CoreModule,
    SharedModule,
    ShellModule,

    TruncatePipeModule,

    HomeModule,
    LoginModule,
    ProyectosModule,
    ProyectoModule,

    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent, ProyectoDialogComponent, FavoritosDialogComponent, PbiDialogComponent],
  providers: [
    HolaMundoService,
    LoginService,
    UsuariosService,
    ProyectosService,
    PbisService,
    ArchivosService,
    CriteriosService,
    DependenciasService
  ],
  entryComponents: [ProyectoDialogComponent, FavoritosDialogComponent, PbiDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
