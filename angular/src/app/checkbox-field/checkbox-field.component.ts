import { Component, Input } from '@angular/core';
import { InputNode } from 'src/types';
import { onCheck } from 'src/utilities';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.css']
})
export class CheckboxFieldComponent {

  constructor() { }

  @Input("field") field: InputNode = emptyField;

  onChangeInternal(e: Event) {
    onCheck(e, this.field.onChange);
  }

}
