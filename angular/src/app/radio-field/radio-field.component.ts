import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppField } from 'src/types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'radio-field',
  templateUrl: './radio-field.component.html',
})
export class RadioFieldComponent implements OnChanges {

  @Input("field") field: AppField = emptyField;
  option?: string = undefined;

  ngOnChanges(_: SimpleChanges) {
    this.option = this.field.options?.[0]?.name;
  }

  onChangeInternal(_: Event) {
    this.field.onChange(this.field.options?.[0]?.name || "");
  }
}
