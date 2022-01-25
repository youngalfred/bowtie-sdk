import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onChange } from 'src/utilities';
import { AppField } from '../../types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements OnChanges {

  constructor() { }
  value: string = "";
  @Input("field") field: AppField = emptyField;

  ngOnChanges(_: SimpleChanges) {
    this.value = this.field.value;
  }

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }
}
