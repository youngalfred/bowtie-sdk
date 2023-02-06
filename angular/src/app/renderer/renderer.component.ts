import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { emptyGroup } from '../field-group/field-group.component'
import { Node } from 'src/types'

@Component({
  selector: 'renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss'],
})
export class RendererComponent implements OnChanges, OnInit {
  constructor() {}

  @Input('node') node: Node = emptyGroup
  @Input('depth') depth: number = 0
  @Input('highlightErrors') highlightErrors: boolean = false

  newDepth: number = this.depth + 1

  ngOnInit(): void {}

  async ngOnChanges(changes: SimpleChanges) {
    this.node = changes.node.currentValue
  }

  isInputField = (kind: string): boolean =>
    ['check', 'text', 'select', 'radio', 'file'].includes(kind)
}
