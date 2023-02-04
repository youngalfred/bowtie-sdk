import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { InputNode, Radio } from 'src/types'
import { emptyField } from '../shared/fields'

@Component({
  selector: 'radio-field',
  templateUrl: './radio-field.component.html',
})
export class RadioFieldComponent implements OnChanges {
  @Input('field') field: Radio = { ...emptyField, kind: 'radio', option: { name: '', label: '' } }
  option?: string = undefined

  ngOnChanges(_: SimpleChanges) {
    this.option = (this.field as Radio)?.option.name
  }

  onChangeInternal(_: Event) {
    this.field.onChange((this.field as Radio).option?.name || '')
  }
}
