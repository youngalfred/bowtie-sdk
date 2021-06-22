import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { onChange } from 'src/utilities';
import { emptyField, Field } from '../../types';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent {

  constructor() { }

  @Input("field") field: Field = emptyField;

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }
}
