import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

  private isLogin: boolean = false;

  constructor(private http: HttpClient) {}

  login(obj) {

    return this.http.post('http://localhost:3000/concursantes/login', obj)
    .do((data) => {
      this.isLogin = true;
    }).toPromise()

  }

  goLogin() {
    //this.navCtrl.setRoot('LoginPage');
  }

  logout() {
    this.isLogin = false;
  }

  authenticated() {
    return this.isLogin;
  }

}
