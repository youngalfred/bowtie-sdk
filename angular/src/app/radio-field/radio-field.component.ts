import { Component, Input } from '@angular/core';
import { AppField } from 'src/types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'radio-field',
  templateUrl: './radio-field.component.html',
  styleUrls: ['./radio-field.component.css']
})
export class RadioFieldComponent {

  @Input("field") field: AppField = emptyField;
  option = this.field.options?.[0]?.name;

  onChangeInternal(_: Event) {
    this.field.onChange(this.field.options?.[0]?.name || "");
  }
}
