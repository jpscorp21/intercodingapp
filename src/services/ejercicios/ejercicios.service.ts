import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class EjerciciosService {

  readonly URL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getAllByDificultad(grado_dificultad, cantidad, cod_categoria, usuario) {

    return this.http.get(`http://localhost:3000/ejercicios/all/${usuario}/${cod_categoria}/${grado_dificultad}/${cantidad}`)
  }

  updateEstado(estado, id) {

    return this.http.put(`http://localhost:3000/ejercicios/estado`, {estado, id});
  }

  buscarEstado(usuario, cod_categoria) {

    return this.http.post(`http://localhost:3000/ejercicios/search/estado`, {usuario, cod_categoria});
  }

  getEjercicioReanudar(grado_dificultad, cod_categoria, usuario) {

    return this.http.get(`http://localhost:3000/ejercicios/reanudar/${usuario}/${cod_categoria}/${grado_dificultad}`);
  }

}
