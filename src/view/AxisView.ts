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

import Bounding from '../common/Bounding'

import { LineAttrs } from '../template/figure/line'
import { TextAttrs } from '../template/figure/text'

import { AxisStyle, Styles } from '../store/styles'

import Axis, { Tick } from '../componentl/Axis'

import View from './View'

export default abstract class AxisView<C extends Axis> extends View<C> {
  drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const axis = pane.getAxisComponent()
    const chartStore = pane.getChart().getChartStore()
    const styles: AxisStyle = this.getAxisStyles(chartStore.getStyleOptions())
    if (styles.show) {
      if (styles.axisLine.show) {
        this.createFigure('line', this.createAxisLine(bounding, styles))?.draw(ctx)
      }
      const ticks = axis.getTicks()
      if (styles.tickLine.show) {
        const lines = this.createTickLines(ticks, bounding, styles)
        lines.forEach(line => {
          this.createFigure('line', line)?.draw(ctx)
        })
      }
      if (styles.tickText.show) {
        const texts = this.createTickTexts(ticks, bounding, styles)
        texts.forEach(text => {
          this.createFigure('text', text)?.draw(ctx)
        })
      }
    }
  }

  protected abstract getAxisStyles (styles: Styles): AxisStyle

  protected abstract createAxisLine (bounding: Required<Bounding>, styles: AxisStyle): LineAttrs
  protected abstract createTickLines (ticks: Tick[], bounding: Required<Bounding>, styles: AxisStyle): LineAttrs[]
  protected abstract createTickTexts (tick: Tick[], bounding: Required<Bounding>, styles: AxisStyle): TextAttrs[]
}
