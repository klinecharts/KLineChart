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

import Eventful from '../common/Eventful'
import type { EventHandler, EventName, MouseTouchEvent } from '../common/EventHandler'
import type Nullable from '../common/Nullable'
import { isValid } from '../common/utils/typeChecks'
import type { Axis } from '../component/Axis'
import type Figure from '../component/Figure'
import type { FigureCreate } from '../component/Figure'

import { getInnerFigureClass } from '../extension/figure/index'
import type DrawPane from '../pane/DrawPane'
import type DrawWidget from '../widget/DrawWidget'

export default abstract class View<C extends Axis = Axis> extends Eventful {
  /**
   * Parent widget
   */
  private readonly _widget: DrawWidget<DrawPane<C>>

  constructor(widget: DrawWidget<DrawPane<C>>) {
    super()
    this._widget = widget
  }

  getWidget(): DrawWidget<DrawPane<C>> {
    return this._widget
  }

  protected createFigure(create: FigureCreate, eventHandler?: EventHandler): Nullable<Figure> {
    const FigureClazz = getInnerFigureClass(create.name)
    if (FigureClazz !== null) {
      const figure = new FigureClazz(create)
      if (isValid(eventHandler)) {
        for (const key in eventHandler) {
          // biome-ignore lint/suspicious/noPrototypeBuiltins: Event handlers may inherit their own implementation.
          if (eventHandler.hasOwnProperty(key)) {
            figure.registerEvent(key as EventName, eventHandler[key])
          }
        }
        this.addChild(figure)
      }
      return figure
    }
    return null
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.clear()
    this.drawImp(ctx)
  }

  checkEventOn(_: MouseTouchEvent): boolean {
    return true
  }

  protected abstract drawImp(ctx: CanvasRenderingContext2D): void
}
