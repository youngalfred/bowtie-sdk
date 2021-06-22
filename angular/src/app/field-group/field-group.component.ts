import { Component, Input } from '@angular/core';
const emptyGroup = { children: [], id: "", kind: "", label: "", classes: [], valid: { valid: true, msg: "" } };

@Component({
  selector: 'field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})
export class FieldGroupComponent {

  constructor() { }

  @Input("fg") fg = emptyGroup;

}
