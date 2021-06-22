import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onChange } from 'src/utilities';
import { Field, OptionType } from '../../types';
import { emptyField, makeClasses } from '../shared/fields';

@Component({
  selector: 'select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.css']
})
export class SelectFieldComponent implements OnInit, OnChanges {

  public options: OptionType[] = [];
  constructor() { }

  @Input("field") field: Field = emptyField;
  @Input("highlightErrors") highlightErrors = false;
  classes: string = makeClasses(this.field, this.highlightErrors);

  ngOnChanges(_: SimpleChanges) {
    this.classes = makeClasses(this.field, this.highlightErrors);
  }

  ngOnInit(): void {
    const options = this.field?.options || [];
    // Insert an empty option when an option is NOT pre-selected
    this.options = this.field.value ? options : [{ name: "", label: "" }, ...options];
  }

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange);
  }

}
