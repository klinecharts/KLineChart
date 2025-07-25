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

import type { LineAttrs } from '../extension/figure/line'

import View from './View'

export default class GridView extends View {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()

    const styles = chart.getStyles().grid
    const show = styles.show

    if (show) {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      const horizontalStyles = styles.horizontal
      const horizontalShow = horizontalStyles.show
      if (horizontalShow) {
        const yAxis = pane.getAxisComponent()
        const attrs: LineAttrs[] = yAxis.getTicks().map(tick => {
          // 如果 tick 有自定义的 width，使用 tick.width，否则使用 bounding.width
          const lineWidth = tick.width ?? bounding.width
          return {
            coordinates: [
              { x: 0, y: tick.coord },
              { x: lineWidth, y: tick.coord }
            ]
          }
        })
        this.createFigure({
          name: 'line',
          attrs,
          styles: horizontalStyles
        })?.draw(ctx)
      }
      const verticalStyles = styles.vertical
      const verticalShow = verticalStyles.show
      if (verticalShow) {
        const xAxis = chart.getXAxisPane().getAxisComponent()
        const attrs: LineAttrs[] = xAxis.getTicks().map(tick => {
          // 如果 tick 有自定义的 height，使用 tick.height，否则使用 bounding.height
          const lineHeight = tick.height ?? bounding.height
          return {
            coordinates: [
              { x: tick.coord, y: 0 },
              { x: tick.coord, y: lineHeight }
            ]
          }
        })
        this.createFigure({
          name: 'line',
          attrs,
          styles: verticalStyles
        })?.draw(ctx)
      }
      ctx.restore()
    }
  }
}
