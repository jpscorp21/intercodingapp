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

  ejercicios: Ejercicios[] = [];
  source: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _ejercicios: EjerciciosService,
              private _alert: AlertController,
              private _modal: ModalController,
              private _popover: PopoverController) {
  }

  ionViewDidLoad() {

    this.iniciarEjercicios();

  }

  async fetchEjerciciosByDificultad(grado_difiucultad, cantidad, cod_categoria, usuario) {
    await this._ejercicios.getAllByDificultad(grado_difiucultad, cantidad, cod_categoria, usuario).toPromise()
    .then((data: any) => {
        if (data) {
          data.forEach((item) => {
            this.ejercicios.push(item);
          })
        }
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

  botonVerEjercicio(eje: Ejercicios) {
    this.openModal("Estas seguro de ver este ejercicio?", eje);
  }

  openModal(mensaje, eje?: Ejercicios) {
    let modal = this._modal.create('ModalConfirmacionPage',
      { mensaje: mensaje },
      {  cssClass: 'inset-modal' });

    modal.present();

    modal.onWillDismiss((value) => {

      if (!value) return;

      this.navCtrl.setRoot("EjerciciosDetallePage", {ejercicio: eje});

    })
  }

  reeleccion() {
    console.log("Reeleccion")
  }

  async iniciarEjercicios() {

    if (!JSON.parse(localStorage.getItem('USER_APP'))) {
      this.navCtrl.setRoot('LoginPage');
      return;
    }

    const concursante: any = JSON.parse(localStorage.getItem('USER_APP')).concursante;

    const {cod_categoria, usuario} = concursante;

    this._ejercicios.buscarEstado(usuario, cod_categoria).toPromise()
    .then(async (data: any) => {
      if (data.length != 0) {
        console.log(data);
        this.navCtrl.setRoot('EjerciciosDetallePage', {ejercicio: data[0], mensaje: 'reanudar'});
      } else {

        //Operaciones asincronas
        await this.fetchEjerciciosByDificultad("3", "2", cod_categoria, usuario);
        await this.fetchEjerciciosByDificultad("2", "3", cod_categoria, usuario);
        await this.fetchEjerciciosByDificultad("1", "5", cod_categoria, usuario);
      }
    })
  }

}
