import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @ViewChild('barra') barra: ElementRef;

  constructor() {
    console.log('Hello ProgressBarComponent Component');
    console.log(this.barra);
  }

}
