import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-confirmacion',
  templateUrl: 'modal-confirmacion.html',
})
export class ModalConfirmacionPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalConfirmacionPage');
  }

  aceptar() {
    this._view.dismiss(true)
  }

  cancelar() {
    this._view.dismiss();
  }

}
