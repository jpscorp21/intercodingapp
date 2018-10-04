import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { Ejercicios } from '../../../models/ejercicios';
import { EjerciciosService } from '../../../services/ejercicios/ejercicios.service';
import { AuthService } from '../../../services/auth/auth.service';
import { StaffService } from '../../../services/staff/staff.service';

@IonicPage()
@Component({
  selector: 'page-ejercicios-detalle',
  templateUrl: 'ejercicios-detalle.html',
})
export class EjerciciosDetallePage {

  ejercicio: Ejercicios;
  iniciado: boolean = false;
  estado: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthService,
              private _popover: PopoverController,
              private _modal: ModalController,
              public staff: StaffService,
              public ejerciciosService: EjerciciosService) {

    this.estado = this.navParams.data.ejercicio.estado;


    if (this.navParams.data.mensaje) {
      if (this.estado !== 'LEC') {
        this.iniciado = true;
      }
      this.reanudarEjercicio();
    }

    if (this.navParams.data.ejercicio) {
      this.ejercicio = this.navParams.data.ejercicio;
      if (this.estado === 'NOL') {
        this.actualizarEstado('LEC');
      }
    } else {
      this.navCtrl.setRoot('EjerciciosListaPage');
    }

  }

  actualizarEstado(estado) {
    this.ejerciciosService.updateEstado(estado, this.ejercicio.cod_aleatorio).toPromise()
    .then((data) => console.log(data));
  }

  reanudarEjercicio() {
    const {grado_dificultad, cod_categoria, usuario} = this.navParams.data.ejercicio;
    this.ejerciciosService.getEjercicioReanudar(grado_dificultad, cod_categoria, usuario).toPromise()
    .then((data: any) => this.ejercicio = data[0]);
  }

  iniciar() {
    this.openModal('Estas seguro que desea iniciar el ejercicio?', 'iniciar' , 'DES');
  }

  reeleccion() {
    this.openModal('Estas seguro que desea elegir otro ejercicio?', 'reeleccion' , 'ING');
  }

  consultar() {
    if (this.estado !== 'REV') {
      this.openModal('Estas seguro que desea realizar una consulta?', 'consultar' , 'REV');
    } else {
      this.openModalForm('consultar');
    }
  }

  entregar() {
    this.openModal('Estas seguro que desea entregar el ejercicio', 'entregar', 'TER');
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

  openModal(mensaje, accion, estado) {
    let modal = this._modal.create('ModalConfirmacionPage',
      { mensaje: mensaje },
      {  cssClass: 'inset-modal' });

    modal.present();

    modal.onWillDismiss((value) => {

      if (!value) return;

      if (accion == 'reeleccion') {

        this.actualizarEstadoYSalir('ING');

      }

      if (accion == 'iniciar') {

        this.iniciado = true;
        this.actualizarEstado('DES');

      }

      if (accion == 'consultar') {
        this.ejerciciosService.updateEstado('REV', this.ejercicio.cod_aleatorio).toPromise()
        .then((data) => this.openModalForm(accion));
      }

      if (accion == 'entregar') {
        this.ejerciciosService.updateEstado('REV', this.ejercicio.cod_aleatorio).toPromise()
        .then((data) => this.openModalForm(accion));
      }

    })
  }

  openModalForm(accion) {
    let modal = this._modal.create('ModalFormularioPage',
      { accion: accion },
      { cssClass: 'inset-modal' });

    modal.present();

    modal.onWillDismiss(data => {
      if (!data) return;

      if (data == 'DES') {
        this.actualizarEstado(data);
      }

      if (data == 'TER') {
        this.actualizarEstadoYSalir('TER');
      }

    })
  }

  actualizarEstadoYSalir(estado) {
    this.ejerciciosService.updateEstado(estado, this.ejercicio.cod_aleatorio).toPromise()
    .then((data) => this.navCtrl.setRoot('EjerciciosListaPage'));
  }

}
