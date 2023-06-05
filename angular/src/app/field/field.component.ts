import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { OptionType } from '@youngalfred/bowtie-sdk'
import { InputNode } from '../../types'
import { emptyField } from '../shared/fields'

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent {
  constructor() {}

  @Input('field') field: InputNode = emptyField
}
