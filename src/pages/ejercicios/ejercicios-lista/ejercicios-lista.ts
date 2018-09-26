import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { CodigoService } from '../../../services/codigo/codigo.service';
import { Ejercicios } from '../../../models/ejercicios';
import { EjerciciosService } from '../../../services/ejercicios/ejercicios.service';


@IonicPage()
@Component({
  selector: 'page-ejercicios-lista',
  templateUrl: 'ejercicios-lista.html',
})
export class EjerciciosListaPage {

  ejercicios: Ejercicios[];
  source: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _ejercicios: EjerciciosService,
              private _alert: AlertController,
              private _modal: ModalController,
              private _popover: PopoverController) {
    this.ejercicios = [];
  }

  ionViewDidLoad() {
    this.fetchEjercicios();
  }

  fetchEjercicios() {
    this._ejercicios.getAll().subscribe((data: any) => {
      this.ejercicios = data;
    })
  }

  alerta(eje: Ejercicios) {

    let alert = this._alert.create({
      title: 'Mensaje del Sistema',
      message: 'Deseas elegir este ejercicio?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.navCtrl.push('EjerciciosDetallePage', {ejercicio: eje});
          }
        }
      ]
    })

    alert.present();

  }

  //ABRE EL MENU POPOVER
  openPopover(ev) {
    let popover = this._popover.create('EjerciciosPopoverPage');
    popover.present({
      ev: ev,
    })
    console.log('hola');
    //CUANDO SE CIERRA EL POPOVER
    popover.onDidDismiss((data) => {
      if (data) {

        if (data.texto === 'salir') {
          this.navCtrl.setRoot('InicioPage');
        }

      }
    })
  }

  openModal(eje: Ejercicios) {
    let modal = this._modal.create(
      'ModalConfirmacionPage',
      { ejercicios: eje },
      {  cssClass: 'inset-modal' });

    modal.present();
  }


}
