import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { AuthService } from '../../services/auth/auth.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  ngForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _toast: ToastController,
              private _auth: AuthService) {
    this.initForm();

    localStorage.removeItem('USER_APP');
    this._auth.logout();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  initForm() {
    this.ngForm = new FormGroup({
      usuario: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  login() {

    if (this.ngForm.valid) {

      this._auth.login({
        usuario: this.ngForm.value.usuario,
        password: this.ngForm.value.password
      }).then((data: any) => {
          console.log(data);
          localStorage.setItem('USER_APP', JSON.stringify(data));
          this.navCtrl.setRoot('InicioPage');

      }).catch((error) => {
        this.showToast('El usuario no esta registrado en la base de datos');
      });

    }
  }


  showToast(mensaje: string) {

    let toast = this._toast.create({
      message: mensaje,
      position: 'bottom',
      duration: 3000
    })

    toast.present();

  }
}
