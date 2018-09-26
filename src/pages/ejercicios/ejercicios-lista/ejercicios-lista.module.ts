import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EjerciciosListaPage } from './ejercicios-lista';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    EjerciciosListaPage,
  ],
  imports: [
    IonicPageModule.forChild(EjerciciosListaPage),
    PipesModule
  ],
})
export class EjerciciosListaPageModule {}
