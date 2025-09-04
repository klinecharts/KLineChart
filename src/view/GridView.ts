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
import type { GridStyle } from '../common/Styles'

import View from './View'
import { PaneIdConstants } from '../pane/types'

export default class GridView extends View {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()

    // 判断是否为副图面板，如果是则使用indicator.grid配置，否则使用全局grid配置
    const paneId = pane.getId()
    const isIndicatorPane = paneId !== PaneIdConstants.CANDLE && paneId !== PaneIdConstants.X_AXIS // indicator指标的paneId可以自定义
    const allStyles = chart.getStyles()
    const styles: GridStyle = isIndicatorPane ? allStyles.indicator.grid : allStyles.grid
    const show = styles.show

    if (show) {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      const horizontalStyles = styles.horizontal
      const horizontalShow = horizontalStyles.show
      if (horizontalShow) {
        const yAxis = pane.getAxisComponent()
        const attrs: LineAttrs[] = yAxis.getTicks().map(tick => ({
          coordinates: [
            { x: 0, y: tick.coord },
            { x: bounding.width, y: tick.coord }
          ]
        }))
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
        const attrs: LineAttrs[] = xAxis.getTicks().map(tick => ({
          coordinates: [
            { x: tick.coord, y: 0 },
            { x: tick.coord, y: bounding.height }
          ]
        }))
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
