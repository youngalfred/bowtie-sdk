import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'field-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent {

  constructor() { }

  @Input("label") label?: string = "";
  @Input("for") fieldname?: string = "";
  @Input("decoration") image: string = "";

}
