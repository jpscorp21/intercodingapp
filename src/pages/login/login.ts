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

    localStorage.removeItem('intToken');
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

        if (data) {

          console.log(data.data);
          localStorage.setItem('intToken', data.data);
          this.navCtrl.setRoot('InicioPage');

        }


      }).catch((error) => {
        this.showToast(error.error.message);
      });

    }

    console.log(this.ngForm.value);
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
