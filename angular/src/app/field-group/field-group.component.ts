import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Fieldgroup, Node } from 'src/types';
import { modifyFieldGroup } from 'src/utilities/modifiers/groups';
import { DECORATORS } from '../decorators/question-images';

export const emptyGroup: Fieldgroup = { id: "", kind: "fieldgroup", label: "", classes: "", children: [] };
@Component({
  selector: 'field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})

export class FieldGroupComponent implements OnChanges, OnInit {

  constructor() { }

  @Input("fg") fg: Fieldgroup = emptyGroup;
  @Input("highlightErrors") highlightErrors: boolean = false;
  @Input("depth") depth: number = 0;

  decoration: Record<string, string> = {};

  ngOnChanges(_: SimpleChanges) {
    this.fg = modifyFieldGroup(this.fg);
  }

  ngOnInit(): void {
    this.fg = modifyFieldGroup(this.fg);
    this.decoration = DECORATORS[this.fg.id] || {};
  }

  decorate = (field: Node): Node => field.kind === 'fieldgroup'
  ? field
  : ({
    ...field,
    image: this.decoration[field.id.split(".").pop() || ""] as string || ""
  });

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: Node) => item.id;

}
