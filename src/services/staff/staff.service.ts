import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class StaffService {

  readonly URL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  validarJurado(usuario, password) {

    return this.http.post(`http://localhost:3000/staff/validar`, {usuario, password})
    .toPromise().then((data) => data);

  }

}
