import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { FormsModule } from '../../node_modules/@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//SERVICIOS
import { CodigoService } from '../services/codigo/codigo.service';
import { EjerciciosService } from '../services/ejercicios/ejercicios.service';
import { AuthService } from '../services/auth/auth.service';

//INTERCEPTORES
import { TokenInterceptor } from '../services/auth/token.interceptor';
import { JwtInterceptor } from '../services/auth/jwt.interceptor';

@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    CodigoService,
    EjerciciosService,
    AuthService
  ]
})
export class AppModule {}
