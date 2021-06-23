import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { makeClasses } from '../shared/fields';
const emptyGroup = { children: [], id: "", kind: "", label: "", classes: [], valid: { valid: true, msg: "" } };

@Component({
  selector: 'field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})
export class FieldGroupComponent implements OnChanges {

  constructor() { }

  @Input("fg") fg = emptyGroup;
  @Input("highlightErrors") highlightErrors = false;
  classes: string = makeClasses(this.fg, this.highlightErrors);

  ngOnChanges(_: SimpleChanges) {
    this.classes = makeClasses(this.fg, this.highlightErrors);
  }

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: any) => item.id;

}
