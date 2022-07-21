import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Fieldgroup, Node } from 'src/types';

export const emptyGroup: Fieldgroup = { id: "", decoration: {}, kind: "fieldgroup", label: "", classes: "", children: [] };
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

  ngOnChanges(_: SimpleChanges) {}

  ngOnInit(): void {}

  decorate = (field: Node): Node => ({
    ...field,
    image: this.fg.decoration[field.id.split(".").pop() || ""] as string || ""
  });

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: Node) => item.id;

}
