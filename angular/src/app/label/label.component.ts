import { Component, Input } from '@angular/core';
import { emptyField } from '../shared/fields';
import { Node } from 'src/types'
@Component({
  selector: 'field-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent {

  constructor() { }
  
  @Input("field") field: Pick<Node, 'id'|'label'|'image'> = emptyField;
}
