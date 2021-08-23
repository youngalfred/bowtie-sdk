import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'field-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  constructor() { }

  @Input("label") label?: string = "";
  @Input("for") for?: string = "";
  @Input("image") image?: string = "";

  ngOnInit(): void {
  }

}
