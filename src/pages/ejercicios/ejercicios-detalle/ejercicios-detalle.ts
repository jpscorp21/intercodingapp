import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, LoadingController } from 'ionic-angular';
import { Ejercicios } from '../../../models/ejercicios';
import { EjerciciosService } from '../../../services/ejercicios/ejercicios.service';
import { StaffService } from '../../../services/staff/staff.service';
import 'rxjs/add/operator/last';
import { Subscription } from '../../../../node_modules/rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-ejercicios-detalle',
  templateUrl: 'ejercicios-detalle.html',
})
export class EjerciciosDetallePage {

  ejercicio: Ejercicios;
  iniciado: boolean = false;
  estado: string = "";
  loadingCorrigiendo: any;
  subscriptor: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _popover: PopoverController,
              private _modal: ModalController,
              public staff: StaffService,
              public loading: LoadingController,
              public ejerciciosService: EjerciciosService) {


    this.crearLoading();

    if (!this.navParams.data.ejercicio) {
      this.navCtrl.setRoot('EjerciciosListaPage');
      return;
    }

    this.estado = this.navParams.data.ejercicio.estado;
    this.ejercicio = this.navParams.data.ejercicio;
    console.log(this.estado);

    // cuando llega la correcion del jurado
    this.subscriptor = this.ejerciciosService.getVerificadoSocket().subscribe((data: any) => {

      console.log(data);

      if (data.cod_aleatorio === this.ejercicio.cod_aleatorio ) {

        this.detenerLoading();
        if (data.estado == "TER") this.navCtrl.setRoot('EjerciciosListaPage');
        //if (data.estado == "DES") this.actualizarEstado(data.estado);
      }

    })

    // en caso de mensaje de reanudar
    if (this.navParams.data.mensaje) {
      this.iniciado = this.estado !== 'LEC';
      this.reanudarEjercicio();
    }

    // comprobar estados
    if (this.estado === 'NOL') this.actualizarEstado('LEC');
    if (this.estado == 'COR') this.iniciarLoading();

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
        this.ejerciciosService.updateEstado('COR', this.ejercicio.cod_aleatorio).toPromise()
        .then((data) => {
          this.ejerciciosService.entregarEjercicioSocket(this.ejercicio.cod_aleatorio)
          this.iniciarLoading();
        });
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

  crearLoading() {
    this.loadingCorrigiendo = this.loading.create({
      spinner: 'hide',
      content: 'Esperando...'
    });
  }

  detenerLoading() {
    if (this.loadingCorrigiendo){
      this.loadingCorrigiendo.dismiss();
      this.loadingCorrigiendo = null;
    }
  }

  iniciarLoading() {
    this.crearLoading();
    this.loadingCorrigiendo.present();
    setTimeout(() => this.detenerLoading(), 5000);
  }

  ionViewDidLeave() {
    if (this.subscriptor) {
      this.subscriptor.unsubscribe();
    }
  }

  ionViewWillLeave() {

  }

}
