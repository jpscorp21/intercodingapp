import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from '../../app/app.config';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DataService } from '../util/data.service';


@Injectable()
export class EjerciciosService {

  private socket: any;
  private mensajeError: string = 'Error en el servidor';

  constructor(private http: HttpClient, private config: AppConfig, private dataService: DataService) {
    this.socket = io(this.config.url);
  }

  getAllByDificultad(grado_dificultad, cantidad, cod_categoria, usuario) {

    return this.http.get(`${this.config.url}ejercicios/all/${usuario}/${cod_categoria}/${grado_dificultad}/${cantidad}`)
          .catch((error) => {
           this.dataService.error(this.mensajeError);
           return[];
          });
  }

  updateEstado(estado, id) {
    return this.http.put(`${this.config.url}ejercicios/estado`, {estado, id})
          .catch((error: any) => of(false))
  }

  buscarEstado(usuario, cod_categoria) {
    return this.http.post(`${this.config.url}ejercicios/search/estado`, {usuario, cod_categoria})
          .catch((error: any) => {
              this.dataService.error(this.mensajeError);
              return of({});
          });
  }

  getEjercicioReanudar(grado_dificultad, cod_categoria, usuario) {

    return this.http.get(`${this.config.url}ejercicios/reanudar/${usuario}/${cod_categoria}/${grado_dificultad}`)

          .catch((error) => {
            this.dataService.error(this.mensajeError);
            return []
          });
  }

  buscarEjerciciosTerminados(grado_dificultad, cod_categoria, usuario) {
    this.http.post(`${this.config.url}ejercicios/search/estadosterminados`, {usuario, estado: 'TER', cod_categoria, grado_dificultad})
    .subscribe((data) => console.log(data));

  }

  entregarEjercicioSocket(cod_aleatorio) {
    this.socket.emit('entrega_concursante', {cod_aleatorio, estado: 'COR'});
  }

  getVerificadoSocket() {
    let observable = new Observable(observer => {
      this.socket.on('verificado', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

}
