import { Component, Input } from '@angular/core'
import { onChange } from 'src/utilities'
import { InputNode } from '../../types'
import { emptyField } from '../shared/fields'

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css'],
})
export class TextFieldComponent {
  constructor() {}

  @Input('field') field: InputNode = emptyField

  onChangeInternal(e: Event) {
    onChange(e, this.field.onChange)
  }
}
