import { Component, Input, OnInit } from '@angular/core';
import { emptyGroup } from '../field-group/field-group.component';
import { Node } from 'src/types'

@Component({
  selector: 'renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss']
})
export class RendererComponent implements OnInit {

  constructor() { }

  @Input("node") node: Node = emptyGroup;
  @Input("depth") depth: number = 0;
  @Input("highlightErrors") highlightErrors: boolean = false;
  
  newDepth: number = this.depth + 1

  ngOnInit(): void {
  }

  isInputField = (kind: string): boolean => ["check", "text", "select", "radio", "file"].includes(kind);
}
