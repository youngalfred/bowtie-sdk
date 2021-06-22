import { Component, Input } from '@angular/core';
import { emptyField, Field } from 'src/types';
import { onChange, onCheck } from 'src/utilities';

@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.css']
})
export class CheckboxFieldComponent {

  constructor() {
  }

  @Input("field") field: Field = emptyField;

  onChangeInternal(e: Event) {
    onCheck(e, this.field.onChange);
  }

}
