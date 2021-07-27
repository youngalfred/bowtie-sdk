import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onChange } from 'src/utilities';
import { AppField } from '../../types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent {

  constructor() { }

  @Input("field") field: AppField = emptyField;

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }
}
