import { Component, OnInit, Input } from '@angular/core';
import { onChange } from 'src/utilities';
import { AppField, OptionType } from '../../types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.css']
})
export class SelectFieldComponent implements OnInit {

  public options: OptionType[] = [];
  constructor() { }

  @Input("field") field: AppField = emptyField;

  ngOnInit(): void {
    const options = this.field?.options || [];
    // Insert an empty option when an option is NOT pre-selected
    this.options = this.field.value ? options : [{ name: "", label: "" }, ...options];
  }

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }

}
