import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppFieldGroup, GroupOrField } from 'src/types';
import { uniqueFGs } from 'src/utilities/groupModifiers';
import { emptyField } from '../shared/fields';
export const emptyGroup = { ...emptyField, children: [] };

@Component({
  selector: 'field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})

export class FieldGroupComponent implements OnChanges {

  constructor() { }

  @Input("fg") parentFg: AppFieldGroup = emptyGroup;

  fg: AppFieldGroup = this.parentFg;

  ngOnChanges(_: SimpleChanges) {
    this.fg = uniqueFGs[this.parentFg.id]?.(this.parentFg) || this.parentFg;
  }

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: GroupOrField) => item.id;

}
