import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppFieldGroup, GroupOrField } from 'src/types';
import { uniqueFGs } from 'src/utilities/groupModifiers';
import { DECORATORS } from '../decorators/question-images';
import { emptyField } from '../shared/fields';
export const emptyGroup = { ...emptyField, children: [] };
@Component({
  selector: 'field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})

export class FieldGroupComponent implements OnChanges, OnInit {

  constructor() { }

  @Input("fg") parentFg: AppFieldGroup = emptyGroup;

  fg: AppFieldGroup = this.parentFg;
  decoration: Record<string, string> = {};

  ngOnChanges(_: SimpleChanges) {
    this.fg = uniqueFGs[this.parentFg.id]?.(this.parentFg) || this.parentFg;
  }

  ngOnInit(): void {
    this.decoration = DECORATORS[this.fg.id] || {};
  }

  getDecoration = (id: string): string => this.decoration[id.split(".").pop() || ""] as string || "";
  isInputField = (kind: string): boolean => ["check", "text", "select", "radio"].includes(kind);

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: GroupOrField) => item.id;

}
