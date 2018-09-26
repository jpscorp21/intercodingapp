import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';

@Injectable()
export class AuthService {

  readonly URL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient,
              ) {}

  login(obj) {

    return this.http.post('http://localhost:3000/api/v1/login', obj).toPromise();

  }

  goLogin() {
    //this.navCtrl.setRoot('LoginPage');
  }

}
