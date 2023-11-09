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

import Nullable from '../common/Nullable'
import { EventHandler, EventName } from '../common/SyntheticEvent'
import Eventful from '../common/Eventful'

import Figure from '../component/Figure'
import { getInnerFigureClass } from '../extension/figure/index'

import DrawWidget from '../widget/DrawWidget'
import DrawPane from '../pane/DrawPane'

import Axis from '../component/Axis'

export default abstract class View<C extends Axis = Axis> extends Eventful {
  /**
   * Parent widget
   */
  private readonly _widget: DrawWidget<DrawPane<C>>

  constructor (widget: DrawWidget<DrawPane<C>>) {
    super()
    this._widget = widget
  }

  getWidget (): DrawWidget<DrawPane<C>> { return this._widget }

  protected createFigure (name: string, attrs: any, styles: any, eventHandler?: EventHandler): Nullable<Figure> {
    const FigureClazz = getInnerFigureClass(name)
    if (FigureClazz !== null) {
      const figure = new FigureClazz({ name, attrs, styles })
      if (eventHandler !== undefined) {
        for (const key in eventHandler) {
          // eslint-disable-next-line no-prototype-builtins
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

  draw (ctx: CanvasRenderingContext2D): void {
    this.clear()
    this.drawImp(ctx)
  }

  protected abstract drawImp (ctx: CanvasRenderingContext2D): void
}
