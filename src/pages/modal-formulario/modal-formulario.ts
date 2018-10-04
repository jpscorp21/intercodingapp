import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalFormularioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-formulario',
  templateUrl: 'modal-formulario.html',
})
export class ModalFormularioPage {

  public usuario: string = "";
  public password: string = "";
  public accion: string = "";

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

    this.accion = this.navParams.data.accion;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFormularioPage');
  }

  aceptar() {

    if (this.accion == 'consultar') {
      this.viewCtrl.dismiss('DES');
    } else if(this.accion == 'entregar') {
      this.viewCtrl.dismiss('TER');
    }

  }

  cancelar() {
    this.viewCtrl.dismiss();
  }

}
