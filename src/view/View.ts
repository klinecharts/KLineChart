/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TypeOrNull from '../common/TypeOrNull'
import { ElementEventHandler } from '../common/Element'
import ElementGroup from '../common/ElementGroup'

import FigureTemplate from '../componentl/Figure'
import { createFigure as create } from '../extension/figure/index'

import Axis from '../componentl/Axis'

import Widget from '../widget/Widget'

export default abstract class View<C extends Axis = Axis> extends ElementGroup {
  private readonly _widget: Widget<C>

  constructor (widget: Widget<C>) {
    super()
    this._widget = widget
  }

  getWidget (): Widget<C> { return this._widget }

  protected createFigure (name: string, attrs: any, styles: any, eventHandler?: ElementEventHandler): TypeOrNull<FigureTemplate> {
    const figure = create(name, attrs, styles)
    if (figure !== null && eventHandler !== undefined) {
      for (const key in eventHandler) {
        // eslint-disable-next-line no-prototype-builtins
        if (eventHandler.hasOwnProperty(key)) {
          figure.registerEvent(key, eventHandler[key])
        }
      }
      this.addElement(figure)
    }
    return figure
  }

  /**
   * 绘制
   */
  draw (ctx: CanvasRenderingContext2D): void {
    this.clear()
    this.drawImp(ctx)
  }

  protected abstract drawImp (ctx: CanvasRenderingContext2D): void
}
