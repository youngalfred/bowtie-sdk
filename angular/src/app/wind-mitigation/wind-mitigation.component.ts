import { Component, Input, OnInit } from '@angular/core';
import { InputNode, Fieldgroup, Node } from 'src/types';
import modifyWindMitField from 'src/utilities/modifiers/windmit';
import { emptyGroup } from '../field-group/field-group.component';

@Component({
  selector: 'wind-mitigation',
  templateUrl: './wind-mitigation.component.html',
  styleUrls: ['./wind-mitigation.component.css']
})
export class WindMitigationComponent implements OnInit {

  constructor() { }
  children: InputNode[] = []

  ngOnInit(): void {
    this.children = this.flattenModifiedChildren(this.fg)
  }

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

}
