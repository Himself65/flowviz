import { ArrayXY, Container, Element } from '@svgdotjs/svg.js'

import { ShapeViewBox } from '../common/type'
import { Connectable, Draggable } from '../event'

interface CirclePointProp {
  top: ArrayXY
  right: ArrayXY
  bottom: ArrayXY
  left: ArrayXY
}

export type CirclePointType = keyof CirclePointProp

export abstract class Node {
  dragging: boolean = false
  screw: number = 0
  viewBox: ShapeViewBox
  offsetX: number = 0
  offsetY: number = 0
  circleGroup: Container;
  circlePoint: CirclePointProp;

  protected constructor (viewBox: ShapeViewBox) {
    this.viewBox = viewBox
  }

  abstract addTo(container: Container): Element

  addToContainer (container: Container): Element {
    const group = container.group()
    this.bindEvent(group)
    this.addTo(group).move(this.viewBox.x, this.viewBox.y).center(this.viewBox.x, this.viewBox.y).attr({
      fill: '#fff',
      stroke: '#000'
    })
    if (this.viewBox.text) {
      this.addText(group, this.viewBox.text)
    }
    this.addDot(group)

    group.css('cursor', 'move')
    return group
  }

  addDot (container: Container): Element {
    const screwOffset = this.screw ? this.screw / 2 : 0

    this.circleGroup = container.group()
    const x1 = this.viewBox.x
    const y1 = this.viewBox.y - this.viewBox.height / 2
    const top: ArrayXY = [x1, y1]

    const x2 = this.viewBox.x + this.viewBox.width / 2 - screwOffset
    const y2 = this.viewBox.y
    const right: ArrayXY = [x2, y2]

    const x3 = this.viewBox.x
    const y3 = this.viewBox.y + this.viewBox.height / 2
    const bottom: ArrayXY = [x3, y3]

    const x4 = this.viewBox.x - this.viewBox.width / 2 + screwOffset
    const y4 = this.viewBox.y
    const left: ArrayXY = [x4, y4]

    this.renderDot(this.circleGroup, top)
    this.renderDot(this.circleGroup, right)
    this.renderDot(this.circleGroup, bottom)
    this.renderDot(this.circleGroup, left)

    this.circlePoint = { top, right, bottom, left }

    return this.circleGroup.hide()
  }

  private renderDot (container: Container, xy: ArrayXY): Element {
    const circle = container.circle(4)
    const [x, y] = xy
    return circle.fill('#fff').move(x, y).center(x, y).attr({
      strokeWidth: 1,
      stroke: '#0b0'
    })
  }

  addText (container: Container, text: string): Element {
    const x = this.viewBox.x
    const y = this.viewBox.y
    return container.text(text).move(x, y).center(x, y)
  }

  bindEvent (element: Element) {
    Connectable.call(this, element)
    if (this.viewBox.isDraggable) {
      Draggable.call(this, element)
    }
  }
}
