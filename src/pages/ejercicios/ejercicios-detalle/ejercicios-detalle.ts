import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Ejercicios } from '../../../models/ejercicios';



@IonicPage()
@Component({
  selector: 'page-ejercicios-detalle',
  templateUrl: 'ejercicios-detalle.html',
})
export class EjerciciosDetallePage {

  ejercicio: Ejercicios;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    console.log(this.navParams.data);




    if (this.navParams.data.ejercicio) {
      this.ejercicio = this.navParams.data.ejercicio;
    } else {
      this.navCtrl.setRoot('EjerciciosListaPage');
    }

  }

  ionViewDidLoad() {}

}
