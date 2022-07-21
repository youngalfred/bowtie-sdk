import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { InputNode, Fieldgroup, Node } from 'src/types';
import modifyWindMitField from 'src/utilities/modifiers/windmit';
import { emptyGroup } from '../field-group/field-group.component';

@Component({
  selector: 'wind-mitigation',
  templateUrl: './wind-mitigation.component.html',
  styleUrls: ['./wind-mitigation.component.scss']
})
export class WindMitigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  @Input("fg") fg: Fieldgroup = emptyGroup;
  @Input("depth") depth: number = 0;

  flattenModifiedChildren = (fieldgroup: Fieldgroup): InputNode[] => {
    const assembleFieldset = (acc: InputNode[], field: Node): InputNode[] => {
      const { children = [] } = field as Fieldgroup
      if (children.length) {
          return children.reduce(assembleFieldset, acc)
      }

      return acc.concat(modifyWindMitField(field as InputNode))
    }

    return fieldgroup.children.reduce(assembleFieldset, [])
  }

  // Prevents infinite re-render when wind mit is in effect
  trackBy = (_: number, item: Node) => item.id;
}
