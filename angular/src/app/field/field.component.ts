import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OptionType } from '@youngalfred/bowtie-sdk';
import { InputNode } from '../../types';
import { emptyField } from '../shared/fields';

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit, OnChanges {

  constructor() { }

  @Input("field") field: InputNode = emptyField;
  
  async ngOnInit(): Promise<void> {
    this.field.id === "auto.autos.0.make" && console.log("updated")
    await this.field.applySideEffect?.()
  }

  async ngOnChanges(changes: SimpleChanges) {
    const {value: prevValue, options: prevOptions = []} = changes.field.previousValue || {}
    const {value: currValue, options: newOptions = []} = changes.field.currentValue
    const [longer, shorter]: [OptionType[], OptionType[]] = prevOptions.length > newOptions.length
      ? [prevOptions, newOptions]
      : [newOptions, prevOptions]

    if (
      prevValue !== currValue
        || prevOptions.length !== newOptions.length
        || longer.some((el, idx) => el.name !== shorter[idx]?.name)
    ) {
      await this.field.applySideEffect?.()
    }
  }
}
