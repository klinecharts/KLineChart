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
import Crosshair from '../common/Crosshair'
import { CrosshairStyle, CrosshairDirectionStyle, YAxisType, StateTextStyle } from '../common/Styles'

import Axis from '../component/Axis'
import YAxis from '../component/YAxis'

import { TextAttrs } from '../extension/figure/text'

import ChartStore from '../store/ChartStore'

import { formatPrecision, formatThousands } from '../common/utils/format'
import { createFont } from '../common/utils/canvas'

import View from './View'

export default class CrosshairHorizontalLabelView<C extends Axis = YAxis> extends View<C> {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getTooltipStore().getCrosshair()
    const styles = chartStore.getStyles().crosshair
    if (crosshair.paneId !== undefined && this.compare(crosshair, pane.getId())) {
      if (styles.show) {
        const directionStyles = this.getDirectionStyles(styles)
        const textStyles = directionStyles.text
        if (directionStyles.show && textStyles.show) {
          const axis = pane.getAxisComponent()
          const text = this.getText(crosshair, chartStore, axis)
          ctx.font = createFont(textStyles.size, textStyles.weight, textStyles.family)
          this.createFigure(
            'text',
            this.getTextAttrs(text, ctx.measureText(text).width, crosshair, bounding, axis, textStyles),
            textStyles
          )?.draw(ctx)
        }
      }
    }
  }

  protected compare (crosshair: Crosshair, paneId: string): boolean {
    return crosshair.paneId === paneId
  }

  protected getDirectionStyles (styles: CrosshairStyle): CrosshairDirectionStyle {
    return styles.horizontal
  }

  protected getText (crosshair: Crosshair, chartStore: ChartStore, axis: Axis): string {
    const yAxis = axis as unknown as YAxis
    const value = axis.convertFromPixel(crosshair.y as number)
    let text: string
    if (yAxis.getType() === YAxisType.Percentage) {
      const visibleDataList = chartStore.getVisibleDataList()
      const fromData = visibleDataList[0]?.data ?? {}
      text = `${((value - fromData.close) / fromData.close * 100).toFixed(2)}%`
    } else {
      const indicators = chartStore.getIndicatorStore().getInstances(crosshair.paneId as string)
      let precision = 0
      let shouldFormatBigNumber = false
      if (yAxis.isInCandle()) {
        precision = chartStore.getPrecision().price
      } else {
        indicators.forEach(indicator => {
          precision = Math.max(indicator.precision, precision)
          if (!shouldFormatBigNumber) {
            shouldFormatBigNumber = indicator.shouldFormatBigNumber
          }
        })
      }
      text = formatPrecision(value, precision)
      if (shouldFormatBigNumber) {
        text = chartStore.getCustomApi().formatBigNumber(text)
      }
    }
    return formatThousands(text, chartStore.getThousandsSeparator())
  }

  protected getTextAttrs (text: string, _textWidth: number, crosshair: Crosshair, bounding: Bounding, axis: Axis, _styles: StateTextStyle): TextAttrs {
    const yAxis = axis as unknown as YAxis
    let x: number
    let textAlign: CanvasTextAlign
    if (yAxis.isFromZero()) {
      x = 0
      textAlign = 'left'
    } else {
      x = bounding.width
      textAlign = 'right'
    }

    return { x, y: crosshair.y as number, text, align: textAlign, baseline: 'middle' }
  }
}
