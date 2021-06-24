import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Field } from 'src/types';
import { onCheck } from 'src/utilities';
import { emptyField, makeClasses } from '../shared/fields';

@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.css']
})
export class CheckboxFieldComponent implements OnChanges {

  constructor() {
  }

  @Input("field") field: Field = emptyField;
  @Input("highlightErrors") highlightErrors = false;
  classes: string = makeClasses(this.field, this.highlightErrors);

  ngOnChanges(_: SimpleChanges) {
    this.classes = makeClasses(this.field, this.highlightErrors);
  }

  onChangeInternal(e: Event) {
    onCheck(e, this.field.onChange);
  }

}
