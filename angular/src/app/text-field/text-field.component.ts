import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onChange } from 'src/utilities';
import { Field } from '../../types';
import { emptyField, makeClasses } from '../shared/fields';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements OnChanges {

  constructor() { }

  @Input("field") field: Field = emptyField;
  @Input("highlightErrors") highlightErrors = false;
  classes: string = makeClasses(this.field, this.highlightErrors);

  ngOnChanges(_: SimpleChanges) {
    this.classes = makeClasses(this.field, this.highlightErrors);
  }

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }
}
