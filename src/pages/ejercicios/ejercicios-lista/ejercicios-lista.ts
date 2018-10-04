import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { Ejercicios } from '../../../models/ejercicios';
import { EjerciciosService } from '../../../services/ejercicios/ejercicios.service';
import { AuthService } from '../../../services/auth/auth.service';


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
              private auth: AuthService,
              private _ejercicios: EjerciciosService,
              private _alert: AlertController,
              private _modal: ModalController,
              private _popover: PopoverController) {
    this.ejercicios = [];
  }

  ionViewDidLoad() {

    const concursante: any = JSON.parse(localStorage.getItem('USER_APP')).concursante;
    const {cod_categoria, usuario} = concursante;
    this._ejercicios.buscarEstado(usuario, cod_categoria).toPromise()
    .then((data: any) => {
      if (data.length != 0) {
        this.navCtrl.setRoot('EjerciciosDetallePage', {ejercicio: data[0], mensaje: 'reanudar'});
      } else {

        this.fetchEjerciciosByDificultad("3", "2", cod_categoria, usuario);
        this.fetchEjerciciosByDificultad("2", "3", cod_categoria, usuario);
        this.fetchEjerciciosByDificultad("1", "5", cod_categoria, usuario);
      }
    })

  }

  async fetchEjerciciosByDificultad(grado_difiucultad, cantidad, cod_categoria, usuario) {
    await this._ejercicios.getAllByDificultad(grado_difiucultad, cantidad, cod_categoria, usuario).toPromise()
    .then((data: any) => {
        data.forEach((item) => {
          this.ejercicios.push(item);
        })
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
    //CUANDO SE CIERRA EL POPOVER
    popover.onDidDismiss((data) => {
      if (data) {

        if (data.texto === 'salir') {
          this.navCtrl.setRoot('InicioPage');
        }

      }
    })
  }

  botonReeleccion() {
    this.openModal("Estas seguro que deseas cambiar este ejercicio?", 'reeleccion');
  }

  botonVerEjercicio(eje: Ejercicios) {
    this.openModal("Estas seguro de ver este ejercicio?", 'ver' ,eje);
  }

  openModal(mensaje, tipo, eje?: Ejercicios) {
    let modal = this._modal.create('ModalConfirmacionPage',
      { mensaje: mensaje },
      {  cssClass: 'inset-modal' });

    modal.present();

    modal.onWillDismiss((value) => {

      if (!value) return;

      if (tipo == "ver") {
        this.navCtrl.setRoot("EjerciciosDetallePage", {ejercicio: eje});
      } else if (tipo == "reeleccion") {
        console.log('reeleccion');
      }


    })
  }

  reeleccion() {
    console.log("Reeleccion")
  }

  /*ionViewCanEnter() {
    return this.auth.authenticated();
  }*/

}
